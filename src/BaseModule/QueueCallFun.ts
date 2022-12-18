import { utils } from "../utils";

// tslint:disable-next-line: interface-over-type-literal
export type TypeQueueCallOption = {
    id: string;
    lastKey: string;
    lastResult: any;
    param: any;
    result: any;
};

export type TypeQueueCallFunction = (option:TypeQueueCallOption, param: any) => {};

// tslint:disable-next-line: interface-over-type-literal
export type TypeQueueCallParam = {
    id: string;
    params?: any;
    owner?: any;
    fn?: TypeQueueCallFunction;
};

// tslint:disable-next-line: interface-over-type-literal
export type TypeQueueCallConfig<T={}> = {
    throwException: boolean;
    paramConvert?: (param: TypeQueueCallParam |T, index: number) => TypeQueueCallParam;
    onBefore?(params: TypeQueueCallParam[]|T[]): void;
};


const callYieldFunc = function* <T>(callbackObj:{[P in keyof T]:Function}):any {
    const result = {};
    if(callbackObj) {
        const keys = Object.keys(callbackObj);
        if(keys.length>0) {
            for(let index=0,mLen=keys.length;index<mLen;index++) {
                const key = keys[index];
                const callback = callbackObj[key];
                if(typeof callback === "function") {
                    const lastKey = keys[index - 1];
                    result[key] = yield callback(result[lastKey]);
                } else {
                    result[key] = {
                        statusCode: "QueueCall_601",
                        // tslint:disable-next-line: object-literal-sort-keys
                        message: `The ${key}'s fn attribute is not a function`
                    };
                }
            }
        }
    }
    return result;
};

export const queueCallRaceAll = async (paramList: TypeQueueCallParam[], fn?:TypeQueueCallFunction, option?: TypeQueueCallConfig): Promise<any> => {
    return new Promise((resolve, reject) => {
        if(paramList && paramList.length > 0) {
            const allStatus = {};
            const allResult = {};
            const checkAllStatus = () => {
                let hasError = false;
                // tslint:disable-next-line: forin
                for(const key in allStatus) {
                    if(allStatus[key] === "PENDING") {
                        return;
                    }
                    if(allStatus[key] === "ERROR") {
                        hasError = true;
                        break;
                    }
                }
                if(hasError) {
                    reject(allResult);
                } else {
                    resolve(allResult);
                }
            };
            paramList.map((item: TypeQueueCallParam, index:number) => {
                const taskID = "queueCall" + index;
                allStatus["queueCall" + index] = "PENDING";
                ((param:TypeQueueCallParam, taskId: string): void => {
                    const callback = typeof param.fn === "function" ? param.fn : fn;
                    if(typeof callback === "function") {
                        // tslint:disable-next-line: no-inferred-empty-object-type
                        const callbackResult = callback({
                            id: param.id,
                            lastKey: null,
                            lastResult: null,
                            param: param.params,
                            result: allResult
                        }, param.params);
                        if(utils.isPromise(callbackResult)) {
                            callbackResult.then((resp:any) => {
                                allResult[param.id] = resp;
                                allStatus[taskID] = "OK";
                                checkAllStatus();
                            }).catch((error) => {
                                allResult[param.id] = {
                                    statusCode: "Fail",
                                    // tslint:disable-next-line: object-literal-sort-keys
                                    exception: error,
                                    message: error.message || error.statusText || "Unknow error",
                                };
                                allStatus[taskID] = "ERROR";
                                checkAllStatus();
                            });
                        } else {
                            allResult[param.id] = callbackResult;
                            allStatus[taskID] = "OK";
                            checkAllStatus();
                        }
                    } else {
                        allResult[param.id] = {
                            statusCode: "Fail",
                            // tslint:disable-next-line: object-literal-sort-keys
                            message: "the fn callback is not a function"
                        };
                        checkAllStatus();
                    }
                })(item, taskID);
            });
        } else {
            resolve({});
        }
    });
};

/**
 * 按队列调用异步函数或普通函数
 * @param paramList {TypeQueueCallParam[]} 队列参数
 * @param fn 循环调用的方法，如果params.fn 没有设置将会调用fn参数
 */
export const queueCallFunc = async <T={}>(paramList: TypeQueueCallParam[]|T[], fn?:TypeQueueCallFunction, option?: TypeQueueCallConfig): Promise<any> => {
    return new Promise((resolve, reject) => {
        const doActionData = {};
        const Result = {};
        const keyArr = [];
        const newParamsList = [];
        let yieldResult:Generator = null;
        const doNext =(key:any, lastKey:any):Function => {
            return () => {
                const yResult = yieldResult.next(Result[lastKey]);
                if(!yResult.done) {
                    if(yResult.value && typeof yResult.value.toString === "function" && yResult.value.toString() === "[object Promise]") {
                        yResult.value.then((resp) => {
                            Result[key] = resp;
                            goNext(key);
                        }).catch((err) => {
                            if(!option || !option.throwException) {
                                Result[key] = {
                                    statusCode: "QueueCall_602",
                                    // tslint:disable-next-line: object-literal-sort-keys
                                    exception: err
                                };
                                goNext(key);
                            } else if(option && option.throwException) {
                                reject({
                                    exception: err,
                                    message: err?.message,
                                    statusCode: "QueueCall_603",
                                });
                            }
                        });
                    } else {
                        Result[key] = yResult.value;
                        goNext(key);
                    }
                } else {
                    resolve(Result);
                }
                return yResult;
            };
        };
        const goNext = (key:any):void => {
            const index = keyArr.indexOf(key);
            const nextKey = keyArr[index + 1];
            doNext(nextKey, key)();
        };
        if(utils.isArray(paramList) && paramList.length>0) {
            typeof option?.onBefore === "function" && option?.onBefore(paramList);
            (paramList as TypeQueueCallParam[]).map((xParam:TypeQueueCallParam, index:number) => {
                let lastKey = index > 0 && paramList[index - 1] ? (paramList[index - 1] as TypeQueueCallParam).id : undefined;
                const tParam = typeof option?.paramConvert === "function" ? option.paramConvert(xParam, index) || xParam : xParam;
                keyArr.push(tParam.id);
                newParamsList.push(tParam);
                doActionData[tParam.id] = ((opt, lKey) => {
                    return (lstResult) => {
                        const lstKey = lKey;
                        const paramValue = opt.params;
                        const handler = opt.owner || this;
                        const operateCallback = typeof opt.fn === "function" ? opt.fn : fn;
                        // tslint:disable-next-line: variable-name
                        const _option = {
                            id: opt.id,
                            lastKey: lstKey,
                            lastResult: lstResult,
                            params: opt.params,
                            result: Result
                        };
                        if(utils.isArray(paramValue)) {
                            paramValue.unshift(_option);
                            return operateCallback.apply(handler, paramValue);
                        } else {
                            return operateCallback.call(handler, _option, paramValue);
                        }
                    };
                })(tParam, lastKey);
                lastKey = null;
            });
            yieldResult = callYieldFunc(doActionData);
            doNext(newParamsList[0].id, undefined)();
        } else {
            resolve({});
        }
    });
};
