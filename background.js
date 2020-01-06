'use strict';

chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    fetch(request.input, request.init).then( (response) => {
        return response.text().then( (text) => {
            sendResponse([{
                body: text,
                status: response.status,
                statusText: response.statusText,
            }, null]);
        });
    }, (error) => {
        sendResponse([null, error]);
    });

    return true;
});