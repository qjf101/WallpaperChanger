const electron = require('electron')
const { app, BrowserWindow, Menu } = electron
const isDev = require("electron-is-dev")

const server = require('./server');

let mainWindow;

function createWindow () {

  mainWindow = new BrowserWindow({
    minWidth: 512,
    minHeight: 640,
    maxWidth: 512,
    maxHeight: 640,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(
    isDev ? "http:localhost:3000" : 'file://' + __dirname + '/client/build/index.html'
    )
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

Menu.setApplicationMenu(false);