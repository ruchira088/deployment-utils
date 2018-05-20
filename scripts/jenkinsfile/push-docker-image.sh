#!/bin/sh

apk -v --update add python py-pip git && \
pip install awscli --upgrade --user && \
ln -sf $HOME/.local/bin/aws /usr/local/bin

aws ecr get-login --no-include-email --region ap-southeast-2 | sh

DOCKER_REPOSITORY_URL=`cat dev-ops/terraform/docker-repository-url.txt`
GIT_COMMIT=`git rev-parse HEAD | cut -c1-8`

echo "DOCKER_REPOSITORY_URL = $DOCKER_REPOSITORY_URL"

DOCKER_IMAGE_TAG=$JOB_NAME-$BUILD_NUMBER
docker build -t $DOCKER_IMAGE_TAG -f dev-ops/Dockerfile .

docker tag $DOCKER_IMAGE_TAG:latest `echo $DOCKER_REPOSITORY_URL | tr -d '"'`:build-number-$BUILD_NUMBER
docker push `echo $DOCKER_REPOSITORY_URL | tr -d '"'`:jenkins-build-id-$BUILD_NUMBER

docker tag $DOCKER_IMAGE_TAG:latest `echo $DOCKER_REPOSITORY_URL | tr -d '"'`:\$GIT_COMMIT
docker push `echo $DOCKER_REPOSITORY_URL | tr -d '"'`:commit-$GIT_COMMIT

docker tag $DOCKER_IMAGE_TAG:latest `echo $DOCKER_REPOSITORY_URL | tr -d '"'`:latest
docker push `echo $DOCKER_REPOSITORY_URL | tr -d '"'`:latest

docker images