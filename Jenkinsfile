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

        stage("Apply Terraform") {
            container("ubuntu") {
                sh """
                    apt-get update && apt-get install curl wget unzip python-pip python-dev build-essential -y

                    pip install awscli --upgrade --user && \
                    ln -sf $HOME/.local/bin/aws /usr/local/bin

                    aws s3 ls

                    mkdir Software && \
                    wget -P Software https://releases.hashicorp.com/terraform/0.11.7/terraform_0.11.7_linux_amd64.zip && \
                    unzip -d Software Software/terraform_0.11.7_linux_amd64.zip && rm -rf Software/*.zip

                    PROJECT_ROOT=`pwd`
                    cd dev-ops/terraform

                    \$PROJECT_ROOT/Software/terraform init
                    \$PROJECT_ROOT/Software/terraform plan
                    \$PROJECT_ROOT/Software/terraform apply -auto-approve

                    cd \$PROJECT_ROOT
                """
            }
        }

        stage("Apply CloudFormation template") {
            container("ubuntu") {
                sh """
                    apt-get update && apt-get install python-pip python-dev build-essential -y

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
                    docker build -t $JOB_NAME .
                    docker images
                """
            }
        }
    }
}