---
icon: lucide/boxes
---

# Docker & Podman

!!! note "Countless Linux container technologies have blended into thin air over the years. As the industries evolved, it left Docker and Podman."

    !!! tip "Imagine the final zone of a battle royal"

        You and another teammate is alive. You said after you and let them advance. They looted everything. They got the first mover advantage. Right after that, they got kicked out of lobby by a sniper. You went onto camp. You got the second mover advantage. That is, in a nutshell, the story of Docker and Podman.

## Docker

Docker uses a daemon-based model (dockerd). It manages containers and related using the persistent background server (daemon) called docker. And this daemon-based model design makes the container lifecycle management straightforward but, at the same time, creates a single point of failure. If the daemon stops, every container it manages stops with it. The daemon usually runs with root privileges, which then raises security considerations in environments with strict compliance requirements.

## Podman

Podman uses a fork-exec model. It manages containers by a two step process (fork-exec) that clones the existing process (called the parent) and overwrites it with a new program. It offers a way to run a container as a simple process like anything other without the need for a daemon or root. It primarily relies heavily on systemd and libpod library. Podman’s daemonless and inclusive architecture makes it an accessible, security-focused option for container management.

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

## Analogy

While both tools share a similar feature set. Docker often resists structural changes to maintain backward compatibility whereas Podman freely adopts to modern needs.

- legacy systems where migration is practically impossible, Docker remains the only solution.
- For starting new from ground up, Podman serves as the right focal point that reduces migration needs in future.

Moving forward, this resource will focus primarily on Podman. While we hope to introduce Docker support down the road, our current priorities have been optimized for Podman's ecosystem.
