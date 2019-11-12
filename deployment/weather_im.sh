#!/bin/bash
# This script does what is necessary to copy relative bits out of this
# project and into the tree for the weather.im.
cd ..
echo "Building live.js via Google Closure"
sh build.sh

DEST="/opt/weather.im/html/live/"
LIVE="/opt/live/public_html/live/"

rsync -av $LIVE $DEST
