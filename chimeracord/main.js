const { app, BrowserWindow, Tray, nativeImage, Menu, shell} = require('electron')
const path = require('path')
const userAgent = "Mozilla/5.0 (X11; Linux x86_64; FreeBSD amd64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36"
let WindowOpen = false
let tray

function createWindow () {
	Menu.setApplicationMenu(false)
	const win = new BrowserWindow({
		autoHideMenuBar: true,
		width: 1024,
		height: 600,
		minWidth: 800,
		minHeight: 480,
		icon: 'src/icon.png',
		title: "ChimeraCord",
		webPrefrences: {
			contextIsolation: true,
			nodeIntegration: true,
		}
	})
	WindowOpen = true
	win.webContents.setUserAgent(userAgent);
	win.loadURL('https://discord.com/app')
	
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
	`
	)
	
	win.webContents.on("new-window", function(event, url) {
		event.preventDefault();
		shell.openExternal(url);
	})
}

app.whenReady().then(() => {
	const icon = nativeImage.createFromPath('src/tray-icon.png')
	tray = new Tray(icon)
	const contextMenu = Menu.buildFromTemplate([
		{
		 label: "Open ChimeraCord", 
		 click() { 
				if(WindowOpen  === false) {
					createWindow(); 
				}
			    }
		},
		{
		label: "Quit ChimeraCord",
		click() {
				app.quit();
			    }
		}
	])

	tray.setContextMenu(contextMenu)
	createWindow()
})

app.on('window-all-closed', () => {
	WindowOpen = false
})
	
app.on('activate', () => {
	if (BrowserWindow.getAllWindows () .length === 0) {
		createWindow()
	}
})
