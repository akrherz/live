#!/bin/bash
# This script does what is necessary to copy relative bits out of this
# project and into NWSChat's RCMS

NWSCHAT="/home/akrherz/projects/nwschat/public_html/live/"
LIVE="/home/akrherz/projects/live/public_html/live/"

rsync -av $LIVE $NWSCHAT
rm -f $NWSCHAT/.gitignore
