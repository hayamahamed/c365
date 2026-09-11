# Setup

As stated already, this resource focuses primarily on Podman and rpm based operating systems.

!!! info

    - RPM-based distributions are Linux distributions that use the RPM Package Manager (originally Red Hat Package Manager, now a recursive acronym) as their core system for installing, updating, managing, and removing software.

     - The RPM ecosystem forms the backbone of the enterprise Linux world, heavily favored in corporate data centers, cloud infrastructure, and commercial servers.

     - It has the first class support for Podman, systemd[^1], and SELinux[^2].

Since SELinux, systemd, and Podman co-engineered, it has the tightest integration a system can ever have.

When choosing a distribution it is recommended to choose from

- SUSE / openSUSE (Tumbleweed / Leap) : SUSE historically chose apparmor instead of SELinux and it is getting shifted to SELinux therefor, choose a version that has SELinux by defauly
- Fedora
- CentOS Stream
- RHEL
- AlmaLinux
- RockyLinux

!!! warning

    Do not run multiple atomic OSTree based operating systems on a single host without careful setup.

## Prepare the system

After installing the operating system, the packages and system updates are often older. It is recommended to update it before proceeding.

```
sudo dnf -y update # Might differ.
```

After that, check if all necessary packages are in place

```
podman -v &&  \
skopeo -v && \
buildah -v
```

If any of this does not return a version number, Install it using

```
dnf install -y podman
```

```
dnf install -y skopeo
```

```
dnf install -y buildah
```

Some of the distributions may utilize a different resolver for rpm packages such as SUSE uses zypper, Fedora Atomic uses rpm-ostree.

## General Info

!!! info

    Almost all packages' commands come with man page and help page.

      - Man page is a detailed manual which can be accessed using `man COMMAND`
      - Help page lists how to use each commands and the arguments it can take which can be accessed using `COMMAND -h`.

    It is encouraged to read each command's man page and help page to solidy the fundamentals of one on their own.

!!! info "When greeted by an unknown terminology, read the footnotes and the [glossaries](glossary) before proceeding."

[^1]: systemd is a system and service manager for Linux operating systems that starts and controls user-space processes after the kernel boots. systemd is a modern replacement for the traditional sysvinit (SysV init) process. While it replaces the old sysvinit system, it retains compatibility with legacy SysV init scripts in most configurations, allowing older software to boot seamlessly alongside modern systemd services.

[^2]:
    SELinux (Security-Enhanced Linux) is a Linux kernel security module that provides a mechanism for supporting access control security policies. Traditional Linux uses Discretionary Access Control (DAC), which relies on file ownership and permissions (rwx-rwx-rwx). If a process runs as the root user, it has access to almost everything. SELinux adds a security layer on top of it as ,

    - Least privilege by default: Even if a process runs as root, SELinux blocks it unless a specific policy explicitly permits the action.
    - Security Contexts (Labels): Every file, process, user, and network port is assigned an SELinux label therefor, it is easy and possible restrict nearly anything.
    - Type Enforcement: SELinux primarily looks at the type label. If a label does not match what the program trying to do, SELinux will forbid it.
