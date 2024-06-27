<h1 align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hhd-dev/hhd/master/art/logo_dark.svg" width="50%">
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/hhd-dev/hhd/master/art/logo_light.svg" width="50%">
        <img alt="Handheld Daemon Logo." src="https://raw.githubusercontent.com/hhd-dev/hhd/master/art/logo_light.svg" width="50%">
    </picture>
</h1>

# Handheld Daemon UI

A UI app that can manage Handheld Daemon settings from Steam, the Desktop, and
the Web.

![Light Mode Picture](./res/app_light.png)
![Dark Mode Picture](./res/app_dark.png)

# Usage

There are three ways of accessing the app:

1. Go to https://hhd.dev to use the latest version via your browser.
2. Install the app locally to your device via a provided AppImage.
3. Use the version bundled for your distribution, see main Handheld Daemon README.

# From another device
While it is not a popular feature, Handheld Daemon can control your device remotely
if you change some settings.

You can connect to your device to configure it over the network if you know its
IP, by downloading the AppImage from releases.
First, you need to enable the port to be accessible from the network.
This is done by clicking the eye icon on the overlay, which will reveal
the API settings and allowing access from network.

The website https://hhd.dev can only be used from the device due to a security 
policy called Mixed Content Serving.
Essentially, https websites can not access http APIs, with the exception being
http://localhost.
This will be fixed in the future by making the calls using TLS over JavaScript.

For now, you can port forward port 5335 to your main computer over ssh if you
want to use it remotely with [hhd.dev](https://hhd.dev) or use the AppImage.
```bash
ssh <your-machine> -L 5335:localhost:5335
```

> [!IMPORTANT]  
> By default, the port the Handheld Daemon API uses is only accessible from your
> device and a security token is used.
>
> Handheld Daemon is a root-level daemon, be mindful of enabling network access
> to the API port!

# Dev Setup

Run the following commands:

```bash
# git clone repo

cd hhd-ui
npm ci
# To update requirements
# npm install

# run dev server, should be on localhost:5173
npm run dev
```

# License
The Handheld Daemon UI is licensed under THE GNU GPLv3+. See LICENSE for details.
Versions prior to and excluding 2.0.0 are licensed using MIT.