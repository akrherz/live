#!/bin/bash
# This script does what is necessary to copy relative bits out of this
# project and into the tree for the weather.im service, we run this on iem12
cd ..
echo "Building live.js via Google Closure"
sh build.sh

DEST="/mesonet/www/apps/weather.im/html/live/"
LIVE="/mesonet/www/apps/live/public_html/live/"

rsync -av $LIVE $DEST
cd $DEST

MACHINES="iemvs100 iemvs101 iemvs102 iemvs103 iemvs104 iemvs105 iemvs106 iemvs107 iemvs108 iemvs109"
for MACH in $MACHINES
do
rsync -av --delete . ${MACH}:`pwd`
done