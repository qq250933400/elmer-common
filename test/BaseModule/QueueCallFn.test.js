// var describe = require("mocha").describe;
require("mocha");
var assert = require("assert");
var { queueCallFunc, queueCallRaceAll } = require("../../lib/BaseModule/QueueCallFun");

describe("Queue call function list", () => {
    describe("queueCallFunc method test", ()=>{
        it("given a callback list then call list one by one", (done) => {
            queueCallFunc([
                {id: "test1", params: 22},
                {id: "test2", params: 33, fn: () => {
                    return 9;
                }},
                {id: "test3", params: 44}
            ], (options, param) => {
                return new Promise((resolve) => {
                    if(options.lastResult > 0) {
                        resolve(param + (options.lastResult % 2))
                    } else {
                        resolve(param + 10);
                    }
                });
            }).then((resp) => {
                console.log(resp, "-----------Return value");
                done();
                assert.equal(resp["test1"], 32);
                // assert.deepEqual(resp["test2"], 9);
            }).catch((err) => {
                console.error(err);
                done();
            });
        });
    });
    describe("queueCallRaceAll method test", ()=>{
        it("given more than one async function, then call back should be called after all async function has been called", (done) => {
            queueCallRaceAll([{
                id:"test1",
                params: "demo1",
                fn: () => {
                    console.log("---Check1");
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                        },200);
                    });
                }
            }], ()=>{
                console.log("----Check2");
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    },200);
                });
            }).then(() => {
                console.log("-----1");
                done();
            }).catch(() => {
                console.log("-----2");
                done();
            });
        });
    });
});
