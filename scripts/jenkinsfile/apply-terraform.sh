#!/bin/bash

export PROJECT_ROOT=`pwd`
export terraform=$PROJECT_ROOT/Software/terraform

beforeApply() {
    apt-get update && apt-get install jq wget unzip -y

    mkdir Software && \
    wget -P Software https://releases.hashicorp.com/terraform/0.11.7/terraform_0.11.7_linux_amd64.zip && \
    unzip -d Software Software/terraform_0.11.7_linux_amd64.zip && rm -rf Software/*.zip

    cd dev-ops/terraform
    sed -i "s/BACKEND_KEY/`echo $JOB_NAME | tr / -`/g" resources.tf

    $terraform init
}

afterApply() {
    $terraform show

    DOCKER_REPOSITORY_URL=`$terraform output -json | jq .dockerRepositoryUrl.value`

    echo $DOCKER_REPOSITORY_URL >> docker-repository-url.txt

    cd $PROJECT_ROOT
}
