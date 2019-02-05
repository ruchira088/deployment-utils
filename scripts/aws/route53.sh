#!/usr/bin/env bash

getHostedId() {
    domain=$1
    aws route53 list-hosted-zones | jq ".HostedZones | .[] | select(.Name == \"$domain.\") | .Id"
}

recordsSet() {
    domain=$1

    hostedId=`getHostedId $domain`
    echo "aws route53 list-resource-record-sets --hosted-zone-id $hostedId | jq" | bash \
        | jq '.ResourceRecordSets | .[] | select(.Type == "A") | {name: .Name, ip: .ResourceRecords[0].Value}'
}

insertRecord() {
    prefix=$1
    domain=$2
    ip=$3

    hostedId=`getHostedId $domain`
    echo `recordChangeSet $prefix $domain $ip` >> change-set.json

    echo "aws route53 change-resource-record-sets --hosted-zone-id $hostedId --change-batch file://$PWD/change-set.json" | bash

    rm change-set.json
}

recordChangeSet() {
   prefix=$1
   domain=$2
   ip=$3

   json="{
    \"Comment\": \"Insert a record for $prefix.$domain\",
    \"Changes\": [{
        \"Action\": \"CREATE\",
        \"ResourceRecordSet\": {
            \"Name\": \"$prefix.$domain\",
            \"Type\": \"A\",
            \"TTL\": 300,
            \"ResourceRecords\": [{\"Value\": \"$ip\"}]
        }
    }]
   }"

   echo "$json"
}

createDomain() {
    prefix=$1
    insertRecord $prefix "ruchij.com" "35.244.121.219"
}