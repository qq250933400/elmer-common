export class utils {
    static getType(val:any):string {
        return Object.prototype.toString.call(val);
    }
    static isString(val:any): val is string {
        return utils.getType(val) === "[object String]";
    }
    static isObject(val:any): val is object {
        return utils.getType(val) === "[object Object]";
    }
    static isArray(val:any):val is any[] {
        return utils.getType(val) === "[object Array]";
    }
    static isNumeric(val:any):boolean {
        return !isNaN(val);
    }
    static isDOM(val:any):val is HTMLElement {
        return /^(\[object\s*)HTML([a-zA-Z]*)(Element\])$/.test(utils.getType(val));
    }
    static isSVGDOM(val:any): val is SVGAElement {
        return  /^\[object\sSVG([a-zA-Z]*)Element\]$/.test(utils.getType(val));
    }
    static isFunction(val:any):val is Function {
        return utils.getType(val) === "[object Function]";
    }
    static isNodeList(val:any):val is NodeList {
        return utils.getType(val) === "[object NodeList]";
    }
    static isRegExp(val:any):val is RegExp {
        return utils.getType(val) === "[object RegExp]";
    }
    static isEmpty(val:any):boolean {
        return val === undefined || val === null || (utils.isString(val) && val.length <= 0);
    }
    static isPromise(val:any): val is Promise<any> {
        return utils.getType(val) === "[object Promise]";
    }
    static isGlobalObj(val:any): boolean {
        return this.getType(val) === "[object global]";
    }
    static isNumber(val:any): boolean {
        return !isNaN(val);
    }
    static isBoolean(val:any): val is boolean {
        return this.getType(val) === "[object Boolean]";
    }
    // tslint:disable-next-line:no-shadowed-variable
    static isEqual(a:any,b:any): boolean {
        if(a===b) {
            return a !== 0 || 1/a === 1/b;
        }
        if(a == null || b== null) {
            return a === b;
        }
        const classNameA = utils.getType(a),
            classNameB = utils.getType(b);
        if(classNameA !== classNameB) {
            return false;
        } else {
            switch(classNameA) {
                case "[object RegExp]":
                case "[object String]":
                    return "" + a === "" + b;
                case "[object Number]":
                    if(+a !== +a) {
                        return +b !== +b;
                    }
                    return +a === 0 ? 1/+a === 1/b : +a === +b;
                case "[object Date]":
                case "[object Boolean]":
                    return +a === +b;
            }
            if(classNameA === "[object Object]") {
                const propsA = Object.getOwnPropertyNames(a),
                    propsB = Object.getOwnPropertyNames(b);
                if(propsA.length !== propsB.length) {
                    return false;
                } else {
                    for(let i=0;i<propsA.length;i++) {
                        const propName = propsA[i];
                        if(a[propName] !== b[propName]) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            if(classNameA === "[object Array]") {
                return a.toString() === b.toString();
            }
        }
    }
    static sleepCall(fn:Function, timeout:number, obj:object):void {
        if(typeof fn === "function") {
            // let handler: number | null | undefined = null;
            const tim:number = timeout || 200;
            const sleep = ()=> {
                if(obj) {
                    fn.call(obj);
                } else {
                    fn();
                }
                // handler !== null && clearTimeout(handler);
            };
            setTimeout(sleep, tim);
        }
    }
    static getValue<T>(data:object, key:string, defaultValue?: any): T {
        const keyValue = key !== undefined && key !== null ? key : "";
        if (/\./.test(keyValue)) {
            const keyArr = keyValue.split(".");
            let isFind = false;
            let index = 0;
            let keyStr:any = "";
            let tmpData:any = data;
            while (index <= keyArr.length - 1) {
                keyStr = keyArr[index];
                isFind = index === keyArr.length - 1;
                if(utils.isArray(tmpData) && utils.isNumeric(keyStr)) {
                    keyStr = parseInt(keyStr, 10);
                }
                if(!isFind) {
                    const nextKey = keyArr[keyArr.length - 1];
                    if(utils.isArray(tmpData) || utils.isObject(tmpData) || utils.isGlobalObj(tmpData)) {
                        //
                        tmpData = tmpData[keyStr];
                    }
                    if(tmpData && index === keyArr.length - 2) {
                        if(nextKey === "key") {
                            tmpData = tmpData.key;
                            isFind = true;
                        } else if(nextKey === "length") {
                            tmpData = tmpData.length;
                            isFind = true;
                        }
                    }
                } else {
                    tmpData = tmpData ? tmpData[keyStr] : undefined;
                }
                if(isFind) {
                    break;
                }
                index++;
            }
            return isFind ? (undefined !== tmpData ? tmpData : defaultValue) : defaultValue;
        } else {
            const rResult = data ? (<any>data)[keyValue] : undefined;
            return data ? (undefined !== rResult ? rResult : defaultValue) : defaultValue;
        }
    }
    /**
     * 给指定对象设置属性值
     * @param data 设置属性值对象
     * @param key 设置属性key,属性key有多层可使用.区分
     * @param value 设置属性值
     * @param fn 自定义设置值回调
     */
    static setValue(data:object, key:string, value:any, fn?: Function): boolean {
        let isUpdate = false;
        if(!utils.isObject(data)) {
            throw new Error("The parameter of data is not a object");
        }
        if(utils.isEmpty(key)) {
            throw new Error("The key can not be an empty string");
        }
        if(!utils.isEmpty(value)) {
            const keyArr = key.split(".");
            const keyLen = keyArr.length;
            let index = 0;
            let tmpData = data;
            while(index<keyLen) {
                const cKey = keyArr[index];
                if(index < keyLen - 1) {
                    // 不是最后一个节点
                    if(!utils.isEmpty(tmpData[cKey])) {
                        if(utils.isObject(tmpData[cKey])) {
                            tmpData = tmpData[cKey];
                        } else {
                            throw new Error("Can not set value to attribute of " + cKey);
                        }
                    } else {
                        tmpData[cKey] = {};
                        tmpData = tmpData[cKey];
                    }
                } else {
                    // 要更新数据的节点
                    if(typeof fn === "function") {
                        fn(tmpData, cKey, value);
                    } else {
                        tmpData[cKey] = value;
                    }
                    isUpdate = true;
                }
                index++;
            }
        }
        return isUpdate;
    }
    /**
     * 获取随机ID
     */
    static getRandomID():string {
        const now  = new Date();
        const year = now.getFullYear().toString(),
            month = now.getMonth()+1<10 ? "0" + (now.getMonth()+1).toString() : (now.getMonth()+1).toString(),
            date = now.getDate()<10 ? "0" + now.getDate().toString() : now.getDate().toString(),
            hour = now.getHours() < 10 ? ["0",now.getHours()].join("") : now.getHours().toString(),
            minute = now.getMinutes() < 10 ? ["0", now.getMinutes()].join("") : now.getMinutes().toString(),
            second = now.getSeconds() < 10 ? ["0", now.getSeconds()].join("") : now.getSeconds().toString(),
            reSecond = now.getMilliseconds();
        const randValue = parseInt((Math.random()*9999+1000).toString(), 10);
        return [year,month, date, hour,minute, second,reSecond,randValue].join("");
    }
    /**
     * 字符串有连接符-将自动转换成已首字母大写
     * @param val 转换文本
     * @param firstUpperCase 是否大写
     */
    static toHumpStr(val: string, firstUpperCase?: boolean): string {
        if(!this.isEmpty(val)) {
            const vStr = val.replace(/(^\-)|(\-$)/,"");
            const vArr = vStr.split("-");
            for(let i=0;i<vArr.length;i++) {
                if((i===0 && firstUpperCase) || i>0) {
                    vArr[i] = vArr[i].substr(0,1).toUpperCase() + vArr[i].substr(1);
                }
            }
            return vArr.join("");
        } else {
            return val;
        }
    }
    static humpToStr(val:string): string {
        if(!this.isEmpty(val)) {
            const vStr = val.substr(0,1).toLowerCase()+val.substr(1);
            const rStr = vStr.replace(/([A-Z])/g, ($1)=> {
                return "-"+$1.toLowerCase();
            });
            return rStr;
        }
        return val;
    }
    static extend<T,U>(desc: T, src: U, setReadOnly?: boolean,ignoreKeys?:string[]): T & U {
        if(!setReadOnly) {
            if(this.isObject(desc) && this.isObject(src)) {
                if(Object.assign) {
                    Object.assign(desc, src);
                } else {
                    // tslint:disable-next-line:forin
                    for(const key in src) {
                        if(!ignoreKeys || ignoreKeys.indexOf(key)<0) {
                            (<any>desc)[key] = <any>src[key];
                        }
                    }
                }
            }
        } else {
            if(this.isObject(desc) && this.isObject(src)) {
                // tslint:disable-next-line:forin
                for(const key in src) {
                    if(!ignoreKeys || ignoreKeys.indexOf(key)<0) {
                        // 已经存在的属性需要使用delete删除，防止redine error问题
                        if(desc.hasOwnProperty(key)) {
                            delete (<any>desc)[key];
                        }
                        this.defineReadOnlyProperty(desc, key,  src[key]);
                    }
                }
            }
        }
        return <any>desc;
    }
    static merge<T,U>(obj1:T,obj2:U): T & U {
        let result = <T & U>{};
        if(obj1 && !obj2) {
            result = <any>obj1;
        } else if(!obj1 && obj2) {
            result = <any>obj2;
        } else if(obj1 && obj2) {
            if(this.isObject(obj1)) {
                // tslint:disable-next-line:forin
                for(const key in obj1) {
                    result[key] = <any>obj1[key];
                }
            }
            if(this.isObject(obj2)) {
                for(const sKey in obj2) {
                    if(!result.hasOwnProperty(sKey)) {
                        result[sKey] = <any>obj2[sKey];
                    }
                }
            }
        }
        return result;
    }
    /**
     * 将字符串转转换成对应的数据类型，遇到true|false转换成bool类型，遇到数字文本转换成数字类型数据
     * @param data 要转换的数据
     */
    static val<T>(data: any): T {
        if(this.isString(data)) {
            if(!isNaN(<any>data)) {
                return <any>(data.indexOf(".") >= 0 ? parseFloat(data) : parseInt(data, 10));
            } else {
                return <any>(/^(true|false)$/.test(data) ? Boolean(data) : data);
            }
        } else {
            return data;
        }
    }
    static defineReadOnlyProperty(obj: object, propertyKey: string, propertyValue: any): void {
        (
          (paramObj: object, paramPropertyKey: string, paramPropertyValue: any)=> {
              paramObj && Object.defineProperty(paramObj, paramPropertyKey, {
                  configurable: true,
                  enumerable: true,
                  value: paramPropertyValue,
                  writable: false
              });
          }
        )(obj, propertyKey, propertyValue);
    }
    static launchFullscreen(element: HTMLElement): void {
        if (element.requestFullscreen) {
            // tslint:disable-next-line: no-floating-promises
            element.requestFullscreen();
        } else if (element["mozRequestFullScreen"]) {
            element["mozRequestFullScreen"]();
        } else if (element["webkitRequestFullscreen"]) {
            element["webkitRequestFullscreen"]();
        } else if (element["msRequestFullscreen"]) {
            element["msRequestFullscreen"]();
        }
    }
    static exitFullscreen(): void {
        if (document.exitFullscreen) {
            // tslint:disable-next-line: no-floating-promises
            document.exitFullscreen();
        } else if (document["mozCancelFullScreen"]) {
            document["mozCancelFullScreen"]();
        } else if (document["webkitExitFullscreen"]) {
            document["webkitExitFullscreen"]();
        }
    }
    static isFullScreen(): Boolean {
        return document["isFullScreen"] || document["mozIsFullScreen"] || document["webkitIsFullScreen"];
    }
    static guid(): string {
        const S4 = ():string => {
            // tslint:disable-next-line: no-bitwise
            return (((1 + Math.random())*0x10000) | 0).toString(16).substr(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4());
    }
    static getUri(queryString?: string): any {
        let str = !utils.isEmpty(queryString) ? queryString : (location.search || "");
        let strArr = [];
        const result = {};
        str = str.replace(/^\?/, "").replace(/\#[\s\S]*$/, "");
        strArr = str.split("&");
        // tslint:disable-next-line: forin
        for(const key in strArr) {
            const tmpItem = strArr[key] || "";
            const tmpM = tmpItem.match(/^\s*([\S]*)\s*=\s*([\S]*)$/);
            if(tmpM) {
                result[tmpM[1]] = tmpM[2];
            }
        }
        return result;
    }
    static getQuery(key: string, queryString?: string): string | undefined | null {
        return utils.getUri(queryString)[key];
    }
    /**
     * 获取字符串字节长度
     * @param {string|number} val 输入字符串
     */
    static strLen(val: string|number): number {
        const str = val.toString();
        let len = 0;
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);
            if (c>255) {
                len += 2;
            } else {
                len += 1;
            }
        }
        return len;
    }
}

export const defineReadonlyProperty = (target:any, propertyKey: string, propertyValue: any) => {
    Object.defineProperty(target, propertyKey, {
        configurable: false,
        enumerable: true,
        value: propertyValue,
        writable: false
    });
};

export const getEnvFromCommand = (commandList:string[]): string => {
    let env = "Prod";
    if(commandList && commandList.length>0) {
        for(let i=0;i<commandList.length;i++) {
            const tmpCommand = commandList[i];
            const tmpMatch = tmpCommand.match(/^\-\-env\=([a-z0-9]{1,})$/i);
            if(tmpMatch) {
                env = tmpMatch[1];
            } else {
                const lMatch = tmpCommand.match(/^\-env\=([a-z0-9]{1,})$/i);
                if(lMatch) {
                    env = lMatch[1];
                }
            }
        }
    }
    return env;
};

export const getCommand = (command: string[], cmdKey:string): string|boolean => {
    let result: string;
    let findKey = false;
    let findValue = false;
    const keyReg = /^[\-]{1,}/;
    const keyValueReg = /^([a-z0-9]{1,})\=/i;
    const isCmdKey = /^[\-]{1,}/.test(cmdKey);
    if(command && command.length > 0) {
        for(let i=0;i<command.length;i++) {
            const cmd = command[i];
            if(isCmdKey) {
                if(cmd === cmdKey) {
                    if(!keyReg.test(command[i+1])) {
                        result = command[i+1] === undefined ? null : command[i+1];
                        findValue = i+1 < command.length;
                        break;
                    }
                }
            } else {
                if(!keyReg.test(cmd)) {
                    const keyMatchValue = cmd.match(keyValueReg);
                    if(keyMatchValue && keyMatchValue[1] === cmdKey) {
                        result = cmd.replace(keyValueReg, "");
                        findValue = true;
                        break;
                    } else {
                        if(cmd === cmdKey && !keyReg.test(command[i-1])) {
                            findKey = true;
                        }
                    }
                }
            }
        }
    }
    return findValue ? result : (findKey ? true : result );
};
