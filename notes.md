```bash

minikube start --cpus=4 --memory=4096 --addons=ingress

kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.10.2/serving-crds.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.10.2/serving-core.yaml

kubectl apply -f https://github.com/knative/eventing/releases/download/knative-v1.10.1/eventing-crds.yaml
kubectl apply -f https://github.com/knative/eventing/releases/download/knative-v1.10.1/eventing-core.yaml
kubectl apply -f https://github.com/knative/eventing/releases/download/knative-v1.10.1/in-memory-channel.yaml
kubectl apply -f https://github.com/knative/eventing/releases/download/knative-v1.10.1/mt-channel-broker.yaml

kubectl apply -f https://github.com/knative/net-kourier/releases/download/knative-v1.10.0/kourier.yaml

kubectl patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'

kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.10.2/serving-default-domain.yaml


kn service create helloworld-go --image gcr.io/knative-samples/helloworld-go

kubectl --namespace kourier-system get service kourier
NAME      TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
kourier   LoadBalancer   10.103.199.204   127.0.0.1     80:30211/TCP,443:32006/TCP   12m

minikube tunnel

kn service list
NAME            URL                                               LATEST                AGE     CONDITIONS   READY   REASON
helloworld-go   http://helloworld-go.default.127.0.0.1.sslip.io   helloworld-go-00001   8m57s   3 OK / 3     True
tek@ubuntu:~$ curl http://helloworld-go.default.127.0.0.1.sslip.io
Hello World!



minikube addons enable registry
kubectl port-forward --namespace kube-system service/registry 5000:80
docker run --rm -it --network=host alpine ash -c "apk add socat && socat TCP-LISTEN:5000,reuseaddr,fork TCP:$(minikube ip):5000"

kubectl -n knative-serving edit configmap config-deployment

# 添加localhost:5000到registries-skipping-tag-resolving节点中
# 注意是data→registries-skipping-tag-resolving，不是_example

data:
  registries-skipping-tag-resolving: "localhost:5000"
  _example: |-
    ...
```
