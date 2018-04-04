const { assert } = require("chai")
const { getHighestVersionTag } = require("../app/aws")

describe("aws.js", () => {
    describe("getHighestVersionTag", () => {
        it("should return the expected version tag", () => {
            const testValues = [
                { input: ["latest"], expectedOutput: undefined },
                { input: ["v3", "latest", "v2"], expectedOutput: 3 },
                { input: [], expectedOutput: undefined },
                { input: ["v1", "v12", "v2", "v5"], expectedOutput: 12 }
            ]

            testValues.forEach(({ input, expectedOutput }) => {
                assert.equal(getHighestVersionTag(input), expectedOutput)
            })
        })
    })
})