---
icon: simple/podman
tags:
  - basic
  - 101
---

# Podman 101

Containers under the control of Podman can either be run by root or by a non-privileged user. Podman manages the entire container ecosystem which includes pods, containers, container images, and container volumes using the libpod library. Podman, by default, creates rootless containers.

## Managing a container

To manage a container, the order should be as follows,

- search the image
- pull the image
- Create a container
- Start the container
- Open a shell that can access the container

??? info "How to create, start, and use a container in a single command"

    All of these can be done in a single line

    ```
    podman run -it quay.io/almalinuxorg/almalinux
    ```

    ```{ .yaml .no-copy }
    Trying to pull quay.io/almalinuxorg/almalinux:latest...
    Getting image source signatures
    Copying blob 653c5d8d0d66 done   |
    Copying config de2f7b8674 done   |
    Writing manifest to image destination
    [root@fe6752c332b3 /]#
    ```

    It does three jobs

    - Pulls the container image from the url quay.io/almalinuxorg/almalinux if it isn't present locally.
    - Creating a container using that image if it isn't created before.
    - Running the container in an integrated terminal (letting us work inside the container)

    The problem is it will create a container with hostname and container name that is hard to keep track of.
    It is always recommended to atleast give the container a name that resembles its existence.

    ```
    podman run --hostname abc --name xyz -it quay.io/almalinuxorg/almalinux
    ```

    This line does the same job `podman run -it quay.io/almalinuxorg/almalinux`, but adds host name for the container as abc and the container name for the container as xyz which we use to access and manage the container.

    This is the fastest way to get a working container. It can also be stacked with many more arguments to customize. It is discouraged to use it until one gets the optimal understanding of how to work with the containers.

## Creating a container

Creating a container is primarily consist of three parts

- Search for the image across registries
- Get the appropriate container image to use
- Use it to create a container

### Images

Container images are unchanging static files that hold executable code and operate in isolation.
A container image assembles all the components needed to create a container on an operating system, and it comprises different image layers stacked on top of each other. Container images are immutable.

#### Search in registries

Container images are primarily searched on registries.

```
podman search almalinux
```

It will show all images related to the name almalinux.

```{ .yaml .no-copy }
NAME                                   DESCRIPTION
docker.io/library/almalinux            The official build of AlmaLinux OS.
docker.io/almalinux/almalinux          DEPRECATION NOTICE: This image is deprecated...
docker.io/almalinux/9-base             AlmaLinux release 9.8 base container image
docker.io/almalinux/8-base             AlmaLinux release 8.10 base container image
...
```

Podman defaults to docker.io, so podman search returns it.

Which registry to use also can be specified as follows,

```
podman search quay.io/almalinux
```

Now it will show results aggregated from quay.io registry

```{ .yaml .no-copy }
NAME                                        DESCRIPTION
quay.io/prometheus/node-exporter            # Node exporter  [![Build Status](https://gi...
quay.io/almalinuxorg/almalinux
quay.io/almalinuxorg/almalinux-bootc
quay.io/containerdisks/almalinux            # Almalinux Containerdisk Images  <img src="...
...
```

#### Pull image

The url from the `podman search` can be used to get the container image (to local storage) using `podman pull`.

```
podman pull quay.io/almalinuxorg/almalinux
```

```{ .yaml .no-copy }
Trying to pull quay.io/almalinuxorg/almalinux:latest...
Getting image source signatures
Copying blob 653c5d8d0d66 skipped: already exists
Copying config de2f7b8674 done   |
Writing manifest to image destination
de2f7b867468d83dcc57f1ed18177debebabb064a42134067cdc9a3a2cd36536
```

As you may see, since no tag's specified it default to latest.

#### Search on disk

To search the images present locally, either `podman images` or `podman image ls` can be used as both returns the same results.

```
podman images
```

```{ .yaml .no-copy }
REPOSITORY                      TAG         IMAGE ID      CREATED       SIZE
quay.io/almalinuxorg/almalinux  latest      de2f7b867468  4 days ago    194 MB
```

This will show the images available locally along with,

