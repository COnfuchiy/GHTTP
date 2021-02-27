const request = require('request');
const {dialog} = require('electron');
const url = require('url');
const path = require('path');


class HTMLTagsParser {
    constructor(url, win) {
        this.url = url;
        this.win = win;
    }

    checkUrl() {
        return (new RegExp(/(https?|ftp):\/\/(-\.)?([^\s?.#-]+\.?)+(\/[^\s]*)?/gi)).test(this.url);
    }

    parseTags() {
        request({
            uri: this.url,
            method: 'GET',
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,
            strictSSL: false
        }, (error, response, body) => {
            if (error) {
                dialog.showMessageBoxSync({
                    type: 'error',
                    buttons: ['Ok'],
                    defaultId: 0,
                    title: 'Request error',
                    message: 'Bad request',
                    detail: 'Error with request',
                    noLink: true
                });
                return;
            }
            let images = [];
            let imagesTags = body.match(/<img[\s]+([^>]+)>/gmi);

            if (imagesTags !== null) {
                imagesTags.forEach(img => {
                    let imageParts = (new RegExp(/src=(["'])(.*?)\1/gi)).exec(img.toString());
                    let imageSrc = imageParts[2];
                    if (imageSrc.includes('.jpg') || imageSrc.includes('.gif')) {
                        const isUrlAbsolute = (link) => (link.indexOf('://') > 0 || link.indexOf('//') === 0);
                        if (isUrlAbsolute(imageSrc)) {
                            images.push(imageSrc.indexOf('//') === 0 ? (new URL(this.url)).protocol + imageSrc : imageSrc);
                        } else {
                            images.push(url.resolve(this.url, imageSrc));
                        }
                    }
                });
            }
            this.win.webContents.send(
                'http:body',
                body.replace(/</gm, '&lt;').replace(/>/gm, '&gt;'),
                images,
                imagesTags
            );
            this.getImages(images);

        });
    }

    getImages(imagesLinks) {
        let allImagesAndSizes = [];
        let numActiveImages = imagesLinks.length;

        function checkGreatestImage() {
            if (allImagesAndSizes.length) {
                let greatestImgObj = allImagesAndSizes[0];
                for (let imageObj of allImagesAndSizes) {
                    if (imageObj.size > greatestImgObj.size) {
                        greatestImgObj = imageObj;
                    }
                }
                dialog.showMessageBoxSync({
                    type: 'info',
                    buttons: ['Ok'],
                    defaultId: 0,
                    title: 'Image',
                    message: 'Largest image - ' + path.basename(new URL(greatestImgObj.url).pathname),
                    detail: 'Image size: ' + greatestImgObj.size + ' kb.',
                });
            } else {
                dialog.showMessageBoxSync({
                    type: 'info',
                    buttons: ['Ok'],
                    defaultId: 0,
                    title: 'Images',
                    message: 'No images!'
                });
            }
        }

        imagesLinks.forEach((link, index) => {
            request({
                    uri: link,
                    method: 'GET',
                    rejectUnauthorized: false,
                    requestCert: true,
                    agent: false,
                    strictSSL: false
                }, (error, response, body) => {
                    if (error) {
                        this.win.webContents.send(
                            'request:result',
                            'URL: <a class="img-link" href="#">' + link + '</a>',
                            'Error: ' + error.code
                        );
                        numActiveImages--;
                    } else {
                        let imgSize = parseInt(response.caseless.dict['content-length']);
                        this.win.webContents.send(
                            'request:result',
                            'URL: <a class="img-link" href="#">' + link + '</a>',
                            'Status:' + response.statusCode,
                            'Size:' + (response.statusCode === 200 ? imgSize : 0)
                        );
                        allImagesAndSizes.push({
                            url: link,
                            size: imgSize
                        });
                    }
                    if (allImagesAndSizes.length === numActiveImages) {
                        checkGreatestImage();
                    }
                }
            );
        });
    }
}

module.exports = {
    HTMLTagsParser
};