var describe = require("mocha").describe;
var assert = require("assert");
var { queueCallFunc, StaticCommon } = require("../../lib/index");

describe("Queue call function list", () => {
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
