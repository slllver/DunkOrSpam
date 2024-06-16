let edge = require('edge-js')

module.exports = {
    getHandle,
    flashWindow
}

let flash = edge.func({
    assemblyFile: 'FlashWindow.dll',
    typeName: 'FlashWindow.Window',
    methodName: 'Invoke'
});

let handle = edge.func({
    assemblyFile: 'FlashWindow.dll',
    typeName: 'FlashWindow.Handle',
    methodName: 'Invoke'
});

function getHandle(windowName, _callback) {
    let hPayload = {
        windowName: windowName
    }

    handle(hPayload, (error, result) => {
        if (error) throw error;

        _callback(result);
    });
}

function flashWindow(handle, timeout, count) {
    let wPayload = {
        handle: handle,
        timeout: timeout,
        count: count
    }

    flash(wPayload, (error) => {
        if (error) throw error;
    });
}

let hwnd;

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

getHandle('DunkOrSpam', (res) => hwnd = res);
