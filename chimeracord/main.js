const { app, BrowserWindow, Tray, nativeImage, Menu, shell, globalShortcut, remote} = require('electron');
const contextMenu = require('electron-context-menu');
const Store = require('electron-store');

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

let appQuiting = false;
let tray;
let win;

function createWindow () {
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
			}
		})

		appQuiting = false;
		win.webContents.setUserAgent(userAgent);
		win.loadURL('https://discord.com/app');
    		
		win.webContents.executeJavaScript(
		`
			/*Theming Support :D*/
			var styles = 
			\`
			/* Custom CSS Starts Here! */
			\`
			
				var styleSheet = document.createElement("style")
				styleSheet.innerText = styles
				document.head.appendChild(styleSheet)
				
				/* Custom JS Starts Here! */
		`
		)
		
		win.on('close', e => {
			if(appQuiting === false) {
				e.preventDefault();
				win.hide();
			} else {
				app.quit();
			}
		})
		
		win.webContents.on("new-window", function(event, url) {
			event.preventDefault();
			if(url != "https://discord.com/*") {
				shell.openExternal(url);
			} else {
				win.load(url);
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
				label: "Quit ChimeraCord (CTRL-Q)",
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
							if (isDarkMode == true) {
								icon = nativeImage.createFromPath('src/tray-icon2.png');
								store.set('isDarkMode', false);
							} else {
								icon = nativeImage.createFromPath('src/tray-icon.png');
								store.set('isDarkMode', true);
							}
							tray = Tray(icon);
							tray.setContextMenu(trayMenu);
						}
					}]
			}
		]);
		if (store.get('isDarkMode') == true) {
			icon = nativeImage.createFromPath('src/tray-icon.png');
			appMenu.items[1].submenu.items[0].checked = true;
		} else {
			icon = nativeImage.createFromPath('src/tray-icon2.png');
			appMenu.items[1].submenu.items[0].checked = false;
		}
		console.log('User changed Dark Mode to: ', store.get('isDarkMode'));
		tray = Tray(icon);
		tray.setContextMenu(trayMenu);
		Menu.setApplicationMenu(appMenu);
	}
}

app.enableSandbox();
app.whenReady().then(() => {
	createWindow();
})
	
app.on('activate', () => {
	if (BrowserWindow.getAllWindows () .length === 0) {
		createWindow();
	}
})
