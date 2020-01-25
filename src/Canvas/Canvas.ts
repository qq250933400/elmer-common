export class Canvas {
    private lastTime:any;
    private requestAnimationFrame:Function;
    private cancelAnimationFrame: Function;
    private doRemoveAnimationList:number[] = [];
    constructor() {
        // tslint:disable-next-line: variable-name
        const _this = this;
        // tslint:disable: only-arrow-functions
        this.requestAnimationFrame = window.requestAnimationFrame ||
            window["webkitRequestAnimationFrame"] ||
            window["mozRequestAnimationFrame"] ||
            function(callback:Function): number {
                const currTime = new Date().getTime();
                const timeToCall = Math.max(0, 16.7 - (currTime - _this.lastTime));
                const id = window.setTimeout(function(): void {
                    callback(currTime + timeToCall);
                }, timeToCall);
                _this.lastTime = currTime + timeToCall;
                return id;
            };
        this.cancelAnimationFrame = window.cancelAnimationFrame ||
            window["webkitCancelAnimationFrame"] ||
            window["mozCancelAnimationFrame"] ||
            function(id:number): void {
                clearTimeout(id);
            };
        // tslint:enable: only-arrow-functions
    }
    startAnimation(callBack:Function, targetObj: any): number {
        const self = this;
        // tslint:disable-next-line: only-arrow-functions
        return (function(fn:Function, obj:any): number {
            let handler: number;
            // tslint:disable-next-line: only-arrow-functions
            const animation = function(): void {
                let mIndex = self.doRemoveAnimationList.indexOf(handler);
                if(mIndex<0) {
                    fn.apply(obj, arguments);
                    return self.requestAnimationFrame.call(window, animation);
                } else {
                    self.doRemoveAnimationList.splice(mIndex, 1);
                }
                mIndex = null;
            };
            handler = self.requestAnimationFrame.call(window, animation);
            return handler;
        })(callBack, targetObj);
    }
    stopAnimation(handler:number): void {
        this.cancelAnimationFrame.call(window, handler);
        this.doRemoveAnimationList.push(handler);
    }
}
