def podLabel = "jenkins-pod-${UUID.randomUUID().toString()}"

podTemplate(
    label: podLabel,
    containers: [
        containerTemplate(
            name: "docker",
            image: "docker",
            ttyEnabled: true
        ),
        containerTemplate(
            name: "nodejs",
            image: "node",
            ttyEnabled: true
        ),
        containerTemplate(
            name: "ubuntu",
            image: "ubuntu",
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

        stage("Checkout source code") {
            checkout scm
        }

        stage("Apply CloudFormation template") {
            container("ubuntu") {
                sh """
                    apt-get update && apt-get install python-pip python-dev build-essential -y && \
                    pip install awscli --upgrade --user && \
                    ln -sf $HOME/.local/bin/aws /usr/local/bin

                    echo 'Hello World' >> $HOME/envValues.txt
                """
            }
        }


        stage("Running tests (with coverage ?)") {

            container("nodejs") {
                sh """
                    yarn install && \
                    npm test && \
                    cat $HOME/envValues.txt
                    ls -a $HOME
                    ls -a $WORKSPACE
                """
            }
        }

        stage("Build Docker image") {

            container("docker") {
                sh """
                    DOCKER_REPO=$JOB_NAME
                    echo $DOCKER_REPO
                    docker build -t "$DOCKER_REPO-$RANDOM" .
                    docker images
                """
            }
        }
    }
}