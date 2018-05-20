def podLabel = "jenkins-pod-${UUID.randomUUID().toString()}"

podTemplate(
    label: podLabel,
    containers: [
        containerTemplate(
            name: "nodejs",
            ttyEnabled: true,
            image: "node",
        )
    ]
) {
    node(podLabel) {

        stage("Checkout source code") {
            checkout scm
        }

        stage("Running tests (with coverage ?)") {

            container("nodejs") {
                sh """
                    yarn install && \
                    npm test
                """
            }
        }
    }
}