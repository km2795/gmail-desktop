const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 845,
    minHeight: 600,
    webPreferences: {
      devTools: true
    },
    show: false // Do not show the app until it has loaded completely.
  });

  // Remove the default menu bar.
  // win.setMenu(null);

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.on('close', (e) => win.destroy());
  win.on('closed', () => { win = null });
  win.once('ready-to-show', () => win.show());
}

app.on('ready', createWindow);
app.on('window-all-closed', () => process.platform !== 'darwin' ? app.quit() : {});
app.on('activate', () => (win === null) ? createWindow() : {});
