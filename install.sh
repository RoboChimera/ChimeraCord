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

echo "Installing NPM packages inside of /usr/local/share/chimeracord" &&
cd /usr/local/share/chimeracord &&
npm install -gf electron-context-menu --save-dev &&
rm -rf /usr/local/share/chimeracord/nodes_modules/electron &&
if [ -f /usr/sbin/pkg ];  then
	echo "FreeBSD package manager detected, dependencies will automatically install :)" &&
	pkg install electron19 www/npm node16
fi
