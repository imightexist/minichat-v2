const config = {
    port: 81
}

const express = require('express')
const app = express()
const websocket = require('ws').Server
//const ws = new websocket()
const http = require('http')
const httpServer = http.createServer()
const ws = new websocket({server:httpServer})
let users = [];
let chat = [];
function broadcast(data) {
    ws.clients.forEach(client => client.send(data));
};
function escapeInput(input) {
    return String(input)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace("(b)","<b>")
        .replace("(/b)","</b>")
        .replace("(i)","<i>")
        .replace("(/i)","</i>")
        .replace('(img)','<img src="')
        .replace('(/img)','">');
}

ws.on('connection',function(f){
    let user = "guest" + (Math.floor(Math.random() * 98999) + 1000).toString()
    users.push(user)
    broadcast(JSON.stringify(['users',users]))
    f.send(JSON.stringify(['logs',chat]))
    f.send(JSON.stringify(['username',user]))
    f.on('close',function(){
        users.splice(users.indexOf(user),1)
        broadcast(JSON.stringify(['users',users]))
    })
    f.on('message',function(msg){
        array = new Uint8Array(msg);
        let cmd = "";
        array.forEach(function (h) {
            let char = String.fromCharCode(h);
            cmd += char
        });
        cmd = JSON.parse(cmd);

        if (cmd[0] == 'chat'){
            chat.push('<b>' + user + '</b>: ' + escapeInput(cmd[1]));
            response = ['chat','<b>' + user + '</b>: ' + escapeInput(cmd[1])]
            broadcast(JSON.stringify(response))
        }
        if (cmd[0] == 'rename'){
            index = users.indexOf(user)
            exists = users.indexOf(cmd[1]) != -1
            if (users.indexOf(cmd[1]) == -1){
                users[index] = escapeInput(cmd[1])
                user = escapeInput(cmd[1])
                broadcast(JSON.stringify(['users',users]))
                f.send(JSON.stringify(['username',user]))
            }
        }
    })
})
app.use(express.static('webapp'))
httpServer.on('request',app)
httpServer.listen(config.port)
