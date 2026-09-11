---
icon: lucide/drafting-compass
---

# Architecture

## Unshare

As you may already know, The Podman container technology relies on namespaces,

New Linux Namespaces are typically spawned by using either the `clone` or `unshare` system calls. These exist as C functions that have wrapper in many languages.
For using in a shell, unshare is more straight forward.

```
unshare --help
```

!!! info "When you run unshare in a shell, it does not directly executue but wraps the real unshare kernel call inside of itself."

The mnt_ns is what responsible for storing the mount table in Linux kernel. When a sandboxed environment like a container runs in a new Mount Namespace, it can mount filesystems not present on the host.

```
sudo unshare -m /bin/bash
```

```{.yaml .no-copy}
[sudo] password for localhost:
root@localhost:/var/home/localhost/# whoami
root
```

_depending on where you are using, you may need sudo._

- Unshare wraps the unshare kernel sys call.
- `-m` requests a mount new Namespace.
- `/bin/bash` tells what program to run after the mount. We ran bash thus, it gave a bash terminal

```
mount -t tmpfs tmpfs /mnt
mount | grep mnt
```

It creates a tem fs in ram and covers up the existing up one.

Now lets add something to the new /mnt

```
date > /mnt/date
cat /mnt/date
```

```{.yaml .no-copy}
Fri Sep 11 10:49:31 AM +0530 2026
```

Seems date added to /mnt ?

We can exit the name space either by closing the terminal tab or using the `exit` command.

```
exit
```

```{.yaml .no-copy}
exit
```

Now let's try reading from /mnt/date

```
cat /mnt/date
```

```{.yaml .no-copy}
cat: /mnt/date: No such file or directory
```

As it was created in a temporary mount namespace, it is gone after `exit`.
