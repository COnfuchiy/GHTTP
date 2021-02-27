const {HTMLTagsParser} = require("./src/HTMLTagsParser");
const {MainWindow} = require("./src/MainWindow");
const {ViewImageWindow} = require('./src/ViewImageWindow')
const {app, ipcMain, dialog} = require('electron');
const open = require('open');


let win;

app.on('ready', () => {
    win = new MainWindow({
        width: 1366,
        height: 768,
        icon: __dirname + "/public/img/icon.png",
        slashes: true,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegrationInWorker: true,
            nodeIntegration: true
        }
    });
});


ipcMain.on('request:content', (e, url) => {
    let htmlParser = new HTMLTagsParser(url, win);
    if (htmlParser.checkUrl()) {
        htmlParser.parseTags();
    } else {
        dialog.showMessageBoxSync({
            type: 'error',
            buttons: ['Ok'],
            defaultId: 0,
            title: 'Request error',
            message: 'Invalid URL',
            detail: 'Did you write URL correctly?',
            noLink: true
        });
    }
});

ipcMain.on('image:view', (e, url, width, height) => {
    let imageWin = new ViewImageWindow({
        width: width + 70,
        height: height + 50,
        icon: __dirname + "/public/img/icon.png",
        slashes: true,
        webPreferences: {
            nodeIntegrationInWorker: true,
            nodeIntegration: true
        }
    }, url);
});
ipcMain.on('yura:url', (e) => {
    (async () => {
        await open('https://github.com/Lethme/gennadichHTTP');
    })();
});
app.on('window-all-closed', () => {
    app.quit();
});
