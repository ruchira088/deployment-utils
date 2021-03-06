const { assert } = require("chai")

const { parseArgs } = require("../app/commands")

describe("commands.js", () => {
    describe("parseArgs", () => {
        it("should return the expected object", () => {
            const testValues = [
                { input: ["name=john"], expectedOutput: { name: "john" } },
                { input: ["name=jane", "--foo", "bar"], expectedOutput: { name: "jane", foo: "bar" } },
                { input: ["--name", "jane", "hello=world"], expectedOutput: { name: "jane", hello: "world" } },
                { input: ["--name", "--firstName", "john"], expectedOutput: { firstName: "john" } },
                { input: ["john", "--name"], expectedOutput: { undefined: "john" } },
                { input: ["name=jane", "name=john"], expectedOutput: { name: "john" } }
            ]

            testValues.forEach(({ input, expectedOutput }) => {
                assert.deepEqual(parseArgs(input), expectedOutput)
            })
        })
    })
})