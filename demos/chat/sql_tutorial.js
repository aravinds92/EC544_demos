var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var check;

function write_to_db(source, value, time){
	console.log("Inside");
	db.serialize(function() {
		db.run("CREATE TABLE items (sensor_id INTEGER PRIMARY KEY, sensor_output FLOAT, time TEXT)");
		var stmt = db.prepare("INSERT INTO items VALUES(?,?,?)");

		stmt.run(source,value,time);

		stmt.finalize();
	});

	db.close();
}


write_to_db(1,26.5,"Hello");