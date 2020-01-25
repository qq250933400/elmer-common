// tslint:disable: jsdoc-format
/**
 * currentTime : 当前时间
 * beginValue  : 开始值
 * changeValue : 变化值
 * duration    : 动画过程时间
**/
// tslint:enable: jsdoc-format

// tslint:disable: object-literal-sort-keys no-parameter-reassignment
export const MathAnimationApi = {
    /**
     * 匀速变化
     * @param currentTime [number] 当前时间
     * @param beginning [number] 开始变化的值
     * @param changeValue [number] 变化的值
     * @param duration [number] 动画总的时间
     * @returns number
     */
    Linear:(currentTime:number, beginValue:number, changeValue:number, duration:number): number => {
        return changeValue * currentTime / duration + beginValue;
    },
    /**
     * 二次平方缓动
     */
    Quad: {
        /**
         * 二次平方缓动easeIn
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeIn: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime /= duration;
            return changeValue * Math.pow(currentTime, 2) + beginValue;
        },
        /**
         * 二次平方缓动easeOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime /= duration;
            return -changeValue * currentTime * (currentTime - 2) + beginValue;
        },
        /**
         * 二次平方缓动easeInOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeInOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration;
            if(currentTime / 2 < 1) {
                return changeValue / 2 * Math.pow(currentTime, 2) + beginValue;
            } else {
                currentTime = currentTime - 1;
                return -changeValue / 2 * (currentTime * (currentTime -2) - 1) + beginValue;
            }
        }
    },
    /**
     * 三次方缓动效
     */
    Cubic: {
        /**
         * 三次方缓动easeIn
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeIn: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration;
            return changeValue * Math.pow(currentTime,3) + beginValue;
        },
        /**
         * 三次方缓动easeOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration - 1;
            return changeValue * (Math.pow(currentTime,3) + 1) + beginValue;
        },
        /**
         * 三次方缓动easeInOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeInOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration;
            if(currentTime / 2 < 1) {
                return changeValue / 2 * Math.pow(currentTime,3) + beginValue;
            } else {
                currentTime = currentTime - 2;
                return changeValue / 2 * (Math.pow(currentTime,3) + 2) + beginValue;
            }
        }
    },
    /**
     * 四次方缓动效果
     */
    Quart: {
        /**
         * 四次方缓动easeIn
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeIn: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration;
            return changeValue * Math.pow(currentTime, 4) + beginValue;
        },
        /**
         * 四次方缓动easeOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration - 1;
            return - changeValue * (Math.pow(currentTime,4) - 1) + beginValue;
        },
        /**
         * 四次方缓动easeInOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeInOut:(currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration;
            if(currentTime / 2 < 1) {
                return changeValue / 2 * Math.pow(currentTime,4) + beginValue;
            } else {
                currentTime -= 2;
                return -changeValue / 2 * (Math.pow(currentTime, 4) - 2) + beginValue;
            }
        }
    },
    /**
     * 五次方缓动效果
     */
    Quint: {
        /**
         * 四次方缓动easeIn
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeIn: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime /= duration;
            return changeValue * Math.pow(currentTime, 5) + beginValue;
        },
        /**
         * 四次方缓动easeOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration - 1;
            return changeValue * (Math.pow(currentTime, 5) + 1)+ beginValue;
        },
        /**
         * 四次方缓动easeInOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeInOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration;
            if(currentTime / 2 < 1) {
                return changeValue / 2 * Math.pow(currentTime,5) + beginValue;
            } else {
                currentTime -= 2;
                return changeValue / 2 * (Math.pow(currentTime,5) + 2) + beginValue;
            }
        }
    },
    /**
     * 正弦缓动效果
     */
    Sine: {
        /**
         * 正弦缓动效果easeIn
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeIn:(currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            return -changeValue * Math.cos(currentTime / duration * (Math.PI / 2)) + changeValue + beginValue;
        },
        /**
         * 正弦缓动效果easeOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeOut:(currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            return changeValue * Math.sin(currentTime/duration * (Math.PI / 2)) + beginValue;
        },
        /**
         * 正弦缓动效果easeInOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeInOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            return -changeValue / 2 * (Math.cos(Math.PI * currentTime /duration) - 1) + beginValue;
        }
    },
    /**
     * 指数缓动效果
     */
    Expo: {
        /**
         * 指数缓动效果easeIn
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeIn: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            return (currentTime === 0) ? beginValue : changeValue * Math.pow(2, 10 * (currentTime / duration - 1)) + beginValue;
        },
        /**
         * 指数缓动效果easeOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            return currentTime === duration ? beginValue + changeValue : changeValue * (-Math.pow(2, -10 * currentTime / duration) + 1) + beginValue;
        },
        /**
         * 指数缓动效果easeInOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeInOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            if(currentTime === 0) {return beginValue;}
            if(currentTime === duration) {return beginValue + changeValue;}
            currentTime /= duration;
            if(currentTime / 2 < 1) {
                return changeValue / 2 * Math.pow(2, 10 * (currentTime - 1)) + beginValue;
            } else {
                currentTime -= 1;
                return changeValue / 2 * (- Math.pow(2, -10 * currentTime) + 2) + beginValue;
            }
        }
    },
    /**
     * 圆形缓动效果
     */
    Circle: {
        /**
         * 圆形缓动效果easeIn
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeIn: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration;
            return -changeValue * (Math.sqrt(1 - Math.pow(currentTime,2)) - 1) + beginValue;
        },
        /**
         * 圆形缓动效果easeOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration - 1;
            return changeValue * Math.sqrt(1 - Math.pow(currentTime,2)) + beginValue;
        },
        /**
         * 圆形缓动效果easeInOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeInOut: (currentTime:number, beginValue:number, changeValue:number, duration:number) => {
            currentTime = currentTime / duration;
            if(currentTime / 2 < 1) {
                return -changeValue / 2 * (Math.sqrt(1-Math.pow(currentTime,2)) - 1) + beginValue;
            } else {
                currentTime -= 2;
                return changeValue / 2 + (Math.sqrt(1 - Math.pow(currentTime,2))+ 1) + beginValue;
            }
        }
    },
    /**
     * 指衰减正弦曲线缓动函数
     */
    Elastic: {
        /**
         * 指衰减正弦曲线缓动easeIn
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @param a [number] undefined
         * @param p [number] undefined
         * @returns number
         */
        easeIn: (currentTime:number, beginValue:number, changeValue:number, duration:number, a?:number, p?:number) => {
            let s;
            if(currentTime === 0) {return beginValue;}
            currentTime /= duration;
            if(currentTime === 1) {return beginValue + changeValue;}
            if(typeof p === "undefined") {p = duration * 0.3;}
            if(!a || a < Math.abs(changeValue)) {
                s = p / 4;
                a = changeValue;
            } else {
                s = p / (2 * Math.PI) * Math.asin(changeValue / a);
            }
            return -(a * Math.pow(2, 10 * (currentTime -= 1)) * Math.sin((currentTime * duration - s) * (2 * Math.PI) / p)) + beginValue;
        },
        /**
         * 指衰减正弦曲线缓动减速easeOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @param a [number] undefined
         * @param p [number] undefined
         * @returns number
         */
        easeOut: (currentTime:number, beginValue:number, changeValue:number, duration:number, a?:number, p?:number): number => { // 减速
            let s:number;
            if (currentTime === 0) { return beginValue; }
            currentTime /= duration;
            if (currentTime === 1) { return beginValue + changeValue; }
            if (typeof p === "undefined") { p = duration * .3; }
            if (!a || a < Math.abs(changeValue)) {
                a = changeValue;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(changeValue / a);
            }
            return (a * Math.pow(2, -10 * currentTime) * Math.sin((currentTime * duration - s) * (2 * Math.PI) / p) + changeValue + beginValue);
        },
        /**
         * 指衰减正弦曲线缓动函先加速后减速easeInOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @param a [number] undefined
         * @param p [number] undefined
         * @returns number
         */
        easeInOut: (currentTime:number, beginValue:number, changeValue:number, duration:number, a?:number, p?:number) => {
            let s:number;
            if (currentTime===0) {return beginValue; }
            currentTime /= duration / 2;
            if (currentTime === 2) {return beginValue+changeValue;}
            if (typeof p === "undefined") {p = duration * (0.3 * 1.5);}
            if (!a || a < Math.abs(changeValue)) {
                a = changeValue;
                s = p / 4;
            } else {
                s = p / (2  *Math.PI) * Math.asin(changeValue / a);
            }
            if (currentTime < 1) {return -0.5 * (a * Math.pow(2, 10* (currentTime -=1 )) * Math.sin((currentTime * duration - s) * (2 * Math.PI) / p)) + beginValue;}
            return a * Math.pow(2, -10 * (currentTime -= 1)) * Math.sin((currentTime * duration - s) * (2 * Math.PI) / p ) * .5 + changeValue + beginValue;
        }
    },
    /**
     * 超过范围的三次方的缓动函数
     */
    Back: {
        /**
         * 超过范围的三次方的缓动函数easeIn
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @param s [number] undefined
         * @returns number
         */
        easeIn: (currentTime:number, beginValue:number, changeValue:number, duration:number, s?:number): number => {
            if (typeof s === "undefined") { s = 1.70158; }
            return changeValue * (currentTime /= duration) * currentTime * ((s + 1) * currentTime - s) + beginValue;
        },
        /**
         * 超过范围的三次方的缓动函数easeOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @param s [number] undefined
         * @returns number
         */
        easeOut: (currentTime:number, beginValue:number, changeValue:number, duration:number, s?:number):number => {
            if (typeof s === "undefined") {s = 1.70158;}
            return changeValue * ((currentTime = currentTime/duration - 1) * currentTime * ((s + 1) * currentTime + s) + 1) + beginValue;
        },
        /**
         * 超过范围的三次方的缓动函数easeInOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @param s [number] undefined
         * @returns number
         */
        easeInOut: (currentTime:number, beginValue:number, changeValue:number, duration:number, s?:number): number => {
            if (typeof s === "undefined") {s = 1.70158;}
            currentTime /= duration / 2;
            if (currentTime < 1) {return changeValue / 2 * (currentTime * currentTime * (((s *= (1.525)) + 1) * currentTime - s)) + beginValue;}
            return changeValue / 2*((currentTime -= 2) * currentTime * (((s *= (1.525)) + 1) * currentTime + s) + 2) + beginValue;
        }
    },
    /**
     * 指数衰减的反弹曲线缓动函数
     */
    Bounce: {
        /**
         * 指数衰减的反弹曲线缓动函数easeIn
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeIn: (currentTime:number, beginValue:number, changeValue:number, duration:number): number => {
            return changeValue - MathAnimationApi.Bounce.easeOut(duration-currentTime, 0, changeValue, duration) + beginValue;
        },
        /**
         * 指数衰减的反弹曲线缓动函数easeOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeOut: (currentTime:number, beginValue:number, changeValue:number, duration:number): number => {
            currentTime /= duration;
            if (currentTime < (1 / 2.75)) {
                return changeValue * (7.5625 * currentTime * currentTime) + beginValue;
            } else if (currentTime < (2 / 2.75)) {
                return changeValue * (7.5625 * (currentTime -= (1.5 / 2.75)) * currentTime + .75) + beginValue;
            } else if (currentTime < (2.5 / 2.75)) {
                return changeValue * (7.5625 * (currentTime -= (2.25 / 2.75)) * currentTime + .9375) + beginValue;
            } else {
                return changeValue * (7.5625 * (currentTime -= (2.625 / 2.75)) * currentTime + .984375) + beginValue;
            }
        },
        /**
         * 指数衰减的反弹曲线缓动函数easeInOut
         * @param currentTime [number] 当前时间
         * @param beginning [number] 开始变化的值
         * @param changeValue [number] 变化的值
         * @param duration [number] 动画总的时间
         * @returns number
         */
        easeInOut: (currentTime:number, beginValue:number, changeValue:number, duration:number): number => {
            if (currentTime < duration / 2) {
                return MathAnimationApi.Bounce.easeIn(currentTime * 2, 0, changeValue, duration) * .5 + beginValue;
            } else {
                return MathAnimationApi.Bounce.easeOut(currentTime * 2 - duration, 0, changeValue, duration) * 0.5 + changeValue * 0.5 + beginValue;
            }
        }
    }
};
// tslint:enable: object-literal-sort-keys no-parameter-reassignment
