#!/bin/sh

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <host>"
    exit 1
fi

HOST=$1

if [ ! -d node_modules ]; then
    npm install
fi
npm run electron-build

if [ ! -d electron/node_modules ]; then
    npm install --prefix electron
fi
npm run build --prefix electron
chmod +x electron/dist/hhd-ui.AppImage

rsync -vp electron/dist/hhd-ui.AppImage "$HOST:hhd-ui.AppImage"

ssh -t "$HOST" '
    set -e

    if rpm-ostree status --json | grep -q "\"unlocked\" *: *\"none\""; then
        sudo rpm-ostree usroverlay
    fi
    sudo install -m 755 -Z "$HOME/hhd-ui.AppImage" /usr/bin/hhd-ui
    rm -f "$HOME/hhd-ui.AppImage"
    sudo systemctl restart hhd
'
