var describe = require("mocha").describe;
var assert = require("assert");
var Observe = require("../../lib/BaseModule/Observe").Observe;

const obj = new Observe();

describe("Observe", () => {
    it("事件监听", () => {
        const fn = obj.on("name", () => {});
        assert.equal(typeof fn, "function");
    });
    it("触发事件", () => {
        obj.on("test", () => {
            return "hello world";
        });
        return obj.emit("test", "demo");
    });
});