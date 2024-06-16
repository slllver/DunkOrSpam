let edge = require('edge-js')

module.exports = {
    getHandle,
    flashWindow
}

let flash = edge.func({
    assemblyFile: 'WindowUtils.dll',
    typeName: 'WindowUtils.Flash',
    methodName: 'Invoke'
});

let handle = edge.func({
    assemblyFile: 'WindowUtils.dll',
    typeName: 'WindowUtils.Handle',
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

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
