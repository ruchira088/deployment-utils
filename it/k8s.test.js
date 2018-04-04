const { assert } = require("chai")
const { k8sConfig } = require("../app/k8s")

describe("k8s.js", () => {
    describe("k8sConfig", () => {
        it("should return success", done => {
            k8sConfig({
                name: "sample-name",
                containerPort: "123",
                dockerImage: "sample-image",
                host: "example.ruchij.com",
                replicaCount: "1",
            })
                .then(() => done())
                .catch(errorMessage => done(new Error(errorMessage)))
        });

        it("should return failure", done => {
            k8sConfig({
                name: "sample-name"
            })
                .then(() => done(new Error("k8sConfig did NOT reject the promise.")))
                .catch(error => {

                    ["replicaCount", "containerPort", "dockerImage"]
                        .forEach(key => {
                            assert.include(error, key)
                        })

                    assert.notInclude(error, "name")

                    done()
                })
        })
    })
})