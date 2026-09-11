---
icon: lucide/scan-box
---

# Distrobox

_Upon completion, you will have a project that reflects you can work with containers._

## Understand what a Distrobox is

A container that tightly integrates with the host os, allowing sharing of the HOME directory of the user, external storage, external USB devices and graphical apps (X11/Wayland), audio, and all ports in a way that the host and the container becomes indistuinguishable from each other.

## Goal

- Build a rootless Distrobox
- Experiment with both rpm and deb containers from a rhel 10 ubi and a debian bookworm image respectively.
- Wrap it in a shell script that can be reproducible in any rpm based distro.

## Challenges

Rootless podman, unlike rootfull, has to be run with restrictions. Once again, that's by design, not a flaw.

The main challenges are,

- Privilledged Ports binding
- Devices & Sockets integration

### Privilledged Ports

Ports under 1024 are considered privilledged that rootless container can not bind directly as kernel blocks processes without `CAP_NET_BIND_SERVICE` from binding privilledged ports.

Binding ports is what brings this issue. Thanks to podman's engineers, we have `--network host` that does not bind any port at all, but just uses host network directly.

!!! success "Sometimes, it is wiser not to tackle. but to sidestep. and go by. <br> - Hayam A."

### Devices & Sockets

This is the important and the trickiest part, but a good thing is everything's exposed as files and directories therefor, it is not that hard.

Chances are you will need a display to access a program. Linux primarily uses two graphical displays. One's older X11 and the other's modern Wayland. Almost all graphical program has perfect support for X11, and some greatly optimized app searches for Wayland for security concerns with fallback as X11.

Fortunately, Podman also has display support for containers that we can use here.

**We can work with other challenges as we build. 😇**

## Build
