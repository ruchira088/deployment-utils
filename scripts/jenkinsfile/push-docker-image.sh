#!/bin/bash

apk -v --update add python py-pip git && \
pip install awscli --upgrade --user && \
ln -sf $HOME/.local/bin/aws /usr/local/bin

aws ecr get-login --no-include-email --region ap-southeast-2 | sh

DOCKER_REPOSITORY_URL=`cat dev-ops/terraform/docker-repository-url.txt`
GIT_COMMIT=`git rev-parse HEAD | cut -c1-8`

echo "DOCKER_REPOSITORY_URL = $DOCKER_REPOSITORY_URL"

DOCKER_IMAGE_TAG=$JOB_NAME-$BUILD_NUMBER
docker build -t $DOCKER_IMAGE_TAG -f dev-ops/Dockerfile .

dockerTags=(
    "$DOCKER_REPOSITORY_URL:jenkins-build-id-$BUILD_NUMBER"
    "$DOCKER_REPOSITORY_URL:commit-$GIT_COMMIT"
    "$DOCKER_REPOSITORY_URL:latest"
)

for dockerTag in "${dockerTags[@]}"
do
    docker tag $DOCKER_IMAGE_TAG:latest $dockerTag
    docker push $dockerTag
done

docker images