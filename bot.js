const { setTimeout } = require('timers/promises');
const WebSocket = require('ws');

let socket;

let oAuth; // TODO: Put these variables in an object because why wouldn't they be?
let nick;
let channel; // No reason this should ever be anything other than 'dunkorslam'
let minimum; // Minimum delay (in seconds) before sending spam message
let maximum; // Maximum delay, should never be greater than 30 (because there's no point)
let messages;

let lastIndex = 0;
let messageQueued = false;

loadConfig(registerSocket);
console.log(oAuth)
console.log(nick)

console.log(channel)

function loadConfig(_callback) {
    let config = require('./config.json');

    oAuth = config.oAuth;
    nick = config.nick;
    channel = config.channel;
    minimum = config.minimum;
    maximum = config.maximum;
    messages = config.messages;

    console.log(oAuth)
    console.log(nick)

    // Validation
    if (messages.length <= 1) {
        console.log('Error: Message array must have at least two entries');
        process.exit(1);
    }

    if (minimum < 0 || maximum > 30 || maximum < minimum) {
        console.error("Error: Minimum/maximum must be between 0 and 30");
        process.exit(1);
    }

    _callback();
}

function registerSocket() {
    socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443')

    socket.on('open', () => {
        console.log('Socket opened B');
        socket.send(`PASS ${oAuth}`);
        socket.send(`NICK ${nick}`);
        socket.send(`JOIN #${channel}`);
    });

    socket.on('message', ev => {
        if (ev.includes("PING")) {
            socket.send("PONG");
            return;
        }

        console.log('%s', ev);

        if (String(ev).startsWith(":wizebot!") && ev.includes('⭐️')) {
            console.log('-------------------------------------------')
            console.log('')
            console.log('AYO NEW SUB JUST DROPPED')
            console.log('')
            console.log('-------------------------------------------')

            queueMessage(); // Don't care about promise lmao
        }
    });
}

async function queueMessage() {
    if (messageQueued) {
        return; // Don't queue another message if there's already one waiting (to prevent excessive spam)
    }

    messageQueued = true;

    await setTimeout(random(minimum, maximum));

    socket.send(`PRIVMSG #${channel} :${messages[lastIndex]}`);
    lastIndex = (lastIndex + 1 > messages.length) ? lastIndex + 1 : 0;
    messageQueued = false;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}