- which repo it came from
- tag (latest as the default if no tag is mentioned. Mentioning the appropriate tag is recommended rather than using latest)
- Image ID that we can use to create containers instead of needing to type the long repo url and its size.

Note that the created date doesn't come from when we pull but from when the container image is built.

#### Delete

Image ID, the whole url, or the name of an image can be used to remove it. The name is the rest part excluding the domain (such as quay.io) or localhost. Unless specified by the image ID, the tag is necessary or it will defaults to `:latest` just like podman pull. Here, it is recommended to either use the whole url with the tag or the image ID to avoid unecessary troubles.

A locally stored image can be deleted or removed via `podman image rm`.

```{.yaml .no-copy}
$ podman images
REPOSITORY                     TAG         IMAGE ID      CREATED            SIZE
localhost/main                 latest      f91f69dbf9eb  7 days ago         1.76 GB
docker.io/almalinux/10-base    latest      4a26427a4423  3 months ago       599 MB

```

```{.yaml .no-copy}
$ podman image rm f91f69dbf9eb
Untagged: localhost/main:latest
Deleted: f91f69dbf9ebfd3f78d55893fbb81e9546c1ff2ac25c50d632008b617c20447d
```

```{.yaml .no-copy}
$ podman image rm 10-base
Untagged: docker.io/almalinux/10-base:latest
Deleted: 4a26427a4423e96fd6e3991e4ff6dfe7397510e159e9482635b4cc395c5ce750
```

_$ is just a placeholder to indicate its a command, not an STDOUT printed to terminal._

We will learn more about images, how we build, and related things later.

### Search, Create, Start, and Use

#### Search

To be precise, Podman has no search for containers like for images but, it can list the containers.

```

podman ps

```

```{.yaml .no-copy}
CONTAINER ID  IMAGE                                  COMMAND         CREATED       STATUS        PORTS                   NAMES
bfdd7ca04f23  quay.io/almalinuxorg/almalinux:latest  sleep infinity  29 hours ago  Up 5 seconds  0.0.0.0:8080->8080/tcp  cn
```

`podman ps` prints the running containers info such as the name, the command that keeps it running, when it was created, its status, mapped ports, and the container name. by default, it prints only about the info of running container/s . It can take the `-a` (--all) argument to show all the containers. It can be as follows,

```
podman ps -a
```

```{.yaml .no-copy}
podman ps -a
CONTAINER ID  IMAGE                                  COMMAND         CREATED       STATUS             PORTS                   NAMES
3bfcec68a79f  docker.io/almalinux/10-base:latest     infinity        2 days ago    Up About a minute                          dev
bfdd7ca04f23  quay.io/almalinuxorg/almalinux:latest  sleep infinity  30 hours ago  Up 14 minutes      0.0.0.0:8080->8080/tcp  cn
```

#### Create

As you know, containers' image layer is immutable after creation. It is mandatory to add needed configuration while / before creating the container by adding tags to the command itself or any otherway which will be covered later.

```
podman create \
  --name container_name \
  --hostname container_hostname \
  --userns=keep-id \
  -p 8080:8080 \
  -v $HOME:$HOME:z \
  quay.io/almalinuxorg/almalinux:latest \
  sleep infinity
```

```{ .yaml .no-copy }
2b76e73ae5366148493c841e0980b41fa53c4e28710d581dcb56d8c19d764055
```

The numerical string that comes as the output is a hex hash / container ID that can be used to access the container instead of using the container name.
The hex hash is based on the combination of random data, timestamp, and host info, so the hash is almost always unique to one another.

###### info

??? info

    To access the container, The whole hash or the container ID of it is not necessary but, it must be in the length in which the the hash can be idenified distinctly from the others. The hash / ID must start from the first character and can go all the way upto all 52 chars depending on the need/s.

    `f07` as the ID can not be used if two or more hashes start with `f07`.

    !!! example

          If there're three hashes as <br>
            - `27abf265efc3d94996f8ada17abcd742fcab95a3f59fc67897cd5ea18725fcf5` <br>
            - `27af40ca73ec600cc7cc0a7d80c68f178bff2ccdbc34e5f11b7db86d28cf5601` <br>
            - `27af4001d44e3774f7c5715f59a5ee76c47829c565b9bc273671d8ee012d206c` <br>

           You'd have to atleast use the hash like 27af400 as the hash isn't presented in more than one hash. Most of the times, using first few chars to a 12 is enough.

