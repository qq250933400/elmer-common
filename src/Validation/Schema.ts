import { Service } from "../decorators";
import { utils } from "../utils";

type TypeSchemaDataType = "String" | "Number" | "Object" | "Array" | "Boolean" | "Any" | RegExp | String[] | String;

export interface ISchemaProperty<FormatCallback={}> {
    type: TypeSchemaDataType;
    format?: keyof FormatCallback;
    isRequired?: boolean;
    defaultValue?: any;
}

export type ISchemaProperties<T={}, FormatCallback={}> = {
    [ P in keyof T ]: ISchemaProperty<FormatCallback> | {
        type: "Object",
        properties: ISchemaProperties<T[P], FormatCallback>
    }
};
export interface ISchemaConfig<T={}, FormatCallback={}, DataType={}> {
    properties: ISchemaProperties<T,FormatCallback>;
    formatCallbacks?: FormatCallback;
    dataType?: ISchemaProperties<DataType,FormatCallback>;
}
interface ISchemaValidate {
    (data: any): boolean;
    // tslint:disable-next-line: unified-signatures
    (data: any, name: string): boolean;
    <T={}, callbacks={}>(data: any, schema: ISchemaProperties<T, callbacks>): boolean;
    // tslint:disable-next-line: unified-signatures
    <T={}, callbacks={}>(data: any, schema: ISchemaProperties<T, callbacks>, name: string): boolean;
}

abstract class ASchema {
    abstract validate: ISchemaValidate;
}

// tslint:disable-next-line: max-classes-per-file
@Service
export class Schema extends ASchema {
    public message: string = "";
    private schemaConfig: any = {};
    private formatCallbacks: any = {};
    validate:ISchemaValidate = (data: any, schema?: any, name?: string): boolean => {
        const outscopeTypes = [];
        let pass = false;
        try {
            if(utils.isObject(schema)) {
                // 验证指定数据schema
                // 校验前先注册自定义数据类型
                if((schema as any).dataType) {
                    Object.keys((schema as any).dataType).forEach((typeName: string) => {
                        this.addSchema(typeName, (schema as any).dataType[typeName]);
                        outscopeTypes.push(typeName);
                    });
                }
                // 校验数据
                this.doValidate(data, schema, data, name || "Unknow", []);
            } else if(utils.isString(schema)) {
                // 验证指定规则name
                this.doValidate(data, this.schemaConfig[schema], data, schema, []);
            } else {
                const vname:string = Object.keys(this.schemaConfig)[0];
                this.doValidate(data, this.schemaConfig[vname], data, vname, []);
            }
            pass = true;
        } catch(e) {
            this.message = e.message;
            console.error(e);
            pass = false;
        } finally {
            if(outscopeTypes.length > 0) {
                outscopeTypes.forEach((key: string) => {
                    delete this.schemaConfig[key];
                });
            }
            // tslint:disable-next-line: no-unsafe-finally
            return pass;
        }
    }

