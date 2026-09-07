---
icon: simple/podman
---

# Working with Podman

Containers under the control of Podman can either be run by root or by a non-privileged user. Podman manages the entire container ecosystem which includes pods, containers, container images, and container volumes using the libpod library.

## Managing a container

To manage a container we have to,

- Get / pull the container image
- Create a container
- Start / run the container
- Open a shell that can access the container from inside

??? danger " The Shortest Way"

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

    This way is the fastest way to get a working container, but it lacks the customisation a container needs to do its job/s. The optimal way is to understand,
    1. Understand container images
    2. Use it to create containers

    It will be detailedly explained below

## Creating a container

Creating a container is primarily consist of three parts

- Search for the images across registries
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

You can also specify which registry to use

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

After the search is completed, now we should be left with url/s we can use it to get the container image to local storage.

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

#### Search on disk

To search the images present locally we can either use `podman images` or `podman image ls` as both returns the same results.

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

We will learn more about images, how we build, and related things later.

### Create and Start

As you know, containers' image layer is immutable after creation. It is mandatory to configure while creating the container by adding tags to the command itself.

```
podman create \
  --name container_name \
  --hostname container_hostname \
  --userns=keep-id \
  -p 8080:8080 \
  -v $HOME:$HOME:Z \
  quay.io/almalinuxorg/almalinux:latest \
  sleep-infinity
```

```{ .yaml .no-copy }
2b76e73ae5366148493c841e0980b41fa53c4e28710d581dcb56d8c19d764055
```

The random numerical string that comes as output is a hex hash you can use to access the container instead of using the container name (aka container id).
The hex hash is based on the combination of random data, timestamp, and host info, so the hash is almost always unique to one another.

??? info

    To access the container, You dont need to use the whole hash / container id of it of it but, you do need to use the hash in a length in which the the hash can be idenified distinctly from others. The hash we are using must start from the first character and can go all the way upto all 52 chars depending on the precision needed.


    In a hash ```6cd72d2433f3fc2795adc3f288de773500ff80113fd05ff40a7bf38e8d533b2b``` You can use `6c`, `6cd72d2433f3fc279`, or `6cd72d2433f3fc2795a` as long as there's no other hashes starting with the same chars. In those areas we have to make the hash long enough (as mentioned above) .

    you cant use `f07` if two or more hashes start with `f07`.

    !!! example "For example"

          If there're three hashes as <br>
            - `27abf265efc3d94996f8ada17abcd742fcab95a3f59fc67897cd5ea18725fcf5` <br>
            - `27af40ca73ec600cc7cc0a7d80c68f178bff2ccdbc34e5f11b7db86d28cf5601` <br>
            - `27af4001d44e3774f7c5715f59a5ee76c47829c565b9bc273671d8ee012d206c` <br>

           You'd have to atleast use the hash like 27af400 as the hash isn't presented in more than one hash. Most of the times, using first few chars to a 12 is enough.

The above create command creates a writable container layer over the specified image and prepares it for running the specified command. The container ID is then printed to STDOUT (Usually the output in the terminal unless used in programs for different purposes). This is similar to podman run -d except the container is never started. You can then use the podman start container command to start the container at any point.

The slashes (`\`) in the command solelu used for writing commands in a smaller width.

The command Argument/s and the reason to use it.

| Arg/s                                   | Reason                                                   |
| --------------------------------------- | -------------------------------------------------------- |
| `podman create`                         | It prepares to create a container                        |
| `--name container_name`                 | It gives the container the name "container_name"         |
| `--hostname container_hostname`         | It gives the container the hostname "container_hostname" |
| `--userns=keep-id  `                    |
| `-p 8080:8080   `                       |
| `-v $HOME:$HOME:Z`                      |                                                          |
| `quay.io/almalinuxorg/almalinux:latest` |
| `sleep-infinity`                        |

### Work from inside

## Deleting a container

## Deleting a container image

```

```
