const Schema = require("../../lib/Validation/Schema").Schema;
var describe = require("mocha").describe;
var assert = require("assert");

const schemaObj = new Schema();

describe("Validation Module", () => {
    it("String validation", () => {
        const isStr = schemaObj.validate({ 
            title: 12345
        }, {
            properties: {
                title: {
                    type: "String"
                }
            }
        }, "String Validation 1");
        const isStrV = schemaObj.validate({ 
            title: "0000"
        }, {
            properties: {
                title: {
                    type: "String"
                }
            }
        });
        assert.strict.equal(isStr, isStr);
        assert.strict.equal(isStrV, true);
    });
    it("Array<Item> validation", () => {
        const pass = schemaObj.validate({ 
            data: [
                {
                    id: 123,
                    title: "23455"
                }
            ]
        }, {
            properties: {
                data: {
                    type: "Array<#dateItem>",
                    isRequired: true
                }
            },
            dataType: {
                dateItem: {
                    properties: {
                        id: {
                            type:  "String|Number",
                            isRequired: true
                        },
                        value: {
                            type: "Any",
                            isRequired: true
                        }
                    }
                }
            }
        });
        assert.strict.equal(pass, false);
    });
});