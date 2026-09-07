---
icon:
---

# Containers

## Introduction

<figure markdown="span">
    ![linuxcontainers](https://cdn.simpleicons.org/linuxcontainers/3a76d6){ width="300" }
    <figcaption>F1: Linux Container</figcaption>
</figure>

A container is a sandboxed runtime environment on Linux systems. The sandbox is constructed using the utilities present in the Linux kernel. Software running in this sandbox share the kernel with the host it is running on, but the certain aspects of kernel that store the machine state are abstracted through namespaces to allow the isolated or the container environments to have a different state than the host even though they are sharing the same kernel.

As you may or may not heard of containers in MacOS and Windows. Windows and macOS run Linux containers by using a lightweight virtual machine in the background to provide the features only Linux kernel can offer.

???+ quote "Containers in windows & MacOS"

      Windows has a fully functional container system built directly into its kernel, but it can only run Windows binaries inside a Windows namespace. Most of the times when a container referred in a windows related talk, it is almost always about Linux containers which Windows natively can't run. To overcome, it uses WSL 2.
      WSL 2, powered by a lightweight utility partition utilizing a custom linux kernel via Hyper-V maintained by Microsoft. It creates a single virtual disk called ext.vhdx into which a standard linux ext4 filesystem lives. Don't be mistaken that it only works with ex4. It can also work with other linux filesystems and ext4 is what it defaults to.

      Apple has its developer tool called container. It allows Mac users to create and run Linux containers using lightweight virtual machines on MacOS without needing for a third party. However, Unlike Windows which offers its own container system along with WSL, MacOS only offers Linux Container Utilities.

The contents of the filesystem are typically provided by an image file and the environment exists as a chroot process in the filesystem. The network stack inside the container is constructed with the Linux network stack primitives to share a connection with the host without worrying about conflicting port numbers.

Containers should aim to preserve the normal system interface while changing what resources the software can see and access in a way that the software running in the sandbox should not recognize it is in a sandbox. The The software should run just as it would run natively on a host.

??? note "Sometimes, some programs deliberately try to find whether they are running inside an isolated environment."

    It can have legitimate purposes such as

      1. diagnostics

      2. compatibility

      3. virtualization management

      4. security software

    But malware can also do this to determine whether it is in a sandbox.

## Architecture

```mermaid
graph LR
A[Linux Kernel] --> B[
      cgroups
      pid_ns
      pic_ns
      net_ns
      uts_ns
      mnt_ns
      user_ns
      seccomp
] --> C[Application running on
OverlayFS]
```

_F2: Rough Architecture of container system_

In F2 above, the sandboxed container environment can be seen as the last third box. The middle box holds the container primitives and they are as follows:

| Container Primitives | Explanation                                                                                                                                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cgroups              | cgroup allows putting limits on a process and its children. Commonly used for limiting CPU and RAM usage. cgroups are technically optional for containers. However, you may need it in production.                                        |
| pid_ns               | The PID namespace (pid_ns) allows a process and its children to run in a new process tree that maps back to the host process tree.                                                                                                        |
| pic_ns               | The Inter-Process Communication Namespace (ipc_ns) limits the processes ability to share memory.                                                                                                                                          |
| net_ns               | The Network Namespace allows a new network stack to exist in the sandbox. This means our sandboxed environment can have its own network interfaces, routing tables, DNS lookup servers, IP addresses, and etc…​ you name!                 |
| uts_ns               | Ironic as it is, The Unix Time Sharing Namespace (uts_ns) exists purely to isolate the system identity strings. This allows a container to assign its own localized hostname.                                                             |
| mnt_ns               | The Mount Namespace (mnt_ns) is the part of the kernel that stores the mount table. When the sandboxed environment runs in a new Mount Namespace, it can mount filesystems not present on the host. This is very important as you’ll see. |
| user_ns              | The User Namespace (user_ns) the sandboxed environments to have its own set of user and group IDs that will map to unique user and group IDs back on the host system.                                                                     |
| seccomp              | seccomp is a utility acts as a filter for kernel calls. This allows us to drop Kernel capabilities in the sandboxed environment. Utilizing seccomp is also not strictly vital to containers.                                              |

We will be learning more about this in the following section [achitecture](architecture) which is not needed to manage container but helpful to grasp underlying concepts

## Containers, images, and registries

!!! info

    The Open Container Initiative (OCI) is an open governance structure for the express purpose of creating open industry standards around container formats and runtimes.

An OCI image, commonly called an image or a container image, is a read-only template with instructions for creating a container. Often, an image is based on another image, with some additional customization.

A container is a runnable instance of an image. You can create, start, stop, move, or delete a container. You can also connect a container to one or more networks, attach storage to it, or even create a new image based on its current state.

A container registry is a centralized system used to store, manage, and distribute container images and OCI compliant artifacts including container images. Common ones are Docker Hub, Quay.io, and Github Container Registry

## Creating a container

To create a container, we will use a container image. The contents of this image file are duplicated into the sandboxed environment as the root filesystem using OverlayFS and chroot. There are many strategies for mounting the root filesystem in the container, but OverlayFS is quite the common one.
