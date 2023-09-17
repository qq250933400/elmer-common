import { utils } from "../utils";
export class Common {
    getType(val:any):string {
        return Object.prototype.toString.call(val);
    }
    isString(val:any): val is string {
        return this.getType(val) === "[object String]";
    }
    isObject(val:any): val is object {
        return this.getType(val) === "[object Object]";
    }
    isArray(val:any):val is any[] {
        return this.getType(val) === "[object Array]";
    }
    isNumeric(val:any):boolean {
        return !isNaN(val);
    }
    isDOM(val:any):val is HTMLElement {
        return /^(\[object\s*)HTML([a-zA-Z]*)(Element\])$/.test(this.getType(val));
    }
    isSVGDOM(val:any): val is SVGAElement {
        return  /^\[object\sSVG([a-zA-Z]*)Element\]$/.test(this.getType(val));
    }
    isFunction(val:any):val is Function {
        return this.getType(val) === "[object Function]";
    }
    isNodeList(val:any):val is NodeList {
        return this.getType(val) === "[object NodeList]";
    }
    isRegExp(val:any):val is RegExp {
        return this.getType(val) === "[object RegExp]";
    }
    isEmpty(val:any):boolean {
        return val === undefined || val === null || (this.isString(val) && val.length <= 0);
    }
    isPromise(val: any): val is Promise<any> {
        return this.getType(val) === "[object Promise]";
    }
    // tslint:disable-next-line:no-shadowed-variable
    isEqual(a:any,b:any): boolean {
        if(a===b) {
            return a !== 0 || 1/a === 1/b;
        }
        if(a == null || b== null) {
            return a === b;
        }
        const classNameA = this.getType(a),
            classNameB = this.getType(b);
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
    sleepCall(fn:Function, timeout:number, obj:object):void {
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
    getValue<T>(data:object, key:string, defaultValue?: any): T {
        return utils.getValue<T>(data, key, defaultValue);
    }
    /**
     * 给指定对象设置属性值
     * @param data 设置属性值对象
     * @param key 设置属性key,属性key有多层可使用.区分
     * @param value 设置属性值
     * @param fn 自定义设置值回调
     */
    setValue(data:object, key:string, value:any, fn?: Function): boolean {
        return utils.setValue(data, key, value, fn);
    }
    /**
     * 获取随机ID
     */
    getRandomID():string {
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
    toHumpStr(val: string, firstUpperCase?: boolean): string {
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
    humpToStr(val:string): string {
        if(!this.isEmpty(val)) {
            const vStr = val.substr(0,1).toLowerCase()+val.substr(1);
            const rStr = vStr.replace(/([A-Z])/g, ($1)=> {
                return "-"+$1.toLowerCase();
            });
            return rStr;
        }
        return val;
    }
    extend<T,U>(desc: T, src: U, setReadOnly?: boolean,ignoreKeys?:string[]): T & U {
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
    merge<T,U>(obj1:T,obj2:U): T & U {
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
    val<T>(data: any): T {
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
    defineReadOnlyProperty(obj: object, propertyKey: string, propertyValue: any): void {
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
    launchFullscreen(element: HTMLElement): void {
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
    exitFullscreen(): void {
        if (document.exitFullscreen) {
            // tslint:disable-next-line: no-floating-promises
            document.exitFullscreen();
        } else if (document["mozCancelFullScreen"]) {
            document["mozCancelFullScreen"]();
        } else if (document["webkitExitFullscreen"]) {
            document["webkitExitFullscreen"]();
        }
    }
    isFullScreen(): Boolean {
        return document["isFullScreen"] || document["mozIsFullScreen"] || document["webkitIsFullScreen"];
    }
    guid(): string {
        const S4 = ():string => {
            // tslint:disable-next-line: no-bitwise
            return (((1 + Math.random())*0x10000) | 0).toString(16).substr(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4());
    }
    getUri():any {
        return utils.getUri();
    }
    getQuery(key:string):string|undefined|null {
        return utils.getQuery(key);
    }
    invoke<T={}>(fn?: Function, ...args: any[]): Promise<T>{
        return new Promise((resolve, reject) => {
            if(!fn || typeof fn !== "function") {
                reject({
                    statusCode: 500,
                    message: "the fn should be a function."
                });
            } else {
                const fnResult = fn(...args);
                if(this.isPromise(fnResult)) {
                    fnResult.then(resolve).catch(reject);
                } else {
                    resolve(fnResult);
                }
            }
        });
    }
}
