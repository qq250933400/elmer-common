import { StaticCommon } from "./StaticCommon";
// tslint:disable-next-line: interface-over-type-literal
export type TypeQueueCallOption = {
    id: string;
    lastKey: string;
    lastResult: any;
    param: any;
};
export type TypeQueueCallFunction = (option:TypeQueueCallOption, param: any) => {};

// tslint:disable-next-line: interface-over-type-literal
export type TypeQueueCallParam = {
    id: string;
    params: any;
    owner: any;
    fn: TypeQueueCallFunction;
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
/**
 * 按队列调用异步函数或普通函数
 * @param paramList {TypeQueueCallParam[]} 队列参数
 * @param fn 循环调用的方法，如果params.fn 没有设置将会调用fn参数
 */
export const queueCallFunc = async (paramList:TypeQueueCallParam[], fn?:TypeQueueCallFunction): Promise<any> => {
    return new Promise((resolve) => {
        const doActionData = {};
        const Result = {};
        const keyArr = [];
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
                            Result[key] = {
                                statusCode: "QueueCall_602",
                                // tslint:disable-next-line: object-literal-sort-keys
                                excpetion: err
                            };
                            goNext(key);
                        });
                    } else {
                        Result[key] = yResult.value;
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
        if(StaticCommon.isArray(paramList) && paramList.length>0) {
            paramList.map((tParam:TypeQueueCallParam, index:number) => {
                let lastKey = index > 0 && paramList[index - 1] ? paramList[index - 1].id : undefined;
                keyArr.push(tParam.id);
                doActionData[tParam.id] = ((options, lKey) => {
                    return (lstResult) => {
                        const lstKey = lKey;
                        const paramValue = options.params;
                        const handler = options.owner || this;
                        const operateCallback = typeof options.fn === "function" ? options.fn : fn;
                        // tslint:disable-next-line: variable-name
                        const _option = {
                            id: options.id,
                            lastKey: lstKey,
                            lastResult: lstResult,
                            params: options.params
                        };
                        if(StaticCommon.isArray(paramValue)) {
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
            doNext(paramList[0].id, undefined)();
        } else {
            resolve({});
        }
    });
};
