var describe = require("mocha").describe;
var assert = require("assert");
var Observe = require("../../lib/BaseModule/Observe").Observe;

const obj = new Observe();

describe("Observe", () => {
    it("事件监听", () => {
        const fn = obj.on("name", () => {});
        assert.equal(typeof fn, "function");
    });
    it("触发事件", async() => {
        obj.on("test", (a) => {
            return "hello world_" + a;
        });
        const objResult = await obj.emit("test", "demo");
        assert.deepEqual(objResult, "hello world_demo");
    });
});