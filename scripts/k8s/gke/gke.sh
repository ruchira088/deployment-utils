#!/usr/bin/env bash

# Installing helm
kubectl create serviceaccount --namespace kube-system tiller
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
helm init --service-account tiller

# Deploy nginx-ingress
helm install --name nginx-ingress stable/nginx-ingress --set rbac.create=true

# Install the CustomResourceDefinition resources separately
kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.6/deploy/manifests/00-crds.yaml

# Create the namespace for cert-manager
kubectl create namespace cert-manager

# Label the cert-manager namespace to disable resource validation
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true

# Update your local Helm chart repository cache
helm repo update

# Install the cert-manager Helm chart
helm install \
  --name cert-manager \
  --namespace cert-manager \
  --version v0.6.0 \
  stable/cert-manager

aws s3 cp s3://cert-manager.ruchij.com/cert-manager-secrets.yaml . ; kubectl apply -f cert-manager-secrets.yaml; rm cert-manager-secrets.yaml

aws s3 cp s3://cert-manager.ruchij.com/cluster-issuer.yaml . ; kubectl apply -f cluster-issuer.yaml; rm cluster-issuer.yaml