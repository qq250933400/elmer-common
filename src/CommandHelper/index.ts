import { Common } from "../BaseModule/Common";
import { queueCallFunc, TypeQueueCallParam } from "../BaseModule/QueueCallFun";
import { getCommand, StaticCommon } from "../BaseModule/StaticCommon";

const path = require("path");
const fs = require("fs");

// tslint:disable: no-console, object-literal-sort-keys

export type TypeCommandInitCallbackResult = {
    commands?: string[];
    options?: any;
};
export type ICommandInitCallback = (options:any) => TypeCommandInitCallbackResult;

export default class CommandHelper extends Common {
    private _version: string = "1.0.0";
    private _auther: string = "elmer s j mo";
    private _email: string = "250933400@qq.com";
    private _command: object = {};
    private _options: object = {};
    private _desc: object = {};
    private _maxDescLength: number = 0;
    private _maxOptionLength: number = 0;
    private _maxCommandLength: number = 0;
    private _processArgv: string[] = [];
    private _helpKey: string = "-h, --help";
    private _initCallback:Function;
    constructor(processArgv: string[]) {
        super();
        this._options[this._helpKey] = {
            desc: "Print help message",
            length: StaticCommon.strLen(this._helpKey)
        };
        this._maxOptionLength = StaticCommon.strLen(this._helpKey);
        this._processArgv = processArgv;
    }
    /**
     * 配置命令版本
     * @param ver 版本信息
     */
    version(ver:string): CommandHelper {
        this._version = ver;
        return this;
    }
    author(auth: string): CommandHelper {
        this._auther = auth;
        return this;
    }
    email(email: string): CommandHelper {
        this._email = email;
        return this;
    }
    command(cmd:string, desc?: string, action?:Function): CommandHelper {
        if(!/^[\-]{1,}/.test(cmd)) {
            const len = StaticCommon.strLen(cmd);
            this._command[cmd] = {
                desc,
                length: len,
                action
            };
            if(len > this._maxCommandLength) {
                this._maxCommandLength = len;
            }
        } else {
            throw new Error(`The command of "${cmd}" can not be start with character - or --`);
        }
        return this;
    }
    option(option: string, desc: string, action?:Function): CommandHelper {
        const len = StaticCommon.strLen(option);
        this._options[option] = {
            desc,
            length: len,
            action
        };
        if(len > this._maxOptionLength) {
            this._maxOptionLength = len;
        }
        return this;
    }
    action(keyword: string, callback: Function): CommandHelper {
        if(/^[\-]{1,}/.test(keyword)) {
            if(this._options[keyword]) {
                this._options[keyword].action = callback;
            } else {
                throw new Error(`The action target key "${keyword}" is not exists in option list`);
            }
        } else {
            if(this._command[keyword]) {
                this._command[keyword].action = callback;
            } else {
                throw new Error(`The action target key "${keyword}" is not exisits in command list.`);
            }
        }
        return this;
    }
    description(keyName: string, description: string): CommandHelper {
        const len = StaticCommon.strLen(keyName);
        this._desc[keyName] = {
            desc: description,
            length: len,
            action: "desc"
        };
        if(len > this._maxDescLength) {
            this._maxDescLength = len;
        }
        return this;
    }
    /**
     * 配置初始化命令执行方法，根据返回值类型配置不同参数
     * @param callback - cinfigurable callback
     */
    init(callback:ICommandInitCallback):CommandHelper {
        this._initCallback = callback;
        return this;
    }
    run(): void {
        this._help();
        this.getOptions().then((optionsValue) => {
            const cmdKeys = Object.keys(this._command);
            const params: TypeQueueCallParam[] = [];
            let initResult: TypeCommandInitCallbackResult;
            if(typeof this._initCallback === "function") {
                initResult = this._initCallback(optionsValue);
                if(initResult && this.isArray(initResult.commands)) {
                    initResult.commands.map((initCmd: string) => {
                        if(this._command[initCmd] && typeof this._command[initCmd].action === "function") {
                            params.push({
                                id: initCmd,
                                params: optionsValue,
                                fn: this._command[initCmd].action
                            });
                        }
                    });
                }
                if(initResult && initResult.options) {
                    this.extend(optionsValue, initResult.options);
                }
            }
            if(cmdKeys && cmdKeys.length>0) {
                cmdKeys.map((cmdKey: string) => {
                    if(getCommand(this._processArgv, cmdKey)) {
                        // has this command in args
                        if(typeof this._command[cmdKey].action === "function") {
                            params.push({
                                id: cmdKey,
                                params: optionsValue,
                                fn: this._command[cmdKey].action
                            });
                        }
                    }
                });
            }
            if(params.length > 0) {
                queueCallFunc(params, null, {
                    throwException: true
                }).then(() => {
                    console.log("Complete");
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                console.log("Complete");
            }
        }).catch((error) => {
            console.error(error);
            console.error("Exit code without 0");
        });
    }
    getVersion(): string {
        const packageFile = path.resolve(process.cwd(), "./package.json");
        if(fs.existsSync(packageFile)) {
            const jsonStr = fs.readFileSync(packageFile, "utf-8");
            const jsonData = JSON.parse(jsonStr);
            return jsonData.version;
        } else {
            return this._version;
        }
    }
    private _help():void {
        const showHelp = getCommand(this._processArgv, "-h") === null || getCommand(this._processArgv, "--help") === null;
        if(showHelp) {
            console.log("");
            console.log("version: ", this.getVersion());
            console.log("Author:  ", this._auther);
            console.log("Email:   ", this._email);
            console.log("");
            // show options information
            if(this._options) {
                console.log("Options: ");
                Object.keys(this._options).map((key) => {
                    const option = this._options[key];
                    const len = option.length;
                    const leftLen = this._maxOptionLength - len;
                    const spaceLen = leftLen + 10;
                    console.log("    " + key + " ".repeat(spaceLen), option.desc);
                });
            }
            console.log("");
            // show options information
            if(this._command) {
                console.log("Command: ");
                Object.keys(this._command).map((key) => {
                    const tmpCmd = this._command[key];
                    const len = tmpCmd.length;
                    const leftLen = this._maxOptionLength - len;
                    const spaceLen = leftLen + 10;
                    console.log("    " + key + " ".repeat(spaceLen), tmpCmd.desc);
                });
            }
            console.log("");
            if(this._desc) {
                Object.keys(this._desc).map((key) => {
                    const tmpDesc = this._desc[key];
                    const len = tmpDesc.length;
                    const leftLen = this._maxDescLength - len;
                    const spaceLen = leftLen + 10;
                    console.log(key + " ".repeat(spaceLen), tmpDesc.desc);
                });
            }
        }
    }
    private async getOptions(): Promise<any> {
        const optionKeys = Object.keys(this._options);
        if(optionKeys && optionKeys.length > 0) {
            const params:TypeQueueCallParam[] = [];
            optionKeys.map((opKey: string) => {
                if(opKey !== this._helpKey) {
                    const opArr = opKey.split(",");
                    const op = this._options[opKey];
                    let opValue:any;
                    for(let i=0;i<opArr.length;i++) {
                        const _opV = getCommand(this._processArgv, opArr[i].replace(/^\s*/,"").replace(/\s*$/, ""));
                        if(!this.isEmpty(_opV) || _opV === null) {
                            opValue = _opV;
                            break;
                        }
                    }
                    if(!this.isEmpty(opValue) || opValue === null) {
                        // 配置有此参数
                        if(typeof op.action === "function") {
                            params.push({
                                id: opKey,
                                params: null,
                                fn: op.action
                            });
                        } else {
                            params.push({
                                id: opKey,
                                params: null,
                                fn: () => opValue
                            });
                        }
                    }
                }
            });
            return queueCallFunc(params);
        } else {
            return Promise.resolve();
        }
    }
}
// tslint:enable: no-console, object-literal-sort-keys
