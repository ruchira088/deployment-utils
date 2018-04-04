const { assert } = require("chai")
const { extractEnvValues } = require("../app/k8s")

describe("k8s.js", () => {
    describe("extractEnvValues", () => {
        it("should return expected object", () => {

            assert.deepEqual(
                extractEnvValues({ name: "John", ENV_STAGE: "dev", ENV_BRANCH: "master", version: "0.0.1" }),
                { STAGE: "dev", BRANCH: "master" }
            )

            assert.deepEqual(
                extractEnvValues({ name: "Jane" }),
                { }
            )

        })
    })
})