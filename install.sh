#!/bin/sh
echo "ChimeraCord Installer" &&
echo "THIS REQUIRES ROOT!" &&

echo "Copying Files..." &&
rm -rvf /usr/local/share/chimeracord &&
cp -rvf chimeracord /usr/local/share/chimeracord &&
cp -vf chimeracord.in /usr/local/bin/chimeracord && 
chmod +x /usr/local/bin/chimeracord &&

if [ -f /usr/local/share/applications ]; then
	cp -vf chimeracord.desktop.in /usr/local/share/applications/chimeracord.desktop
fi

if [ -f /usr/sbin/pkg ];  then
	echo "FreeBSD package manager detected, dependencies will automatically install :)" &&
	pkg install electron22 www/npm
fi

echo "Installing NPM packages inside of /usr/local/share/chimeracord" &&
cd /usr/local/share/chimeracord &&
npm install -gf electron-context-menu electron-store --save-dev &&
ln -sFf /usr/local/lib/node_modules /usr/local/share/chimeracord/node_modules
