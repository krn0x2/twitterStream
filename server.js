
// var stream = client.stream('statuses/filter', {track: 'javascript,nuclear', delimited:false});

const
express = require('express'),
app = express(),
server = require('http').Server(app),
io = require('socket.io')(server,{
	origins:"*:*"
});
app.use('/node_modules', express.static(__dirname + '/node_modules/'));
app.use(express.static(__dirname + '/static'));

// route 127.0.0.1/client to client.html
app.get('/index', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var stream;

io.on('connection', function(socket){
	var tweetStore = require('./tweetStorage')(socket);
	socket.on('watch',function(filter){
		tweetStore.addLabel(filter);
	});

	socket.on('unwatch',function(filter){
		tweetStore.removeLabel(filter);
	});
});

server.listen(8080,"127.0.0.1");

