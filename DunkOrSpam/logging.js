// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"
//
// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
// FgGray = "\x1b[90m"
//
// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"
// BgGray = "\x1b[100m"

const { getScrollPos } = require('./window');
const { List, Item } = require('./linkedlist');

const list = new List();
const colorPattern = /\\x1b\[\d{1,3}m/g;

let hwnd;
let lastPos = 0;

module.exports = {
    init,
    log,
    warn,
    error
}

/**
 * Initializes the logger
 * This function performs the following actions:
 * - Archive latest log file
 * - Create empty latest.txt
 * - Clear any old logs (>1 week)
 */
function init(handle) { // TODO: Logger should be object?
    hwnd = handle;
}

function log(text) {
    spool(`\x1b[90m${timestamp()} \x1b[0m[INFO] ${text}\x1b[0m`);
}

function warn(text) {
    spool(`\x1b[90m${timestamp()} \x1b[33m[WARN] ${text}\x1b[0m`);
}

function error(text) {
    spool(`\x1b[90m${timestamp()} \x1b[31m[ERROR] ${text}\x1b[0m`);
}

function spool(text) {
    let currPos = getScrollPos(hwnd);

    // writeLog(text); // TODO: Implement log file

    if (currPos < lastPos) {
        queueMessage(text);
        return;
    } else if (list.size() > 0) {
        printQueue();
    } else {
        console.log(text);
    }

    lastPos = getScrollPos(hwnd);
}

function writeLog(text) {
    let raw = text.replaceAll(colorPattern, ''); // Strip color formatting from text
}

function queueMessage(text) {
    list.append(new Item(text));
}

function printQueue() {
    let item = list.getFirst();

    console.log(item.getData());

    while (item.next) {
        item = item.next;
        console.log(item.getData());
    }

    list.clear();
}

/**
 * Get the current formatted timestamp
 * @returns {string} Current time HH:MM:SS [AM/PM]
 */
function timestamp() {
    return new Date().toLocaleTimeString();
}
