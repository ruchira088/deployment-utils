def podLabel = "jenkins-pod-${UUID.randomUUID().toString()}"

podTemplate(
    label: podLabel,
    containers: [
        containerTemplate(
            name: "nodejs",
            ttyEnabled: true,
            image: "node",
        ),
        containerTemplate(
            name: "ubuntu",
            ttyEnabled: true,
            image: "ubuntu"
        )
    ]
) {
    node(podLabel) {

        stage("Checkout source code") {
            checkout scm
        }

        stage("Running tests with coverage") {

            container("nodejs") {

                sh """
                    yarn install && \
                    npm run testWithCoverage
                """
            }
        }

        stage("Uploading test results") {

            container("ubuntu") {

                sh """
                    apt update && apt upgrade -y

                    apt install python-pip python-dev build-essential -y && \
                    pip install awscli --upgrade --user && \
                    ln -sf $HOME/.local/bin/aws /usr/local/bin

                    ls -a
                """
            }
        }
    }
}