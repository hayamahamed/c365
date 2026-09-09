---
icon: lucide/boxes
---

# Docker & Podman[^1]

There were countless container technologies with fundamentally different architectures for Linux. As the industries evolved, only few left alive. Docker and Podman became the main stream.

??? tip "Imagine the final zone of a battle royal"

     You and another teammate are alive. They advanced and looted everything. They got the first mover advantage. Right after that, they were kicked out of the lobby in a cross-fire. You went onto camp. You got the second mover advantage. That is, in a nutshell, the story[^2].

## Docker

Docker uses a daemon-based model (dockerd). It manages containers and related using the persistent background server (daemon) called docker. And this daemon-based model design makes the container lifecycle management straightforward but, at the same time, creates a single point of failure. If the daemon stops, every container it manages stops with it. The daemon usually runs with root privileges, which then raises security considerations in environments with strict compliance requirements.

## Podman

Podman uses a fork-exec model. It manages containers by a two step process (fork-exec) that clones the existing process (called the parent) and overwrites it with a new program. It offers a way to run a container as a simple process like anything other without the need for a daemon or root. It primarily relies heavily on systemd and libpod library. Podman’s daemonless and inclusive architecture makes it an accessible, security-focused option for container management.

## Comparison

When we compare Docker and Podman, Docker is the first mover who's blessed with the network effect and Podman is the second mover who is blessed by the awarness of the first mover's mistakes.

| Feature        | Podman                                  | Docker                                  | Verdict |
| -------------- | --------------------------------------- | --------------------------------------- | ------- |
| Architecture   | Daemonless (user processes only)        | Centralized daemon (dockerd)            | Podman  |
| Security       | Rootless by default                     | root unless configured manually         | Podman  |
| Performance    | Faster startup & lower memory footprint | Slower & heavier memory footprint       | Podman  |
| Kubernetes     | Built-in pod model, YAML generator      | Compose/Buildx-based workflows          | Podman  |
| Ecosystem      | Lightweight, OCI-native                 | Large community, Docker Hub integration | Depends |
| Learning Curve | Docker-compatible                       | CLI Standard in most workflows          | Tie     |
| Orchestration  | Kubernetes only                         | Swarm and Kubernetes                    | Docker  |

## Analogy

While both tools share a similar feature set. Docker often resists structural changes to maintain backward compatibility whereas Podman freely adopts to modern needs.

- legacy systems where migration is practically impossible, Docker remains the only solution.
- For starting new from ground up, Podman serves as the right focal point that reduces migration needs in future.

Moving forward, this resource will focus primarily on Podman and rpm based operating systems. We hope to introduce support for other platforms down the road. :heart:

[^1]: Docker and Podman are registered trademarks of Docker Inc and Redhat Inc.

[^2]: In 2013, Docker came and revolutionized how software was built and deployed. As Docker grew, it began adding features directly into the core engine (such as Swarm) which was opposed and resisted by the community, particularly, CoreOS, a company that specialized in building minimal, highly secure Linux operating systems for running containers at scale, So CoreOS designed Rkt with a fundamentally different architecture. It was what introduced the no-daemon architecture that can directly integrate with Linux init systems (especially well with systemd). This act fragmented the enter container ecosystem therefor, the Open Container Initiative (OCI) under the Linux Foundation formed that managed to get pieces from both the Docker and Rkt to build a standard called OCI standards that all containarization technologies follow now. Redhat acquired CoreOS in 2018 for a quater billion dollars. They created Podman out of the daemon less philosophy of Rkt owned by the CoreOS acquisation and the user friendly CLI of Docker. It gave podman the characteristics of _Rootless by default_, _Daemonless architecture_, and _First-Class Pods (a concept borrowed from kubernetes)_ .
