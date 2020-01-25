var describe = require("mocha").describe;
var assert = require("assert");
var Common = require("../../lib").Common;
var JSDOM = require("jsdom").JSDOM;
global.window = new JSDOM("").window;

describe("Common class test", () => {
   var com = new Common();
   it("getType test", () => {
       assert.equal(com.getType("test"), "[object String]");
   });
   it("isString test", () => {
       assert.equal(com.isString("aa"), true);
       assert.equal(com.isString(22), false);
   });
   it("isObject test", () => {
       assert.equal(com.isObject({a:1}), true);
       assert.equal(com.isObject(2234), false);
   });
   it("isArray test", () => {
       assert.equal(com.isArray({a:1}), false);
       assert.equal(com.isArray([2234]), true);
   });
   it("isNumeric test", () => {
       assert.equal(com.isNumeric("2234"), true);
       assert.equal(com.isNumeric(2234), true);
   });
   it("isDOM test", () => {
       var dm = window.document.createElement("div");
       assert.equal(com.isDOM(dm), true);
       assert.equal(com.isDOM(123), false);
   });
   it("isFunction test", () => {
       assert.equal(com.isFunction(()=>{return'aa';}), true);
       assert.equal(com.isFunction(a=>a+1), true);
   });
   it("isRegExp test", () => {
       assert.equal(com.isRegExp(/^[0-9]{1,}$/), true);
       assert.equal(com.isRegExp(2234), false);
   });
   it("isEmpty test", () => {
       assert.equal(com.isEmpty(), true);
       assert.equal(com.isEmpty(null), true);
       assert.equal(com.isEmpty(""), true);
       assert.equal(com.isEmpty(2), false);
   });
   it("isEqual test", () => {
       assert.equal(com.isEqual({a:1},{a:1}), true);
       assert.equal(com.isEqual({a:"1"}, {a:1}), false);
       assert.equal(com.isEqual("1122",1122), false);
   });
   it("getValue test", () => {
       assert.equal(com.getValue({a:1},"a"), 1);
       assert.equal(com.getValue({a:{b:3}},"a.b"), 3);
       assert.equal(com.getValue({},"title", "none"), "none");
   });
   it("setValue test", () => {
       var a = {};
       com.setValue(a,"title","test");
       com.setValue(a, "info.name", "elmer");
       assert.equal(a.title, "test");
       assert.equal(a.info.name, "elmer");
   });
   it("toHumpStr test", () => {
       assert.equal(com.toHumpStr("aa-bb-cc"), "aaBbCc");
       assert.equal(com.toHumpStr("aa-bb-cc", true), "AaBbCc");
   });
   it("humpToStr test", () => {
       assert.equal(com.humpToStr("aaBbCc"), "aa-bb-cc");
       assert.equal(com.humpToStr("AaBbCc"), "aa-bb-cc");
   });
   it("extend test", () => {
       var a = {name:"test"},b={age:12};
       com.extend(a,b);
       assert.equal(a.age, 12);
       assert.equal(b.name !== "test", true);
   });
   it("val test", () => {
      assert.equal(com.val("12"), 12);
      assert.equal(com.val("true"), true);
      assert.equal(com.val("12.22.33"), "12.22.33");
   });
   it("UUID test", () => {
       assert.equal(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{8}/.test(com.guid()), true);
   });
});
