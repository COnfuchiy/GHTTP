const {MenuConstructor} = require("./MenuConstructor");

const path = require('path');
const url = require('url');
const {app, BrowserWindow, Menu} = require('electron');

class MainWindow extends BrowserWindow {
    pageAsset = 'index.html';

    constructor(args) {
        super(args);
        this.createMenu((new MenuConstructor()).getMenuItems());
        this.loadURL(url.format({
            pathname: path.resolve(__dirname, '../public/', this.pageAsset),
            protocol: 'file:',
            slashes: true,
        }));
        this.on('closed', () => {
            app.quit();
        });
    }

    createMenu(menuItems) {
        let mainMenu = Menu.buildFromTemplate(menuItems);
        Menu.setApplicationMenu(mainMenu);
    }
}

module.exports = {
    MainWindow
};