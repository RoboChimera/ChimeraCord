const { app, BrowserWindow, Tray, nativeImage, Menu, shell, globalShortcut} = require('electron');
const path = require('path');
const userAgent = "Mozilla/5.0 (X11; Linux x86_64; FreeBSD amd64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36";
let appQuiting = false;
let tray;

function createWindow () {
	Menu.setApplicationMenu(false)
	const win = new BrowserWindow({
		autoHideMenuBar: true,
		width: 1024,
		height: 600,
		minWidth: 940,
		minHeight: 540,
		icon: 'src/icon.png',
		title: "ChimeraCord",
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
		shell.openExternal(url);
	})
	
	const icon = nativeImage.createFromPath('src/tray-icon.png');
	tray = new Tray(icon);
	var contextMenu = Menu.buildFromTemplate([
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
	
	tray.setContextMenu(contextMenu);
	createWindow();
}

app.whenReady().then(() => {
    	globalShortcut.register('Ctrl+Q', () => {
		appQuiting = true;
	    	app.quit();
	})
	
	createWindow();
})
	
app.on('activate', () => {
	if (BrowserWindow.getAllWindows () .length === 0) {
		createWindow();
	}
})
