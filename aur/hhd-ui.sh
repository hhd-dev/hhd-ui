#!/bin/sh
export ELECTRON_IS_DEV=0
cd /usr/lib/hhd-ui
# --no-sandbox is required for it to launch within steam
exec electron@electronversion@ --no-sandbox /usr/lib/hhd-ui/app.asar $@
