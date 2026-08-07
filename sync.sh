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

ssh "$HOST" 'mkdir -p "$HOME/.local/bin"'
rsync -vp electron/dist/hhd-ui.AppImage "$HOST:.local/bin/hhd-ui"

ssh -t "$HOST" 'sudo systemctl restart hhd'
