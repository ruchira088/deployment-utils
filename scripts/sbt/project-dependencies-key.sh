#!/bin/bash

md5Key() {
    echo `md5sum $1 | cut -c1-8`
}

if [ -n "$1" ]
then
    projectHome=$1
else
    projectHome=$PWD
fi

buildSbt="$projectHome/build.sbt"
dependencies="$projectHome/project/Dependencies.scala"
plugins="$projectHome/project/plugins.sbt"
buildProps="$projectHome/project/build.properties"

projectDependenciesHash="`md5Key $buildSbt`-`md5Key $dependencies`-`md5Key $plugins`-`md5Key $buildProps`"

echo $projectDependenciesHash