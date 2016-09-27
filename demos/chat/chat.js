var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var str = '\0';										
var time;																	//Global variable to hold the time value
var count = 0;																//Track number of messages that have come in

fs.writeFile('./file.txt', '',  function(err) {								//Clear the file at the beginning of operation. Optional
   	if (err) {
      return console.error(err);
   }
});

function calculate_time(){													//Calculate the time periodically and store in variable time
	var date = new Date();
	var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    time = ''
    time = hour + ':' + minutes + ':' + seconds;
}

setInterval(calculate_time,500);											//Call the function once every 0.5 seconds


app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    str = str + msg + ' ' + time + '\n'										//string to hold all the data
    count += 1;
    fs.writeFile('./file.txt', count + '\n',  function(err) {				//Write count at the top of the file
   		if (err) {
      	return console.error(err);
   		}
	});
	fs.appendFile('./file.txt', str,  function(err) {						//Write the rest of the messages
   	if (err) {
      return console.error(err);
   }
   });
    console.log(time);
   //console.log(str);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');

});