import "reflect-metadata";
import { CONST_DECORATOR_FOR_MODULE_INSTANCEID } from "./const";
import { utils } from "../utils";
import { createInstance } from "./base";

export const Autowired = (...args: any[]) => {
    return (target: any, attrKey: string) => {
        const TargetFactory = Reflect.getMetadata("design:type", target, attrKey);
        Object.defineProperty(target, attrKey, {
            configurable: false,
            enumerable: true,
            get: () => {
                const instanceId = Reflect.getMetadata(CONST_DECORATOR_FOR_MODULE_INSTANCEID, target) ||
                Reflect.getMetadata(CONST_DECORATOR_FOR_MODULE_INSTANCEID, target.constructor);
                if(!utils.isEmpty(instanceId)) {
                    return createInstance(TargetFactory, instanceId);
                } else {
                    return new Error("Not running in the application");
                }
            },
            set: () => {
                throw new Error("使用Autowired初始化的对象不允许重写.");
            }
        });
    };
};
