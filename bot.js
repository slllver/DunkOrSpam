const WebSocket = require('ws');

let socket;

let oAuth;
let nick;
let channel;
let messages;

let lastIndex = 0;

loadConfig(registerSocket);
console.log(oAuth)
console.log(nick)

console.log(channel)

function loadConfig(_callback) {
    let config = require('./config.json');

    oAuth = config.oAuth;
    nick = config.nick;
    channel = config.channel;
    messages = config.messages;

    console.log(oAuth)
    console.log(nick)

    if (messages.length <= 1) {
        console.log('Error: Message array must have at least two entries');
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

            socket.send(`PRIVMSG #${channel} :${messages[lastIndex]}`);

            if (++lastIndex >= messages.length) {
                lastIndex = 0;
            }
        }
    });
}