The above create command creates a writable container layer over the specified image and prepares it for running the specified command. The container ID is then printed to STDOUT (Usually the output in the terminal unless used in programs for different purposes). This is similar to podman run -d except the container is never started. Now, the `podman start container` command can be used to start the container at any point.

The slashes (`\`) in the command solely used for writing commands in a smaller width.

The command Argument/s and the reason to use it.

| No  | Arg/s                                   | Reason                                                                            |
| --- | --------------------------------------- | --------------------------------------------------------------------------------- |
| 1   | `podman create`                         | It prepares to create a container                                                 |
| 2   | `--name container_name`                 | It gives the container the name "container_name"                                  |
| 3   | `--hostname container_hostname`         | It gives the container the hostname "container_hostname"                          |
| 4   | `--userns=keep-id  `                    | It maps the host UID with container UIDs to omit ownership conflicts              |
| 5   | `-p 8080:8080`                          | It maps the localhost:8000 containers localhost:8000                              |
| 6   | `-v $HOME:$HOME:z`                      | It maps the host volume home with a volume inside container as home.              |
| 7   | `quay.io/almalinuxorg/almalinux:latest` | This shows what image to use for the container.                                   |
| 8   | `sleep infinity`                        | This keeps the container alive by letting it sleep for infinitely long time. |

1.`podman create`

In podman theres two things, podman containers, and podman pods. Podman default to container when we type podman create and pod needs pod in the command which we will learn later. So the `podman create` is as same as `podman container create` . This part of the line instructs podman to create a container with the configurations written in the rest of the part of the command

2.`--name container_name`

It gives the container a label as `container_name` which we can use in the host to access the container instead of using the container id which has no effect inside the container. It is recommended to give a name that resembles the existence of the container

3.`--hostname container_hostname`

It gives the hostname the name `container_hostname` which comes after the `@`. You may wonder what about the username, We will be talking about it in the following section.

4.`--userns=keep-id`

A misconception is that a user only gets a single id. In reality, they get a pool of id all mapped to the same user. this line maps an id from it to the user inside the container. Since we create this as non-user the root and non-root account of the container gets mapped from the same pool of UID of the host user. Here, the userns keeps the id of host user making the container inherit the same username as host.

5.`-p 8080:8080`

As stated above, it maps the port 8080 if host with 8080 of the container. by default, mentioning port only maps the containers 8080 ports to host's http://0.0.0.0:8080 which anyone can access (even over the internet if configured.). Since anyone can access thing port can also be accessed http://localhost:8080 and http://127.0.0.1:8080. To avoid this you have to specify the address like `-p 127.0.0.1:8080:8080`. It can be specified in anyways.

Most of the time, a single port isn't enough so we can give a range of ports (along with specific ports if needed) as `-p 8000-9000:8000-9000`. It's not necessary to only have a single publishing arg (-p) in the command. Multiple -p args can be stacked together like `-p 8000-9000:8000-9000 -p 43:43 -p 127.0.0.1:9001:9001`. In fact, It's almost always done like this.

6.`-v $HOME:$HOME:z`

It mapes the home volume of the host with a new directory inside the container as home's name on host

Things after : is considered tag/s and Z and z are SELinux specific tags used to fix permission issues. the `:Z` tag means the podman performs a private, recursive relabeling of the host directory specified in the volume which is home here. Also theres a `:z` tag to which the Podman Recursively changes the SELinux context of the host directory to a shared container label (container_file_t). Use this when multiple containers need to read and write to the same host path simultaneously.

Without a tag podman defaults to :rw (read and write). Even after adding SELinux tag, Podman will still use :rw unless configured as :ro (read-only) or something else. Multiple tags can be added using a simple comma `,` like `-v $HOME:$HOME:z,rw`.

As stated, these are SELinux specific making it not work properly on systems that has no SELinux such as Ubuntu and Debian.
!!! warning

    - Avoid using :Z on system directories or the whole home directory
    - Avoid using :z where strict isolated is needed.

It is not necessary to know about all tags. Sticking with `:rw :ro :z :Z` for starters is enough.

| Tag                          | Category            | Explanation                                                                                                                                               | Compatibility & Combinations                                                                                                                                                     |
| :--------------------------- | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`:rw`**                    | Access Permission   | **Read-Write (Default).** Allows the container to read, modify, and delete files inside the mount point.                                                  | **Incompatible with:** `:ro`. <br>**Must be paired with:** `:z` or `:Z` on SELinux hosts to avoid permission errors.                                                             |
| **`:ro`**                    |                     | **Read-Only.** Blocks the container from making any changes. Attempts to write will return a `Read-only file system` error.                               | **Incompatible with:** `:rw`. <br>**Compatible with:** All SELinux (`:z`, `:Z`), ownership (`:U`), and propagation tags.                                                         |
| **`:z`**                     | SELinux Labeling    | **Shared Relabel.** Recursively changes host file labels to a shared context (`container_file_t`) so multiple containers can access them.                 | **Incompatible with:** `:Z`. <br>**Compatible with:** `:rw`, `:ro`, `:U`, and propagation tags.                                                                                  |
| **`:Z`**                     |                     | **Private Relabel.** Recursively changes host file labels to a unique, exclusive context. Only _this_ container can access the files.                     | **Incompatible with:** `:z`. <br>**Compatible with:** `:rw`, `:ro`, `:U`, and propagation tags.                                                                                  |
| **`:U`**                     | User Ownership      | **Chown/Re-own.** Recursively changes host file ownership (UID/GID) to match the internal user running inside the container. Essential for rootless mode. | **Compatible with:** All tags. Works perfectly alongside access permissions (`:rw`/`:ro`) and SELinux tags (`:z`/`:Z`).                                                          |
| **`:O`**                     | Performance Overlay | **Overlay Mount.** Mounts the host directory as a read-only base layer with a temporary write layer. Changes are lost when the container stops.           | **Incompatible with:** `:z`, `:Z` (bypasses SELinux labeling entirely), and propagation tags. <br>**Note:** Implicitly acts as `:rw` internally while keeping the host pristine. |
| **`:private` / `:rprivate`** | Mount Propagation   | **Private (Default).** Mount changes inside the container do not show up on the host, and vice versa. (`r` applies recursively).                          | **Incompatible with:** Other propagation tags and `:O`. <br>**Compatible with:** All access (`:rw`/`:ro`), SELinux (`:z`/`:Z`), and `:U` tags.                                   |
| **`:shared` / `:rshared`**   |                     | **Shared.** Two-way propagation. Mounts made on the host reflect inside the container, and mounts made inside the container reflect on the host.          | **Incompatible with:** Other propagation tags and `:O`. <br>**Compatible with:** All access, SELinux, and `:U` tags.                                                             |
| **`:slave` / `:rslave`**     |                     | **Slave.** One-way propagation. Mounts made on the host reflect inside the container, but container mounts do not show up on the host.                    | **Incompatible with:** Other propagation tags and `:O`. <br>**Compatible with:** All access, SELinux, and `:U` tags.                                                             |
| **`:unbindable`**            |                     | **Unbindable.** Prevents this specific directory from ever being cloned or bind-mounted somewhere else in the future.                                     | **Incompatible with:** Other propagation tags and `:O`. <br>**Compatible with:** All access, SELinux, and `:U` tags.                                                             |

7.`quay.io/almalinuxorg/almalinux:latest`

It gives Podman the image to use. You can either use the repository name like this or the container ID of it. The container ID doesn't have to be full 52 chars. It just need to be long enough to distintively identify from other ID. For more info regarding about using container id, refer the [info](#info) admonition above.

8.`sleep infinity`

Usually containers stop right after the last proc inside it ends making it stop right after starting the container so `sleep infinity` makes it stay alive forever. You can also specify the time it should be kept alive after the last process end by replacing the infinity with a number that reflects the needed time it needs to stay alive in seconds (ie. `sleep 600` means stay alive for 600 sec or 6 min)

#### Start

Now the container's created. It can be started via podman

## Use

## Deleting a container

## Deleting a container image

```

```
