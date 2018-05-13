pipeline {
    agent {
        kubernetes {
            label "jenkins-pod"
            defaultContainer "jnlp"
            yaml """
apiVersion: v1
kind: Pod
spec:
    containers:
        - name: nodejs
          image: node
          tty: true
"""
        }
    }

    stages {
        stage("Tests with coverage") {
            steps {
                container("nodejs") {
                    sh """
                        node -v
                    """
                }
            }
        }
    }
}