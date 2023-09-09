import { utils } from "../utils";
import { queueCallFunc } from "./QueueCallFun";

export class Observe<EventHandler={}> {
    private listener: any = {};
    /**
     * 监听事件
     * @param eventName - 事件名称
     * @param callback - 事件处理回调函数
     * @returns 销毁事件
     */
    public on<EventName extends keyof EventHandler>(eventName: EventName, callback: EventHandler[EventName]): Function {
        const evtId = "Observe_evt_" + utils.guid();
        if(typeof callback !== "function") {
            throw new Error("事件监听回调参数不是Function。");
        }
        if(!this.listener[eventName]) {
            this.listener[eventName] = {
                eventIds: [],
                handlers: {}
            };
        }
        this.listener[eventName].handlers[evtId] = callback;
        this.listener[eventName].eventIds.push(evtId);
        return ()=> {
            const evtIndex = this.listener[eventName].eventIds.indexOf(evtId);
            this.listener[eventName].eventIds.splice(evtIndex, 1);
            delete this.listener[eventName].handlers[evtId];
            if(this.listener[eventName].eventIds.length <= 0) {
                delete this.listener[eventName];
            }
        };
    }
    /**
     * 解除事件绑定， 如果eventName为空时默认删除所有事件
     * @param eventName - 要删除的事件名称
     */
    unBind<EventName extends keyof EventHandler>(eventName?: EventName):void {
        if(!utils.isEmpty(eventName)) {
            delete this.listener[eventName];
        } else {
            this.listener = {};
        }
    }
    /**
     * 触发事件监听
     * @param eventName - 事件名称
     * @param args - 传递参数
     * @returns 
     */
    emit<EventName extends keyof EventHandler>(eventName: EventName, ...args: any[]): any {
        return new Promise((resolve, reject) => {
            if(this.listener[eventName]) {
                const eventIds = this.listener[eventName].eventIds || [];
                queueCallFunc([ ...eventIds, {
                    id: "LastResult",
                    params: "",
                    // tslint:disable-next-line: object-literal-sort-keys
                    fn: (opt) => {
                        return opt.lastResult;
                    }
                } ], (opt, eventId)=>{
                    const callback = this.listener[eventName].handlers[eventId];
                    return callback(...args);
                }, {
                    throwException: true,
                    // tslint:disable-next-line: object-literal-sort-keys
                    paramConvert: (evtId: string) => {
                        if(typeof evtId === "string") {
                            return {
                                id: evtId,
                                params: evtId
                            };
                        } else {
                            return evtId;
                        }
                    }
                }).then((data) => resolve(data.LastResult))
                .catch(reject);
            } else {
                resolve(null);
            }
        });
    }
}
