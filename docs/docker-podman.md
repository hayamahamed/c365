---
icon: lucide/boxes
---

# Docker & Podman

!!! note "Countless Linux container technologies have blended into thin air over the years. As the industries evolved, it left Docker and Podman as the primary survivors."

    !!! tip "Imagine the final zone of a battle royal"

        You and another teammate is alive. You said after you and let them advance. They looted everything. They got the first mover advantage. Right after that, they got kicked out of lobby by a sniper. You went onto camp. You got the second mover advantage. That is, in a nutshell, the story of Docker and Podman.

## Docker

Docker uses a daemon-based model (dockerd). It manages containers, networking, images and much more. And this daemon-based model design makes the container lifecycle management straightforward but, at the same time, creates a single point of failure. So now, if the daemon stops, every container it manages stops with it. The daemon usually runs with root privileges, which then raises security considerations in environments with strict compliance requirements.

## Podman

Podman (short for pod manager) is an open source tool for developing, managing, and running containers using the libpod library.

Podman’s daemonless and inclusive architecture makes it an accessible, security-focused option for container management. Its accompanying tools and features, such as Buildah and Skopeo, let developers customize their container environments to suit their needs.

## Comparison

When we compare Docker and Podman, Docker is the first mover who's blessed with the network effect and Podman is the second mover who is blessed by the awarness of the first mover's mistakes.

| Feature        | Podman                                  | Docker                                  | Verdict      |
| -------------- | --------------------------------------- | --------------------------------------- | ------------ |
| Architecture   | Daemonless (user processes only)        | Centralized daemon (dockerd)            | Podman       |
| Security       | Rootless by default                     | root unless configured manually         | Podman       |
| Performance    | Faster startup & lower memory footprint | Slower & heavier memory footprint       | Podman       |
| Kubernetes     | Built-in pod model, YAML generator      | Compose/Buildx-based workflows          | Podman       |
| Ecosystem      | Lightweight, OCI-native                 | Large community, Docker Hub integration | Depends      |
| Learning Curve | Docker-compatible                       | CLI Standard in most workflows          | Tie          |
| Orchestration  | Kubernetes only                         | Swarm and Kubernetes                    | Tie / Docker |

Most of the legacy systems are running on Docker in a way migrating is nearly impossible. In those places, without a doubt, Docker is needed more than anything else

Most of the features are shareable with each other, but Docker almost always won't do it to keep up with backward compatibility whereas Podman freely does which is sometimes far more important than the ecosystem.

It is planned to structure the resource focusing on Podman from now on. It is possible to add Docker resources in the future, but not a promise :/.
