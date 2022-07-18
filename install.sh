#!/bin/sh
echo "ChimeraCord Installer" &&
echo "THIS REQUIRES ROOT!" &&
pkg install electron19 www/npm node16 &&
rm -rvf /usr/local/share/chimeracord &&
cp -rvf chimeracord /usr/local/share/chimeracord &&
rm -v /usr/local/bin/chimeracord &&
cp -vf chimeracord.in /usr/local/bin/chimeracord && 
chmod +x /usr/local/bin/chimeracord &&
rm -v /usr/local/share/applications/chimeracord.desktop &&
cp -vf chimeracord.desktop.in /usr/local/share/applications/chimeracord.desktop
