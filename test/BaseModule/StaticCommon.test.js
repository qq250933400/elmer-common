var describe = require("mocha").describe;
var assert = require("assert");
var getCommand = require("../../lib/utils").getCommand;
var StaticCommon = require("../../lib/utils").utils;
// var StaticCommon = common.StaticCommon;
// var getCommand  = common.getCommand;
var JSDOM = require("jsdom").JSDOM;

global.window = new JSDOM("").window;

describe("StaticCommon class test", () => {
    describe("common function test", ()=>{
        it("getType test", () => {
            assert.equal(StaticCommon.getType("test"), "[object String]");
        });
        it("isString test", () => {
            assert.equal(StaticCommon.isString("aa"), true);
            assert.equal(StaticCommon.isString(22), false);
        });
        it("isObject test", () => {
            assert.equal(StaticCommon.isObject({ a: 1 }), true);
            assert.equal(StaticCommon.isObject(2234), false);
        });
        it("isArray test", () => {
            assert.equal(StaticCommon.isArray({ a: 1 }), false);
            assert.equal(StaticCommon.isArray([2234]), true);
        });
        it("isNumeric test", () => {
            assert.equal(StaticCommon.isNumeric("2234"), true);
            assert.equal(StaticCommon.isNumeric(2234), true);
        });
        it("isDOM test", () => {
            var dm = window.document.createElement("div");
            assert.equal(StaticCommon.isDOM(dm), true);
            assert.equal(StaticCommon.isDOM(123), false);
        });
        it("isFunction test", () => {
            assert.equal(StaticCommon.isFunction(() => { return 'aa'; }), true);
            assert.equal(StaticCommon.isFunction(a => a + 1), true);
        });
        it("isRegExp test", () => {
            assert.equal(StaticCommon.isRegExp(/^[0-9]{1,}$/), true);
            assert.equal(StaticCommon.isRegExp(2234), false);
        });
        it("isEmpty test", () => {
            assert.equal(StaticCommon.isEmpty(), true);
            assert.equal(StaticCommon.isEmpty(null), true);
            assert.equal(StaticCommon.isEmpty(""), true);
            assert.equal(StaticCommon.isEmpty(2), false);
        });
        it("isEqual test", () => {
            assert.equal(StaticCommon.isEqual({ a: 1 }, { a: 1 }), true);
            assert.equal(StaticCommon.isEqual({ a: "1" }, { a: 1 }), false);
            assert.equal(StaticCommon.isEqual("1122", 1122), false);
        });
        it("getValue test", () => {
            assert.equal(StaticCommon.getValue({ a: 1 }, "a"), 1);
            assert.equal(JSON.stringify(StaticCommon.getValue({ a: [2,3,4] }, "a")), JSON.stringify([2,3,4]));
            assert.equal(StaticCommon.getValue({ a: { b: 3 } }, "a.b"), 3);
            assert.equal(StaticCommon.getValue(null, "title", "none"), "none");
        });
        it("getValue for array list length test", () => {
            assert.equal(StaticCommon.getValue({a:["a","b","c"]}, "a.length"), 3);
        });
        it("getValue from array list", () => {
            const testData = {
                a: {
                    data: ["aaa", "bbb"]
                }
            };
            assert.equal(StaticCommon.getValue(testData, "a.data.1"), "bbb");
        });
        it("getValue from array item's attribute", () => {
            const testData = {
                a: {
                    data: [
                        "aaa",
                        "bbb",
                        {
                            version: "v1.0.1"
                        }]
                }
            };
            assert.equal(StaticCommon.getValue(testData, "a.data.2.version"), "v1.0.1");
        });
        it("setValue test", () => {
            var a = {};
            StaticCommon.setValue(a, "title", "test");
            StaticCommon.setValue(a, "info.name", "elmer");
            assert.equal(a.title, "test");
            assert.equal(a.info.name, "elmer");
        });
        it("toHumpStr test", () => {
            assert.equal(StaticCommon.toHumpStr("aa-bb-cc"), "aaBbCc");
            assert.equal(StaticCommon.toHumpStr("aa-bb-cc", true), "AaBbCc");
        });
        it("humpToStr test", () => {
            assert.equal(StaticCommon.humpToStr("aaBbCc"), "aa-bb-cc");
            assert.equal(StaticCommon.humpToStr("AaBbCc"), "aa-bb-cc");
        });
        it("extend test", () => {
            var a = { name: "test" }, b = { age: 12 };
            StaticCommon.extend(a, b);
            assert.equal(a.age, 12);
            assert.equal(b.name !== "test", true);
        });
        it("val test", () => {
            assert.equal(StaticCommon.val("12"), 12);
            assert.equal(StaticCommon.val("true"), true);
            assert.equal(StaticCommon.val("12.22.33"), "12.22.33");
        });
        it("UUID test", () => {
            assert.equal(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{8}/.test(StaticCommon.guid()), true);
        });
    });
    describe("getCommond test", ()=>{
        it("give key of mode should be return true or false", () => {
            const commandList = [
                "script=aaa",
                "mode",
                "--config",
                "./find.js"
            ];
            const reValue = getCommand(commandList, "mode");
            assert.equal(reValue, true);
        });
        it("give key of mode should be return uat", () => {
            const commandList = [
                "script=aaa",
                "mode=uat",
                "--config",
                "./find.js"
            ];
            const reValue = getCommand(commandList, "mode");
            assert.equal(reValue, "uat");
        });
        it("give key of --config should be return ./find.js", () => {
            const commandList = [
                "script=aaa",
                "mode=uat",
                "--config",
                "./find.js"
            ];
            const reValue = getCommand(commandList, "--config");
            assert.equal(reValue, "./find.js");
        });
        it("give key of --config should be return example, given key of example should be return undefined", () => {
            const commandList = [
                "script=aaa",
                "mode=uat",
                "--config",
                "example",
                "./find.js"
            ];
            const reValue = getCommand(commandList, "--config");
            const exampleValue = getCommand(commandList, "example");
            assert.equal(reValue, "example");
            assert.equal(exampleValue, undefined);
        });
    });
});
