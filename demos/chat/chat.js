var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
//process.stdin.resume();//so the program will not close instantly
find_date();
calculate_time();
fs.writeFile('./file.txt', '',  function(err) {           //Write empty string
    if (err) {
      return console.error(err);
   }
});

var str = '';										
var time;																	//Global variable to hold the time value
var date;                                 //Global variable to hold the time value
var count = 0;														//Track number of messages that have come in

function calculate_time(){								//Calculate the time periodically and store in variable time
	var date_local = new Date();
	var hour = date_local.getHours();
  var minutes = date_local.getMinutes();
  var seconds = date_local.getSeconds();
  time = ''
  time = hour + ':' + minutes + ':' + seconds;
}

function find_date(){
  var date_local = new Date();
  var month = date_local.getMonth() + 1 
  var day = date_local.getDate() 
  var year = date_local.getFullYear() 
  date = ''
  date = month + '/' + day + '/' + year
}

function write_to_db(source, value, time, date){
  console.log("Inside");
  db.serialize(function() {
    db.run("CREATE TABLE if not exists Sensor_data (sensor_id INTEGER, sensor_output FLOAT, time TEXT, date TEXT)");
    var stmt = db.prepare("INSERT INTO Sensor_data VALUES(?,?,?,?)");

    stmt.run(source,value,time,date);

    stmt.finalize();
  });

  //db.close();
}

function exitHandler() {
    db.close();
}

fs.writeFile('./file.txt', '',  function(err) {               //Clear the file at the beginning of operation. Optional
    if (err) {
      return console.error(err);
   }
});



setInterval(calculate_time,500);											//Call the function once every 0.5 seconds
setInterval(find_date,10000);                         //Call the function once every 10 seconds


app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    str = msg + '\t' + time + '\t' + date + '\n'							//string to hold all the data
	fs.appendFile('./file.txt', str,  function(err) {						//Write the new message
   	if (err) {
      return console.error(err);
   }
   });
  console.log(str)

    //console.log(time);
    /*find_date()
    calculate_time()
    console.log(date)
    console.log(time)
    write_to_db(1, 26.5, time, date)*/
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');

});


/*//do something when app is closing
process.on('exit', exitHandler());

//catches ctrl+c event
process.on('SIGINT', exitHandler());

//catches uncaught exceptions
process.on('uncaughtException', exitHandler());*/