window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron');
const valid_url = require('valid-url');

$(document).ready(() => {

    $('#request-form').on('submit', (e) => {
        e.preventDefault();
        $('#request-form button').blur();
        let url = $('#url').val();
        if (valid_url.isUri(url) === undefined) {
            url = 'http://' + url;
        }
        ipcRenderer.send('request:content', url);
    });

    $('.yura-link').on('click', (e) => {
        ipcRenderer.send('yura:url');
    });

    ipcRenderer.on('http:body', (e, body, links, link_tags) => {
        $('.page-code').empty().append('<p>' + body + '</p>');
        $('.page-out').empty();

        let linksArea = $('.page-links');
        linksArea.empty();

        linksArea.append('<p class="link_tags">');

        link_tags.forEach(link_tag => {
            $('.link_tags').append(link_tag.replace(/</gm, '&lt;').replace(/>/gm, '&gt;') + '<br>');
        });

        linksArea.append('<br>');
        linksArea.append('<p class="links">');

        links.forEach(link => {
            $('.links').append(link + '<br>');
        });
    });

    ipcRenderer.on('request:result', (e, url, response, err) => {
        $('.page-out').append(
            '<p>' + url + '<br>' +
            response +
            (err ? '<br>' + err : '') +
            ' ' + '</p>');
        $('.img-link').last().on('click', (e) => {
            let img = new Image();
            img.src = e.target.innerHTML;
            img.onload = function () {
                ipcRenderer.send('image:view', e.target.innerHTML, this.width, this.height);
            };
            img.onerror = function () {
                alert("Error!");
            };
        });
    });
});
