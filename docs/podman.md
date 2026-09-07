---
icon: simple/podman
---

# Podman

Containers under the control of Podman can either be run by root or by a non-privileged user. Podman manages the entire container ecosystem which includes pods, containers, container images, and container volumes using the libpod library.

## Managing a container

To manage a container we have to,

- Get / pull the container image
- Create a container
- Start / run the container
- Open a shell that can access the container from inside

??? abstract " The Shortest Way"

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

    This way is the shortest way to get a working container, but it lacks the customisation a container needs to do its job/s.

## Creating a container

Creating a container is primarily consist of three parts

- Search for the images across registries
- Get the appropriate container image to use
- Use it to create a container

### Images

#### Search in registries

To create a container, we need a container image which we can find in container registries.

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
