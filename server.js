var express  = require('express');
var app      = express();
var port     =  8080;
var ip       =  "127.0.0.1";
var mongoose = require('mongoose');
var http = require('http');
var fs = require('fs');
var databaseUrl = "mongodb://localhost:27018/emails";
var mongojs = require("mongojs");
app.set('port', port);
app.set('ip', ip);

// launch ======================================================================
http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
    console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});


// DESCOMENTAR PARA POBLAR LA DB
/*
fs.readFile('./salida.json', 'utf8', function(err, data) {
    if( err ){
        console.log(err)
    }
    else{
    	tempJson = JSON.parse(data);
    	var collec = ['emails'];
        var db = mongojs(databaseUrl, collec);
		  db.emails.save(tempJson, function(err, saved) {
			  if( err || !saved ) console.log("No se ha podido ingresar");
			  else console.log("Se han ingresado los emails con éxito");
		});
    }
});
*/


app.get('/listaremails', function(req, res){
	var collec = ['emails'];
    var db = mongojs(databaseUrl, collec);
	db.emails.find(function (err, docs) {
   		res.send(docs);
	})
	
});
