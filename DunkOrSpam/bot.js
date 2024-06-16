const { setTimeout } = require('timers/promises');
const WebSocket = require('ws');
const { getHandle, flashWindow } = require('./window.js');
const logger = require('./logging.js');

const messagePattern = /:([a-z0-9_]{4,25})!\1@\1\.tmi\.twitch\.tv ([A-Z]+) #([a-z0-9_]{4,25}) :(.+)/;

let socket;

let config = {
    oAuth: '',
    nick: '', // Twitch nickname
    channel: '', // No reason this should ever be anything other than 'dunkorslam'
    minimum: '', // Minimum delay (in seconds) before sending spam message
    maximum: '', // Maximum delay, should never be greater than 30 (because there's no point)
    messages: []
}

let lastIndex = 0;
let messageQueued = false;
let hwnd;

loadConfig(config, registerSocket);
getHandle('DunkOrSpam', (res) => {
    hwnd = res;
    logger.init(hwnd);
});

// console.log(config.oAuth)
console.log(config.nick)
console.log(config.channel)

function loadConfig(config, _callback) {
    let file = require('./config.json');

    config.oAuth = file.oAuth;
    config.nick = file.nick;
    config.channel = file.channel;
    config.minimum = file.minimum;
    config.maximum = file.maximum;
    config.messages = file.messages;

    // Validation
    if (config.messages.length <= 1) {
        console.log('Error: Message array must have at least two entries');
        process.exit(1);
    }

    if (config.minimum < 0 || config.maximum > 30 || config.maximum < config.minimum) {
        console.error("Error: Minimum/maximum must be between 0 and 30");
        process.exit(1);
    }

    _callback();
}

function registerSocket() {
    socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443')

    socket.on('open', () => {
        console.log('Socket opened');
        socket.send(`PASS ${config.oAuth}`);
        socket.send(`NICK ${config.nick}`);
        socket.send(`JOIN #${config.channel}`);
    });

    socket.on('message', ev => {
        if (ev.includes("PING")) {
            socket.send("PONG");
            return;
        }

        let message = parseMessage(String(ev));

        if (message.author === '') {
            return;
        } else if (message.channel !== config.channel) {
            console.log('ERROR: Channel changed. Shutting down'); // Is this even possible?
            process.exit(1);
        }

        if (message.author === 'wizebot' && ev.includes('⭐️')) {
            console.log('New subscriber message found, queueing message...')

            queueMessage(); // Don't care about promise lmao
        } else if (message.author !== config.nick && message.author !== 'dunkbot' && message.body.toLowerCase().includes(`${config.nick}`)) { // Also ignore pings from dunkbot because nobody cares
            // TODO: Ping exclusions should be configurable rather than hardcoded
            flashWindow(hwnd, 150, 10);
            logger.log(`\x1b[32m${message.author}\x1b[0m: \x1b[43m${message.body}\x1b[0m`);

            return;
        }

        logger.log(`\x1b[32m${message.author}\x1b[0m: ${message.body}`)
    });
}

async function queueMessage() { // Why is this async?
    if (messageQueued) {
        return; // Don't queue another message if there's already one waiting (to prevent excessive spam)
    }

    messageQueued = true;
    let delay = random(config.minimum, config.maximum) * 1000;

    logger.log(`Queued message with ${delay} ms of delay`);
    await setTimeout(delay, delay);

    socket.send(`PRIVMSG #${config.channel} :${config.messages[lastIndex]}`);
    lastIndex = (lastIndex + 1 > config.messages.length) ? lastIndex + 1 : 0;
    messageQueued = false;
}

function parseMessage(text) {
    let message = {
        author: '',
        type: '',
        channel: '',
        body: ''
    }

    let match = text.match(messagePattern);

    if (match != null && match.length > 0) {
        message.author = match[1];
        message.type = match[2];
        message.channel = match[3];
        message.body = match[4];
    }

    return message;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}
