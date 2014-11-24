var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var VERSION = Math.floor(Math.random()*1000);
var port = 4242;


app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.get('/fluffy.ogg', function(req, res){
  res.sendfile('fluff.ogg');
});
app.get('/fluffy.gif', function(req, res){
  res.sendfile('fluffy.gif');
});

var clients = {};
function getCount() {
  return Object.keys(clients).length;
}

io.on('connection', function(socket){
  var address = socket.handshake.address, addr=address+":"+socket.request.connection.remotePort;
  clients[addr] = { socket: socket, addr: addr, nick: address };
  console.log('* a user connected', addr);
  io.sockets.emit('newuser', address+" online | "+getCount()+" users online", getCount());
  socket.emit('restart', VERSION);
  socket.on('disconnect', function() {
    delete clients[address];
    io.sockets.emit('newuser', address+" disconnect | "+getCount()+" users online", getCount());
    console.log('* disconnect '+addr);
  });
  socket.on('ping', function(pong) {
	pong();
  });
  socket.on('playall', function(start) {
	io.sockets.emit('play', start);
  });
  socket.on('newnick', function(nick) {
    nick = nick.replace(/[^a-zA-Z0-9_.+*! -]/g, "");
    io.sockets.emit('chat', '* '+clients[addr].nick+' now known as '+nick);
    clients[addr].nick = nick;
  });
  socket.on('chat', function(msg) {
    io.sockets.emit('chat', clients[addr].nick+': '+msg);
    console.log('chat '+clients[addr].nick+': '+msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});


setInterval(function() {
	io.sockets.emit('color', getRandomColor());
        
}, 10000);

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


