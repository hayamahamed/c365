---
icon:
---

# General

## Linux Containers

### Introduction

<figure markdown="span">
    ![containers](../img/mascot.svg){ width="600" }
</figure>

A container is a sandboxed runtime environment on Linux systems. The sandbox is constructed using the utilities present in the Linux kernel. Software running in this sandbox share the kernel with the host it is running on, but the certain aspects of kernel that store the machine state are abstracted through namespaces to allow the isolated or the container environments to have a different state than the host even though they are sharing the same kernel.

As you may or may not heard of containers in MacOS[^1] and Windows[^2]. Windows and macOS run Linux containers by using a lightweight virtual machine in the background to provide the features only Linux kernel can offer.

The contents of the filesystem are typically provided by an image file and the environment exists as a chroot process in the filesystem. The network stack inside the container is constructed with the Linux network stack primitives to share a connection with the host without worrying about conflicting port numbers.

Containers should aim to preserve the normal system interface while changing what resources the software can see and access in a way that the software running in the sandbox should not recognize it is in a sandbox. The The software should run just as it would run natively on a host.

??? info "Sometimes, some programs deliberately try to find whether they are running inside an isolated environment."

    It can have legitimate purposes such as

      1. diagnostics

      2. compatibility

      3. virtualization management

      4. security software

    But malware can also do this to determine whether it is in a sandbox.

### Architecture

```mermaid
graph RL;
    A[Container N]-->C[Container Runtime]
    B[Container X]-->C[Container Runtime]
    C[Container Runtime]--> D[Host OS]
```

A Container Runtime sits between the containers and the host. It uses the primitives found on the host to create the containers. Detailed architecture is available at [
Containers Architecture](../architecture)

### Containers, images, and registries

!!! info

    The Open Container Initiative (OCI) is an open governance structure for the express purpose of creating open industry standards around container formats and runtimes.

| OCI Terms     | Definitions                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| Image[^1]     | An OCI image / a container image, is a read-only template with instructions for creating a container.     |
| Container[^2] | A runnable instance of an image.                                                                          |
| Registry[^3]  | A centralized system for storing, managing, and distributing container images and OCI compliant artifacts |

To create a container, a container image is used.

??? tip "The Container Story"

     This is, in a nutshell, the story[^2].

    ```mermaid
    quadrantChart
        x-axis First Movers --> Second Movers
        y-axis New Tech --> Known Tech
        quadrant-1 Depends
        quadrant-2 No risk but rewarding
        quadrant-3 Riskiest & most rewarding
        quadrant-4 Depends
        Podman: [0.3, 0.6]
        Flinch: [0.57, 0.69]
        Rkt: [0.78, 0.34]
        Docker: [0.40, 0.34]
    ```

    Old technology is determined by the new technology's underlying primitives that were matured/standardized as time went.

    Depends: _First Mover ∝ 1 / Second Mover_ . If first mover was great and self-contained enough, the second one wouldn't have had the chance.

    Note: This is not a scientifically validaded statement, but a rhetorial theory.

## Mainstream Container Technologies

There were countless container technologies with fundamentally different architectures for Linux. As the industries evolved, only few left alive. Docker and Podman became the main stream.

### Docker

Docker uses a daemon-based model (dockerd). It manages containers and related using the persistent background server (daemon) called docker. And this daemon-based model design makes the container lifecycle management straightforward but, at the same time, creates a single point of failure. If the daemon stops, every container it manages stops with it. The daemon usually runs with root privileges, which then raises security considerations in environments with strict compliance requirements.

### Podman

Podman uses a fork-exec model. It manages containers by a two step process (fork-exec) that clones the existing process (called the parent) and overwrites it with a new program. It offers a way to run a container as a simple process like anything other without the need for a daemon or root. It primarily relies heavily on systemd and libpod library. Podman’s daemonless and inclusive architecture makes it an accessible, security-focused option for container management.

### Comparison

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

### Backstory

In 2013, Docker came and revolutionized how software was built and deployed. As Docker grew, it began adding features directly into the core engine (such as Swarm) which was opposed and resisted by the community, particularly, CoreOS, a company that specialized in building minimal, highly secure Linux operating systems for running containers at scale, So CoreOS designed Rkt with a fundamentally different architecture. It was what introduced the no-daemon architecture that can directly integrate with Linux init systems (especially well with systemd). This act fragmented the enter container ecosystem therefor, the Open Container Initiative (OCI) under the Linux Foundation formed that managed to get pieces from both the Docker and Rkt to build a standard called OCI standards that all containarization technologies follow now. Redhat acquired CoreOS in 2018 for a quater billion dollars. They created Podman out of the daemon less philosophy of Rkt owned by the CoreOS acquisation and the user friendly CLI of Docker. It gave podman the characteristics of _Rootless by default_, _Daemonless architecture_, and _First-Class Pods (a concept borrowed from kubernetes)_ .

### Analogy

While both tools share a similar feature set. Docker often resists structural changes to maintain backward compatibility whereas Podman freely adopts to modern needs.

_legacy systems where migration is practically impossible, Docker remains the only solution._

Moving forward, this resource will focus primarily on Podman and rpm based operating systems. We hope to introduce support for other platforms down the road. :heart:

[^1]: Apple has its developer tool called container. It allows Mac users to create and run Linux containers using lightweight virtual machines on MacOS without needing for a third party. However, MacOS only offers Linux Container Utilities. There's no Mac containers.

[^2]: Windows has a fully functional container system built directly into its kernel, but it can only run Windows binaries inside a Windows namespace. A container in a Windows is almost always about Linux containers which Windows natively can't run. To overcome, it uses WSL 2. WSL 2, powered by a lightweight utility partition developed on a custom linux kernel via Hyper-V maintained by Microsoft. It creates a single virtual disk called ext.vhdx into which a standard linux ext4 filesystem lives. It can also work with other Linux filesystems but, ext4 is what it defaults to.

[^3]: An image doesn't necessarily mean it's built from ground up. Often, an image is based on another image, with some additional customization.

[^4]: You can create, start, stop, move, or delete a container. You can also connect a container to one or more networks, attach storage to it, or even create a new image based on its current state (aka commit).

[^5]: Common container registries are Docker Hub and Quay.io