    addSchema(name: string, schema: any): void {
        if(schema) {
            this.schemaConfig[name] = schema;
        }
    }
    removeSchema(name: string): void {
        if(this.schemaConfig && !utils.isEmpty(name)) {
            delete this.schemaConfig[name];
        }
    }
    private doValidate(data: any, schema: any, sourceData: any, name?: string, prefixKey?: string[]): boolean {
        const properties = schema?.properties;
        if(properties) {
            for(const attrKey of Object.keys(properties)) {
                const config = properties[attrKey];
                const isRequired = config.isRequired;
                const type = config?.type;
                const keyPathArray = [...prefixKey, attrKey];
                const keyPath = [...prefixKey, attrKey].join(".");
                let importRules = false;
                let checkValue = data[attrKey];
                if(!utils.isEmpty(config.defaultValue) && (null === checkValue || undefined === checkValue)) {
                    checkValue = config.defaultValue;
                }
                if(!utils.isEmpty(config.format)) {
                    if(typeof this.formatCallbacks[config.format] === "function") {
                        checkValue = this.formatCallbacks[config.format](checkValue, sourceData);
                    }
                }
                if(isRequired && data && (undefined === data[attrKey] || null === data[attrKey])) {
                    // data[attrKey] = config.default;
                    throw new Error(`配置${name}数据属性${keyPath}是isRequired字段参数不能为空。`);
                }
                if(data) {
                    if(/^#/.test(type)) {
                        const schemaName = type.replace(/^#/, "");
                        if(this.schemaConfig[schemaName]) {
                            importRules = true;
                            this.doValidate(data[attrKey], this.schemaConfig[schemaName], sourceData, schemaName, keyPathArray);
                        } else {
                            throw new Error(`配置${name}参数属性${keyPath}引用规则(${schemaName})不存在`);
                        }
                    } else {
                        if(/Array\<[#a-zA-Z0-9]{1,}\>/.test(type)) {
                            this.checkArrayTypes(data[attrKey], type, keyPath, name, keyPathArray, sourceData);
                        } else {
                            
                            if(!this.checkType(data[attrKey], type, keyPath, name)) {
                                const typeDesc = utils.isRegExp(type) ? type.source : JSON.stringify(type);
                                throw new Error(`配置${name}数据属性${keyPath}数据类型不正确，定义类型：${typeDesc}, 配置数据：${JSON.stringify(data[attrKey])}`);
                            } else {
                                if(config.length > 0) {
                                    if(data[attrKey]?.length !== config.length) {
                                        throw new Error(`配置${name}数据属性${keyPath}数据长度必须是${config.length}位。`);
                                    }
                                } else if(config.maxLength > 0) {
                                    if(data[attrKey]?.length > config.maxLength) {
                                        throw new Error(`配置${name}数据属性${keyPath}数据长度不能大于${config.maxLength}。`);
                                    }
                                } else if(config.minLength > 0) {
                                    if(data[attrKey]?.length < config.minLength) {
                                        throw new Error(`配置${name}数据属性${keyPath}数据长度必须大于${config.minLength}。`);
                                    }
                                }
                            }
                        }
                    }
                    !importRules && this.doValidate(data[attrKey], config, sourceData, name, keyPathArray);
                }
            }
        }
        return true;
    }
    private checkArrayTypes(data: any, type: string, keyPath: string, name: string, prefixArray: string[], sourceData: any):any {
        const typeRegExp = /^Array\<([#0-9a-zA-Z]{1,})\>$/;
        const dataMatch = type.match(typeRegExp);
        const declareTypes = this.schemaConfig[name]?.declareTypes || {};
        if(utils.isArray(data)) {
            if(dataMatch) {
                const arrayItemType = dataMatch[1];
                if(/^[a-z]{1,}$/i.test(arrayItemType)) {
                    let index = 0;
                    for(const dataItem of data) {
                        this.checkType(dataItem, arrayItemType, keyPath + "." + index, name);
                        index += 1;
                    }
                } else {
                    const useItemType = arrayItemType.replace(/^#/, "");
                    const useTypeSchema = declareTypes[useItemType] || this.schemaConfig[useItemType];
                    let index = 0;
                    if(useTypeSchema) {
                        for(const dataItem of data) {
                            this.doValidate(dataItem, useTypeSchema, sourceData, name, [...prefixArray, index.toString()]);
                            index+=1;
                        }
                    } else {
                        throw new Error(`验证规则不存在${useItemType},请检查设置。${keyPath}`);
                    }
                }
            } else {
                throw new Error(`配置${name}定义类型错误(${keyPath})。`);
            }
        } else {
            if(/^Array\<[a-zA-Z0-9]{1,}\>$/.test(type)) {
                if(data && type.indexOf(data)<0) {
                    throw new Error(`配置${name}参数${keyPath}数据类型错误定义类型：${type}。[Aarry_I500]`);
                }
            } else {
                throw new Error(`配置${name}参数${keyPath}数据类型错误定义类型：${type}。[Aarry_D500]`);
            }
        }
    }
    private checkType(data: any, type:String|RegExp, keyPath: string, name: string): boolean {
        if(undefined === data || null === data) {
            return true;
        } else {
            if(utils.isRegExp(type)) {
                return type.test(data);
            } else if(utils.isArray(type)) {
                if(utils.isArray(data)) {
                    // do the validate if the config data is an array
                    let pass = true;
                    for(const item of data) {
                        if(type.indexOf(item) < 0) {
                            pass = false;
                            break;
                        }
                    }
                    return pass;
                } else {
                    return type.indexOf(data) >= 0;
                }
            } else if(utils.isString(type)) {
                switch(type) {
                    case "String": {
                        return utils.isString(data);
                    }
                    case "Object": {
                        return utils.isObject(data);
                    }
                    case "Array": {
                        return utils.isArray(data);
                    }
                    case "RegExp": {
                        return utils.isRegExp(data);
                    }
                    case "Number": {
                        return utils.isNumber(data);
                    }
                    case "Boolean": {
                        return utils.isBoolean(data);
                    }
                    default: {
                        if(/\|/.test(type)) {
                            const mutilTypes = type.split("|");
                            let isPass = false;
                            for(const signType of mutilTypes) {
                                try {
                                    this.checkType(data, signType, keyPath, name);
                                    isPass = true;
                                    break;
                                } catch(e) {
                                    console.log(signType);
                                    console.error(e);
                                }
                            }
                            if(!isPass) {
                                throw new Error(`配置${name}参数${keyPath}数据类型错误：${type}, 其中一个数据类型。`);
                            }
                            return true;
                        } else {
                            throw new Error(`配置${name}参数${keyPath}数据类型错误：${type}, [String, Object, Array, RegExp, Number]`);
                        }
                    }
                }
            } else {
                throw new Error(`配置${name}参数${keyPath}数据类型错误：${type}, [String, Object, Array, RegExp, Number]`);
            }
        }
    }
}
