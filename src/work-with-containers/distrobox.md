---
icon: lucide/scan-box
---

# Distrobox

_Upon completion, you will have a project that reflects you can work with containers._

## Goal

1. Build a rootless Distrobox using an AlmaLinux image.

- Wrap it in a shell script that can be reproducible in any rpm based distro.
- Experiment with both rpm and deb containers from a RHEL and a Debian images.
- Package it for rpm.

## Understanding Distrobox

A container that tightly integrates with the host os, allowing sharing of the HOME directory of the user, external storage, external USB devices and graphical apps (X11/Wayland), audio, and all ports in a way that the host and the container becomes indistuinguishable from each other. When working towards it, few challenges will be encountered. We will solve it as we move.

- Privilledged Ports

  Ports under 1024 are considered privilledged that rootless container can not bind directly as kernel blocks processes without `CAP_NET_BIND_SERVICE` from binding privilledged ports. Binding ports is what brings this issue. Thanks to podman's engineers, we have `--network host` that does not bind any port at all, but just uses host network directly.

!!! success "Sometimes, it is wiser to not tackle, but to sidestep, and advance. <br> - Hayam A."

- Devices

A good thing is everything's exposed as files so, it is super easy to add & work with devices which shows in virtual `/dev` directory as if they are files.

Chances are you will need a display to access a program. Linux primarily uses two graphical displays, X11 and Wayland.
Fortunately, Podman also has display support for containers that we can directly use.

- Security

!!! warning "Disabling SELinux is one of the biggest security degrade and disabling SELinux for a container only gives the container unconfined access while keeping the system under the control of SELinux and it is also a security degrade, but with only the container as the degraded area."

Security, especially SELinux, is one of the most important thing which rpm distributions renowned to have support for. If a container tries to run as if a host as it needs to get absolute control over the system, SELinux will conflict with it. We need to disable SELinux restrictions for the container first which can be done via the line `--security-opt label=disable` in `podman create`. It will create a container with unrestricted access. We can insepct the container using `podman inspect` that is piped to a JSON file.

A tool called `ludica` can read the JSON file and creates an SELinux policy that allows what the distrobox needs and outputs a SELinux policy file that can be loaded as a SELinux module which will give distrobox the appropriate control from SELinux and restricting all other.

Now creating a new container will use that policy without needing to degrade the system security.

## Choosing the right image

Distroboxes need to run as if it is the host therefor, it needs to access system services. A special image type, init image, is required. The Init Image extends the base image, designed to run an init system as PID 1 for running multi-(system)services inside a container.

Since it has to be produced in a rpm based host, An Alma Linux 10 init image will be used as its default init service is systemd.

It can be pulled by

```
podman pull docker.io/almalinux/10-init
```

```{.no-copy .yaml}
Trying to pull docker.io/almalinux/10-init:latest...
Getting image source signatures
Copying blob 1762172a5766 [======================>---------------] 41.7MiB / 68.1MiB | 412.1 KiB/s
Copying blob 1762172a5766 done   |
Copying config defe64aa76 done   |
Writing manifest to image destination
defe64aa76a60a989666f479c14779cc3774ee00ee9c65c18a301543b76b30e2

```

## Build

```
podman image ls
```

```{.no-copy .yaml}
REPOSITORY                      TAG         IMAGE ID      CREATED      SIZE
docker.io/almalinux/10-init     latest      defe64aa76a6  9 days ago   198 MB
```

Here, Docker Hub is specifically used instead of quay.io for a reason. Give it a guess.

Now let's look at the container creation command,

```
podman create \
```

1. First, mention basic tags

```
--name alma-distrobox \
--hostname almadbx \
--userns=keep-id \

```

2. Security

3. Network

4. Display

5. Devices

6. Finally add the container image and `sleep infinite` as the command

```
docker.io/almalinux/10-init \
sleep infinity
```
