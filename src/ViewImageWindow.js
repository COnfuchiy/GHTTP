const path = require('path');
const url = require('url');
const  {BrowserWindow} = require('electron');

class ViewImageWindow extends BrowserWindow {
    pageAsset = 'image.html';
    constructor(args, imageUrl) {
        super(args);
        this.loadURL(url.format({
            pathname: path.resolve(__dirname,'../public/',this.pageAsset),
            protocol: 'file:',
            slashes: true,
        }));
        this.webContents.on('dom-ready',()=>{
            this.webContents.send('image:window',imageUrl);
        })
        this.removeMenu();
    }
}
module.exports = {
    ViewImageWindow
};