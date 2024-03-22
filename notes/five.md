# March 19 Notes

## Kubernetes Google

- Create a automated cluster in Kubernetes engine.
- Connect using the `Connect` button given in the console.
- You might have to install some dependency to make this run.

## Context switching

```bash
kubectl config get-contexts
```

to see the available contexts

```bash
kubectl config use-context <Context-Name>
```

to switch to a particular context

- A context has all the necessary environment variables, configurations etc.

## Secrets exchange

```bash
kubectl get secret google -o yaml > google.yaml
```

to get the google secret in yaml format and then put the output in the file google.yaml

```bash
kubectl create -f google.yaml
```

to create any kubernetes service (for this case, it's a secret)

## Load balancer

- Create loadbalancer using `ingress.yaml` in templates folder
- Note that "ImplementationSpecific" means that Kubernetes will decide that on its own.
