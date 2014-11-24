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

io.on('connection', function(socket){
  var address = socket.handshake.address;
  clients[address] = { socket: socket, addr: address };
  console.log('a user connected', address);
  io.sockets.emit('newuser', address);
  socket.emit('restart', VERSION);
  
  socket.on('ping', function(pong) {
	pong();
  });
  socket.on('playall', function(start) {
	io.sockets.emit('play', start);
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


