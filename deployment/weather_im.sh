#!/bin/bash
# This script does what is necessary to copy relative bits out of this
# project and into the tree for the weather.im service

DEST="/mesonet/www/apps/weather.im/html/live/"
LIVE="/home/akrherz/projects/live/public_html/live/"

rsync -av $LIVE $DEST