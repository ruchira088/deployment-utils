#!/bin/bash

S3_DEPENDENCY_BUCKET=s3://sbt-dependencies.ruchij.com
PACKAGED_FILE_EXTENSION=tar.gz

checkDependencyBundle() {
    echo "checkDependencyBundle($1)"

    aws s3 ls "$S3_DEPENDENCY_BUCKET/$1" >> /dev/null
}

pullDependencies() {
    echo "pullDependencies($1)"

    packagedFileName="$1.$PACKAGED_FILE_EXTENSION"

    if checkDependencyBundle $packagedFileName; then
        echo "Fetching the packaged dependencies from $S3_DEPENDENCY_BUCKET/$packagedFileName"

        aws s3 cp "$S3_DEPENDENCY_BUCKET/$packagedFileName" $HOME

        echo "Fetched packaged dependencies"

        echo "Applying dependencies"

        tar -xvf "$HOME/$packagedFileName" -C $HOME

        echo "Applied dependencies"

        echo "Clearing fetched packages at $HOME/$packagedFileName"

        rm -rf "$HOME/$packagedFileName"

        echo "Cleared fetched packages"
    else
        echo "Dependency bundle NOT found in $S3_DEPENDENCY_BUCKET"
    fi
}

uploadDependencies() {
    echo "uploadDependencies(projectDependencyKey = $1)"

    packagedFileName="$1.$PACKAGED_FILE_EXTENSION"

    if checkDependencyBundle $packagedFileName; then
        echo "Packaged dependency bundle already exists in $S3_DEPENDENCY_BUCKET"
    else
        echo "Packaging dependencies into $packagedFileName"

        tar -C $HOME -czf "$HOME/$packagedFileName" .sbt .ivy2

        echo "Packaging COMPLETED"

        echo "Uploading $packagedFileName to $S3_DEPENDENCY_BUCKET"

        aws s3 cp "$HOME/$packagedFileName" $S3_DEPENDENCY_BUCKET

        echo "Uploaded dependencies"

        echo "Clearing created packages at $HOME/$packagedFileName"

        rm "$HOME/$packagedFileName"

        echo "Cleared created packages"
    fi

    echo "Successfully completed uploadDependencies($1)"
}