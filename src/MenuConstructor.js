class MenuConstructor {
    firstMenuItem = {
        label: 'File',
        submenu: [{
            label: 'Exit',
            accelerator: 'CmdOrCtrl+Q',
            click() {
                app.quit();
            }
        }]
    };
    secondMenuItem = {
        label: 'Developer Tools',
        submenu: [{
            label: 'Toggle DevTools',
            accelerator: 'CmdOrCtrl+I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }, {
            role: 'reload'
        }]
    };

    constructor() {

    }

    getMenuItems(){
        return [
            this.firstMenuItem,
            this.secondMenuItem
        ];
    }
}
module.exports= {
    MenuConstructor
};