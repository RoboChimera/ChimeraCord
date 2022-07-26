#!/bin/sh
echo "ChimeraCord Installer" &&
echo "THIS REQUIRES ROOT!" &&
#pkg install electron19 www/npm node16 &&

echo "Copying Files..." &&
rm -rvf /usr/local/share/chimeracord &&
cp -rvf chimeracord /usr/local/share/chimeracord &&
cp -vf chimeracord.in /usr/local/bin/chimeracord && 
chmod +x /usr/local/bin/chimeracord &&
cp -vf chimeracord.desktop.in /usr/local/share/applications/chimeracord.desktop &&

echo "Installing NPM packages inside of /usr/local/share/chimeracord" &&
npm install -gf electron-context-menu
