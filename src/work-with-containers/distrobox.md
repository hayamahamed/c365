---
icon: lucide/scan-box
---

# Distrobox

_Upon completion, you will have a project that reflects you can work with containers._

## Understanding Distrobox

A container that tightly integrates with the host os, allowing sharing of the HOME directory of the user, external storage, external USB devices and graphical apps (X11/Wayland), audio, and all ports in a way that the host and the container becomes indistuinguishable from each other.

## Goal

- Build a rootless Distrobox using an AlmaLinux image.
- Wrap it in a shell script that can be reproducible in any rpm based distro.
- Experiment with both rpm and deb containers from a RHEL and a Debian images respectively.
- Package it for rpm.

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

### Choosing the right image

Distroboxes need to run as if it is the host therefor, it needs to access system services. A special image type, init image, is required. The Init Image extends the base image, designed to run an init system as PID 1 for running multi-services inside a container.

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
q̴̜̫̣̻̄̊̈́͐͒̍̇͂̚̕͜u̵̧̡͈̹̞̥͉̪̦͖͕͙͇͑̏̅̀̂͜͝ͅä̸̺͍́̓̉͒̅̊̓̃̅̎́͒̂͜ͅý̶̧̖̰̪͖͛̂̀ņ̶̧̦̪͍̲̭̏̓̄̿̊̽͐͛͑̿̋͝/̵̨̧̠̞̭͕̇h̷̨̖̘͇͔̜̭̣̱͈̩͚͚͍̯̊̀̔͗̈̍̈́̀̀͌̊̚̕̕ę̶̛̤͖̙̠̫̜̻̭̟̘̫͐̿̑̈́̈́̃̋͗͋̃l̴̫̫̊͂̍͌̓̽͛͊͌̅̋̊l̸̡̲̜̗͙̊͊̇̃̒͛̓̇̍̾͛̋͊̑͘ͅő̶̡̨̢̢̯͍̭̥͇͙͔̞̃̊̀͒̋̌͌̃̚͜ņ̶̧̦̪͍̲̭̏̓̄̿̊̽͐͛͑̿̋͝/̵̨̧̠̞̭͕̇h̷̨̖̘͇͔̜̭̣̱͈̩͚͚͍̯̊̀̔͗̈̍̈́̀̀͌̊̚̕̕ę̶̛̤͖̙̠̫̜̻̭̟̘̫͐̿̑̈́̈́̃̋͗͋̃l̴̫̫̊͂̍͌̓̽͛͊͌̅̋̊l̸̡̲̜̗͙̊͊̇̃̒͛̓̇̍̾͛̋͊̑͘ͅő̶̡̨̢̢̯͍̭̥͇͙͔̞̃̊̀͒̋̌͌̃̚͜.̶̠̻̟͕̟͖̘͔̟͙͈̔̏̋̈́̈̾̉̃̈́ȋ̵̧̩͎͍̱̳̮̲̠͓̲̘̻̆̐͐̓̾͜͜͝͠o̷̦̳͓̬͋̏́́̀̔̕͘͠/̵̛̛͓͉̟̱̻͓̯͙̫͖͙̖̄̋̋͘p̴̨̮͔̻̹͚̝̙̋o̷̻̬̥̹̗͎̳͈̳͓͔̬͈͋̓̍̇͐̈̈́̓̏̅̏́̚̚ͅḍ̸̗̥̩̆̓́͝m̸̢̳̳̳̘͈̩̻̱̎͌́̔ä̴̩̩̺̳̲̯̓͒͐ņ̶̧̦̪͍̲̭̏̓̄̿̊̽͐͛͑̿̋͝/̵̨̧̠̞̭͕̇h̷̨̖̘͇͔̜̭̣̱͈̩͚͚͍̯̊̀̔͗̈̍̈́̀̀͌̊̚̕̕ę̶̛̤͖̙̠̫̜̻̭̟̘̫͐̿̑̈́̈́̃̋͗͋̃l̴̫̫̊͂̍͌̓̽͛͊͌̅̋̊l̸̡̲̜̗͙̊͊̇̃̒͛̓̇̍̾͛̋͊̑͘ͅő̶̡̨̢̢̯͍̭̥͇͙͔̞̃̊̀͒̋̌͌̃̚͜ ̵̧̪̮͉͕̳̞̼̣͛ ̶̟̻̟̻̞̬͈̘͚̣̃̽̓̋̓̒͑̅͘̕͘ ̶̨͙̳͎̭͈̀̔̈̂ ̸̛͕̒̏̿̆̈́̈́͂̉͘͘ ̴̢̰̮̖̻̤̭̭͕̺̦͍͙̏̅̉̽̿̑̆̌͘̕͜͠͝ ̴̢̤̠͈͕̺̠̮̱̀͐̀͗̃̓́̓̒̚̕͘ ̷̥͖͖̯̻̝̝̝̥̲̟͕̫́͋̐͊̿ ̸̧͚̙͖̪̪͕̀ͅͅ ̴̡̛̪̝͓̮̦̳̰͈͓̭̮̹̈̽̃̈́̓̈̑͘ ̶̗͇̝̥̻̻͓̤̯͐͒̈́̆̀̎̓͊̕͝͝ͅͅ ̶̡̳̠̠̯̦̗͚̯͍̻̤̹̐̎͛͜ͅ ̸̝̪̫̻͌́̉̉̿̈̈́̈́͝͠ĺ̵̨͙̘̖̯̮͉̥̱͍̻̞͆̆͌́̃̍͛͐͂̂͂́͜ą̸̣͈̮̯̻̲̼̯̠̟̜̱̞̺̓͋͒̿̓̄͠͝ţ̷̝͓̱̟̳̬̠͇͕̹͗̒̓͋̽̐̕̚͝ͅe̶̺̹͔̟̾ͅs̷̨̢̘̜̭̜̤̱̣̬͈̦̘̓͋̓̎͛̿t̷̢̬̭̙̦̹̖̙̅̀́͌͌̽̄͐̇͑͛͌͘͜͜ ̷̡̧͓̝̜͚̼̪̘̂̿̎̊͝ͅ ̶̨͔͉͈̝̮̭̭̥̳̭̬̠̲͛͆̊̓̒͜ ̵͖̟̃̀́̌͋̎̀̌͑̔̀͐ ̷̡̧̺̯͙̖̥̫̬̳̒͛͋̇͐̈́͘͜͝ ̴̤̳̜͂̇̀̔̈́͠͝͝ ̵̼̙̝͕͕̉̄̑̎͆̄̕̚͝5̶̫͉̼͉͉̠̫̋͒̀̓͌d̷͖̰͔̈́̾̿̎̿̋͑̇̋̍͐̍́̾͐d̸̩͙̭̗̩̞̯͔̰̖̻̘̱͉̄̄̏̐̂̍̾̽̈̓̅̄̀͐͝4̵̧̛̞̦͉̯̲͇͕̩̉͆̑̅̑̾͊̓͐͜6̵̨̨̺̺̟̪̣̦͓͇̮̲͓͓̙̉̏́͠7̶̢̨̹̲̜̼̘͚̪̻̙̩̓̿́̏̒̎͝͠͠͝f̸̛̮̦͚͍̑̈́͑̓͛͝c̴̫̘̣̹̈́͐̈́̑̎e̷̢̠̰̯̲̱̙̱̒̈́͜5̶̩̬̹͍̱̰̘͓̘́̚0̶̻̗̘̬̜̬̜̯̟͈̩͎̇͑̾͒̈́͊̈́̅̄̚͠b̸̤̫͙̫͈́͒͊͒̕͘͘͜͝ ̸̲̦̪̗̺͖͈̝̪̞͎́̐̀͒͠ ̵̭̰͍̪̪̇͛̽͋̊2̴̝̙̞̺̱̓̈́͂̒̽̔̓́̀ ̴̘͈͉͙͕̌͂͠y̷̭̜̬͕͖̲͗̔̀̂ͅe̴͖͙̪̭̼͎̝͕͇̖̭̟̭̔͐̈́̽̈́͛̉̆a̴̤̹̣͙͖̠̺͔̻̗̋̈́̿̔͋̾͒̊̀̄̇͊̿ͅŗ̵̡̖͚̦̹͔͖̗̼̻̈̕͜ş̴͓̳͕͕͙̊̽͐̍̇ ̸̡̛̛͚͕̠̪̬͍̞̰͉̽̎̿̑̈̑͆̃̑̐͝ȁ̷̘͇͇̰̦̬͔̯̪̉̈́̄̽̈́͒̀̀̀̈͜͠͝g̶̱̮͈̞̝̘̱̊͐́̀̾̍̄̃̕̚͝o̸̞̘̹͗̌͂̈́ ̷̰̭͙̠̤̤̫̜͌͆͐̌͒̋̑̚͝ ̷̡̢͙̫̞̻̺͙͓̟͓̻̓̑̑͋̓͊̈́̈̇͘̚̚͠ͅ1̶̬̼̗͎̇͆̅͛̇̃̈̋̃͋̿̚͝ͅ.̷̢̫̯̯̎͗̽̄͑̎̌͊̏̃5̵̥̗̩̤̬̰̓̿̉͗̃̈͆̉̚7̷̧̬̥̼͔̯͙̩̫̲̞͕̿̇͊́̾͊̉̾̓̒ ̴͔͓̱̼̲͉̗̻͉̐̽͆͋́́̏̆͜Ḿ̴̨̖͇̞̤̭͔̜̳͉̘̘̂̍͘͘͝B̵̢̛̻̹̜͈̞̠͉̹͔̯̈̑̍͛̽̊̏̚͝͝ņ̴̱̞͕͎̝̞̺͔͎̙̫̤̊͛͘͝u̸͍̻̳̰͉̳͕͚͕͍̲͎̘̔̀̄̊͋̂̄̔̓͗̚͜͜͠x̵͖͇͐̍͛̀ ̴̢̅͑́͋̎̌͗́̑͛ ̶̮̝̲̘̗͂̄́͂͆̌̆͒̓͂͌̑̔̿͜͝l̵̡̨̡̝͉̣̝̹̝̞̳̱̤̱͆͠a̴̦̹̦̻̱͈̝͚̙̰̓̆̀̊͑̀̐͋͌̚̚͝t̷̡̛͙̰͖̖͉̺̗̦̳̟̬̠̽̃͐̈̄́͆̌́̑͋͘͝ë̶͎̘̟̲͍͕͍́š̴̟̩͓̤̜̯̖̍̾̓̍̉̾̔́͘͘t̷̞̖̬̱̯̣̜̪̭̬͎̔̇̾͊̈́̄͂̏͝ ̵̗̮͓̙̙͉̗̼̀̀͜ ̷̀̈́̔̂́̍́͒̚͝͠d̸̨̠̮͕̭̭͇̘͆ͅȩ̵̩̙͙͓͖̣̝͓̜͎͆̈́̑́̀̓̏͗̑̊́͝͝2̵̘̝̮͎̠̍̀̓̎̀̃̈́̾f̷̨͙̱͕̪̝̘͙͚̥͖͐͋̈́͠7̸̲͖̟͙͙̍ͅb̴͖̀̓͆̏̌̒̌͐8̷̢̛̺̻̭͕̦͔̣͍̘̹̝͓̽̈́̊̑̏̄̏̕͘̚͜6̶̞̹̮̻̼̳̦̱͖͗̊̌̏͜͝7̵̞͉͔̯̰̺̹͖̯͋͂̎̏̅̀̋̿̇̑̑̍̚͠
docker.io/almalinux/10-init     latest      defe64aa76a6  9 days ago   198 MB
q̴̜̫̣̻̄̊̈́͐͒̍̇͂̚̕͜u̵̧̡͈̹̞̥͉̪̦͖͕͙͇͑̏̅̀̂͜͝ͅä̸̺͍́̓̉͒̅̊̓̃̅̎́͒̂͜ͅý̶̧̖̰̪͖͛̂̀ņ̶̧̦̪͍̲̭̏̓̄̿̊̽͐͛͑̿̋͝/̵̨̧̠̞̭͕̇h̷̨̖̘͇͔̜̭̣̱͈̩͚͚͍̯̊̀̔͗̈̍̈́̀̀͌̊̚̕̕ę̶̛̤͖̙̠̫̜̻̭̟̘̫͐̿̑̈́̈́̃̋͗͋̃l̴̫̫̊͂̍͌̓̽͛͊͌̅̋̊l̸̡̲̜̗͙̊͊̇̃̒͛̓̇̍̾͛̋͊̑͘ͅő̶̡̨̢̢̯͍̭̥͇͙͔̞̃̊̀͒̋̌͌̃̚͜ņ̶̧̦̪͍̲̭̏̓̄̿̊̽͐͛͑̿̋͝/̵̨̧̠̞̭͕̇h̷̨̖̘͇͔̜̭̣̱͈̩͚͚͍̯̊̀̔͗̈̍̈́̀̀͌̊̚̕̕ę̶̛̤͖̙̠̫̜̻̭̟̘̫͐̿̑̈́̈́̃̋͗͋̃l̴̫̫̊͂̍͌̓̽͛͊͌̅̋̊l̸̡̲̜̗͙̊͊̇̃̒͛̓̇̍̾͛̋͊̑͘ͅő̶̡̨̢̢̯͍̭̥͇͙͔̞̃̊̀͒̋̌͌̃̚͜.̶̠̻̟͕̟͖̘͔̟͙͈̔̏̋̈́̈̾̉̃̈́ȋ̵̧̩͎͍̱̳̮̲̠͓̲̘̻̆̐͐̓̾͜͜͝͠o̷̦̳͓̬͋̏́́̀̔̕͘͠/̵̛̛͓͉̟̱̻͓̯͙̫͖͙̖̄̋̋͘p̴̨̮͔̻̹͚̝̙̋o̷̻̬̥̹̗͎̳͈̳͓͔̬͈͋̓̍̇͐̈̈́̓̏̅̏́̚̚ͅḍ̸̗̥̩̆̓́͝m̸̢̳̳̳̘͈̩̻̱̎͌́̔ä̴̩̩̺̳̲̯̓͒͐ņ̶̧̦̪͍̲̭̏̓̄̿̊̽͐͛͑̿̋͝/̵̨̧̠̞̭͕̇h̷̨̖̘͇͔̜̭̣̱͈̩͚͚͍̯̊̀̔͗̈̍̈́̀̀͌̊̚̕̕ę̶̛̤͖̙̠̫̜̻̭̟̘̫͐̿̑̈́̈́̃̋͗͋̃l̴̫̫̊͂̍͌̓̽͛͊͌̅̋̊l̸̡̲̜̗͙̊͊̇̃̒͛̓̇̍̾͛̋͊̑͘ͅő̶̡̨̢̢̯͍̭̥͇͙͔̞̃̊̀͒̋̌͌̃̚͜ ̵̧̪̮͉͕̳̞̼̣͛ ̶̟̻̟̻̞̬͈̘͚̣̃̽̓̋̓̒͑̅͘̕͘ ̶̨͙̳͎̭͈̀̔̈̂ ̸̛͕̒̏̿̆̈́̈́͂̉͘͘ ̴̢̰̮̖̻̤̭̭͕̺̦͍͙̏̅̉̽̿̑̆̌͘̕͜͠͝ ̴̢̤̠͈͕̺̠̮̱̀͐̀͗̃̓́̓̒̚̕͘ ̷̥͖͖̯̻̝̝̝̥̲̟͕̫́͋̐͊̿ ̸̧͚̙͖̪̪͕̀ͅͅ ̴̡̛̪̝͓̮̦̳̰͈͓̭̮̹̈̽̃̈́̓̈̑͘ ̶̗͇̝̥̻̻͓̤̯͐͒̈́̆̀̎̓͊̕͝͝ͅͅ ̶̡̳̠̠̯̦̗͚̯͍̻̤̹̐̎͛͜ͅ ̸̝̪̫̻͌́̉̉̿̈̈́̈́͝͠ĺ̵̨͙̘̖̯̮͉̥̱͍̻̞͆̆͌́̃̍͛͐͂̂͂́͜ą̸̣͈̮̯̻̲̼̯̠̟̜̱̞̺̓͋͒̿̓̄͠͝ţ̷̝͓̱̟̳̬̠͇͕̹͗̒̓͋̽̐̕̚͝ͅe̶̺̹͔̟̾ͅs̷̨̢̘̜̭̜̤̱̣̬͈̦̘̓͋̓̎͛̿t̷̢̬̭̙̦̹̖̙̅̀́͌͌̽̄͐̇͑͛͌͘͜͜ ̷̡̧͓̝̜͚̼̪̘̂̿̎̊͝ͅ ̶̨͔͉͈̝̮̭̭̥̳̭̬̠̲͛͆̊̓̒͜ ̵͖̟̃̀́̌͋̎̀̌͑̔̀͐ ̷̡̧̺̯͙̖̥̫̬̳̒͛͋̇͐̈́͘͜͝ ̴̤̳̜͂̇̀̔̈́͠͝͝ ̵̼̙̝͕͕̉̄̑̎͆̄̕̚͝5̶̫͉̼͉͉̠̫̋͒̀̓͌d̷͖̰͔̈́̾̿̎̿̋͑̇̋̍͐̍́̾͐d̸̩͙̭̗̩̞̯͔̰̖̻̘̱͉̄̄̏̐̂̍̾̽̈̓̅̄̀͐͝4̵̧̛̞̦͉̯̲͇͕̩̉͆̑̅̑̾͊̓͐͜6̵̨̨̺̺̟̪̣̦͓͇̮̲͓͓̙̉̏́͠7̶̢̨̹̲̜̼̘͚̪̻̙̩̓̿́̏̒̎͝͠͠͝f̸̛̮̦͚͍̑̈́͑̓͛͝c̴̫̘̣̹̈́͐̈́̑̎e̷̢̠̰̯̲̱̙̱̒̈́͜5̶̩̬̹͍̱̰̘͓̘́̚0̶̻̗̘̬̜̬̜̯̟͈̩͎̇͑̾͒̈́͊̈́̅̄̚͠b̸̤̫͙̫͈́͒͊͒̕͘͘͜͝ ̸̲̦̪̗̺͖͈̝̪̞͎́̐̀͒͠ ̵̭̰͍̪̪̇͛̽͋̊2̴̝̙̞̺̱̓̈́͂̒̽̔̓́̀ ̴̘͈͉͙͕̌͂͠y̷̭̜̬͕͖̲͗̔̀̂ͅe̴͖͙̪̭̼͎̝͕͇̖̭̟̭̔͐̈́̽̈́͛̉̆a̴̤̹̣͙͖̠̺͔̻̗̋̈́̿̔͋̾͒̊̀̄̇͊̿ͅŗ̵̡̖͚̦̹͔͖̗̼̻̈̕͜ş̴͓̳͕͕͙̊̽͐̍̇ ̸̡̛̛͚͕̠̪̬͍̞̰͉̽̎̿̑̈̑͆̃̑̐͝ȁ̷̘͇͇̰̦̬͔̯̪̉̈́̄̽̈́͒̀̀̀̈͜͠͝g̶̱̮͈̞̝̘̱̊͐́̀̾̍̄̃̕̚͝o̸̞̘̹͗̌͂̈́ ̷̰̭͙̠̤̤̫̜͌͆͐̌͒̋̑̚͝ ̷̡̢͙̫̞̻̺͙͓̟͓̻̓̑̑͋̓͊̈́̈̇͘̚̚͠ͅ1̶̬̼̗͎̇͆̅͛̇̃̈̋̃͋̿̚͝ͅ.̷̢̫̯̯̎͗̽̄͑̎̌͊̏̃5̵̥̗̩̤̬̰̓̿̉͗̃̈͆̉̚7̷̧̬̥̼͔̯͙̩̫̲̞͕̿̇͊́̾͊̉̾̓̒ ̴͔͓̱̼̲͉̗̻͉̐̽͆͋́́̏̆͜Ḿ̴̨̖͇̞̤̭͔̜̳͉̘̘̂̍͘͘͝B̵̢̛̻̹̜͈̞̠͉̹͔̯̈̑̍͛̽̊̏̚͝͝ņ̴̱̞͕͎̝̞̺͔͎̙̫̤̊͛͘͝u̸͍̻̳̰͉̳͕͚͕͍̲͎̘̔̀̄̊͋̂̄̔̓͗̚͜͜͠x̵͖͇͐̍͛̀ ̴̢̅͑́͋̎̌͗́̑͛ ̶̮̝̲̘̗͂̄́͂͆̌̆͒̓͂͌̑̔̿͜͝l̵̡̨̡̝͉̣̝̹̝̞̳̱̤̱͆͠a̴̦̹̦̻̱͈̝͚̙̰̓̆̀̊͑̀̐͋͌̚̚͝t̷̡̛͙̰͖̖͉̺̗̦̳̟̬̠̽̃͐̈̄́͆̌́̑͋͘͝ë̶͎̘̟̲͍͕͍́š̴̟̩͓̤̜̯̖̍̾̓̍̉̾̔́͘͘t̷̞̖̬̱̯̣̜̪̭̬͎̔̇̾͊̈́̄͂̏͝ ̵̗̮͓̙̙͉̗̼̀̀͜ ̷̀̈́̔̂́̍́͒̚͝͠d̸̨̠̮͕̭̭͇̘͆ͅȩ̵̩̙͙͓͖̣̝͓̜͎͆̈́̑́̀̓̏͗̑̊́͝͝2̵̘̝̮͎̠̍̀̓̎̀̃̈́̾f̷̨͙̱͕̪̝̘͙͚̥͖͐͋̈́͠7̸̲͖̟͙͙̍ͅb̴͖̀̓͆̏̌̒̌͐8̷̢̛̺̻̭͕̦͔̣͍̘̹̝͓̽̈́̊̑̏̄̏̕͘̚͜6̶̞̹̮̻̼̳̦̱͖͗̊̌̏͜͝7̵̞͉͔̯̰̺̹͖̯͋͂̎̏̅̀̋̿̇̑̑̍̚͠
```

_Some lines a intentionally scrambled to highlight Alma Linux 10 Init image._

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

3. Volume

4. Network

5. Display

6. Devices

7. Finally add the container image and `sleep infinite` as the command

```
docker.io/almalinux/10-init \
sleep infinity
```
