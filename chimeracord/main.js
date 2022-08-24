const { app, BrowserWindow, Tray, nativeImage, Menu, shell, globalShortcut, remote, ipcRenderer, ipcMain, desktopCapturer} = require('electron');
const contextMenu = require('electron-context-menu');
const Store = require('electron-store');
const theming = require('./src/modules/theming.js');

let tray;
let trayMenu;
let icon;
let win;
let webSecurity = true;

contextMenu({ 
	showCopyImageAddress: true, 
	showSaveImageAs: true,
       	showInspectElement: false,
 	showCopyImage: false
})

const storage = {
	isDarkMode: {
		type: 'boolean',
		default: 'false'
	}
}

const store = new Store(storage);
const path = require('path');
const userAgent = "Mozilla/5.0 (X11; Linux x86_64; FreeBSD amd64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36";
const singleInstanceLock = app.requestSingleInstanceLock();

function loadPage(url) {
	theming.initTheming(win);
	win.loadURL(url);
}

function initWindow() {
	appQuiting = false;
	win.webContents.setUserAgent(userAgent);
	loadPage('https://discord.com/app');
	
	//win.webContents.openDevTools();
	win.on('close', event => {
		if(!appQuiting) {
			event.preventDefault();
			win.hide();
		} else {
			app.quit();
		}
	})

	win.webContents.on("new-window", function(event, url) {
		if(url.startsWith("file:")) {
			webSecurity = false;
		} else { 
			event.preventDefault();

			if(!url.startsWith("https://discord.com/")) {
				shell.openExternal(url);
			} else {
				return;
			}
		}
	})

	var trayMenu = Menu.buildFromTemplate([
		{
			label: "Open ChimeraCord", 
			click() { 
				appQuiting = false;
				win.show();
			}
		},
		{
			label: "Quit ChimeraCord",
			click() {
				appQuiting = true;
				app.quit();
			}
		}
	])

	var appMenu = Menu.buildFromTemplate([
		{
			label: 'Application',
			submenu: [
				{
					label: 'Quit',
					click: function() {
						appQuiting = true;
						app.quit();
					},
					accelerator: 'Ctrl+Q'
				}]
		},
		{
			label: 'Settings',
			submenu: [
				{
					label: 'Dark Mode',
					type: 'checkbox',
					click: function() {
						tray.destroy();
						store.set('isDarkMode', !store.get('isDarkMode'));
						theming.darkMode(store.get('isDarkMode'), win);

						if (store.get('isDarkMode')) {
							appMenu.items[1].submenu.items[0].checked = true;
							icon = nativeImage.createFromPath('src/tray-icon.png')
						} else {
							appMenu.items[1].submenu.items[0].checked = false;
							icon = nativeImage.createFromPath('src/tray-icon2.png')
						}

						tray = Tray(icon);
						tray.setContextMenu(trayMenu);
					}
				}
			]
		}
	]);

	if (store.get('isDarkMode')) {
		appMenu.items[1].submenu.items[0].checked = true;
		icon = nativeImage.createFromPath('src/tray-icon.png')
	} else {
		appMenu.items[1].submenu.items[0].checked = false;
		icon = nativeImage.createFromPath('src/tray-icon2.png')
	}

	theming.darkMode(store.get('isDarkMode'), win);
	tray = Tray(icon);
	tray.setContextMenu(trayMenu);
	Menu.setApplicationMenu(appMenu);

}

async function createWindow() {
	if(!singleInstanceLock) {
		appQuiting = true;
		app.quit();
		
	} else {
		app.on('second-instance', (event, commandLine, workingDirectory) => {
			if (win) {
				win.show();
			}
		})
		
		win = new BrowserWindow({
			autoHideMenuBar: true,
			width: 1024,
			height: 600,
			minWidth: 940,
			minHeight: 540,
			backgroundColor: '#202225',
			icon: 'src/icon.png',
			title: "ChimeraCord",
			defaultFontFamily: 'sansSerif',
			webPrefrences: {
				contextIsolation: true, 
				nodeIntegration: true,
				webSecurity: webSecurity,
				enableRemoteModule: true
			}
		})

		initWindow();

	}
}

app.on("ready", createWindow);
app.on("activate", createWindow)
