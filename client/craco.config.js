const path = require('path')
// ignore image folder when hot reloading app in dev
module.exports = {
    devServer: {
        watchOptions: {
            ignored: [
                path.resolve(__dirname, 'public/images') // image folder path 
            ]
        }
    }
};