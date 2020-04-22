/* cache4.js - v1.2.4 - 2020-01-28 - https://github.com/cityxdev/cache4.js */

$(function() {
    'use strict';

    function initJsLoader() {
        $("<style>").attr('type', 'text/css').html(
            '@keyframes spinloader {\n' +
            '    0% { transform: rotate(0deg); }\n' +
            '    100% { transform: rotate(360deg); }\n' +
            '}'
        ).appendTo($('head'));

        var _jsloader={};

        var color = '#000091';

        const _getLoaderElement = function(container,create) {
            let isBody = container===undefined || container===null;
            container = container ? ((typeof container)==='string'?$(container):container) : $('body');
            let loader = $(container.children('div.loader-container')[0]);
            if (create && loader.length === 0) {
                loader = $('<div class="loader-container"><div class="loader"></div></div>');
                container.prepend(loader);
            }

            if(loader.length===1) {
                if (!isBody) {
                    container.css('position', 'relative');
                    loader.css('position', 'absolute');
                    loader.css('top', '0');
                } else {
                    loader.css('position', 'fixed');
                }
                loader.css('display', 'none');
                loader.css('z-index', '10000');
                loader.css('background', 'rgba(255,255,255,0.5)');
                loader.css('height', '100%');
                loader.css('width', '100%');

                const innerLoader = $('div.loader', loader);
                innerLoader.css('margin', 'auto');
                innerLoader.css('top', 'calc(50% - 60px)');
                innerLoader.css('left', 'calc(50% - 60px)');
                innerLoader.css('position', 'absolute');
                innerLoader.css('border', '16px solid #FFFFFF');
                innerLoader.css('border-top', '16px solid '+color);
                innerLoader.css('border-radius', '50%');
                innerLoader.css('width', '120px');
                innerLoader.css('height', '120px');
                innerLoader.css('animation', 'spinloader 4s linear infinite');
            }

            return loader.length===1?loader:undefined;
        };

        _jsloader.setColor = function(newColor){
            if(newColor)
                color=newColor;
        };

        _jsloader.showLoader = function (immediatly,container) {
            let loader = _getLoaderElement(container,true);
            immediatly = immediatly===undefined||immediatly===null ? true : immediatly;
            if(!immediatly) {
                if (!loader.data('timeoutId'))
                    loader.data('timeoutId', []);
                let timeoutId = setTimeout(function () {
                    loader.show();
                }, 300);
                loader.data('timeoutId').push(timeoutId);
            } else loader.show();
        };

        _jsloader.hideLoader = function (container) {
            let loader = _getLoaderElement(container,false);
            if(loader) {
                loader.hide();
                let timeoutId = loader.data('timeoutId');
                if (timeoutId)
                    for (let t in timeoutId)
                        clearTimeout(timeoutId[t]);
                loader.data('timeoutId', []);
            }
        };

        return _jsloader;
    }

    if(typeof(window.jsloader) === 'undefined'){
        window.jsloader = initJsLoader();
    }
});
