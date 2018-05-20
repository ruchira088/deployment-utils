#!/bin/bash

apt-get update && \
apt-get install \
    apt-transport-https \
    bc \
    ca-certificates \
    software-properties-common \
    python-pip \
    python-dev \
    build-essential \
    -y

echo "deb https://dl.bintray.com/sbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list && \
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2EE0EA64E40A89B84B2DF73499E82A75642AC823 && \
apt-get update && \
apt-get install sbt -y

pip install awscli --upgrade --user && \
ln -sf $HOME/.local/bin/aws /usr/local/bin

sbt testWithCoverage

aws s3 cp --recursive target/test-results $ARTIFACTS_URL/$JOB_NAME/test-results
aws s3 cp --recursive target/scala-2.12/scoverage-report $ARTIFACTS_URL/$JOB_NAME/coverage-report