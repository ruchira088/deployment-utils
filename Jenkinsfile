def podLabel = "jenkins-pod-${UUID.randomUUID().toString()}"

podTemplate(
    label: podLabel,
    containers: [
        containerTemplate(
            name: "docker",
            image: "docker",
            ttyEnabled: true,
            command: "cat"
        ),
        containerTemplate(
            name: "nodejs",
            image: "node",
            ttyEnabled: true
        )
    ],
    volumes: [
        hostPathVolume(
            hostPath: "/var/run/docker.sock",
            mountPath: "/var/run/docker.sock"
        )
    ]
) {
    node(podLabel) {
        stage("Running tests (with coverage ?)") {

            checkout scm

            container("nodejs") {
                sh """
                    yarn install && \
                    npm test
                """
            }
        }

        stage("Build Docker image") {
            container("docker") {
                sh "env"
            }
        }
    }
}