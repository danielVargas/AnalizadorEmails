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
});*/


app.get('/listaremails', function(req, res){
	var collec = ['emails'];
    var db = mongojs(databaseUrl, collec);
	db.emails.find(function (err, docs) {
   		res.send(docs);
	})
	
});


app.get('/mails/info/:startTime/:endTime', function(req, res){
    console.log('start timple ' + req.params.startTime + "endtime "+   req.params.endTime); 
    var startTime   =  req.params.startTime;
    var endTime = req.params.endTime;
    var collec = ['emails'];
    var db = mongojs(databaseUrl, collec);   
    db.emails.find({ "date": { $gt: startTime , $lt: endTime }},function (err, docs) {
        console.log(docs.length);
        newdocs = []
        for (var i = docs.length - 1; i >= 0; i--) {
            
            temp = { 
                    "timeStamp" : docs[i].date , 
                    "__id" : docs[i]._id,
                    "popularity" : docs[i].popularity,
                    "urgency": docs[i].urgency
                }
            newdocs.push(temp);
        };
        res.send(newdocs);
    })
    
});


/*
//primer nivel :userId [startTime, endTime]
URI: mails/?user=ID&startTime=2342&endTime=234234
[{
    timeStamp:34234234,
    _id: 234234,
    polarity:-1,
    urgency:1
},
//...
]

/server.js/segundo nivel
URI: mails/info/startTime=2342&endTime=234234
[{
    timeStamp:34234234,
    _id: 234234,
    polarity:-1,
    urgency:1
    subject: "texto del asunto"
    from: "correo cliente"
}
]
*/

app.get('/mails/:idmail', function(req, res){
    var idmail   =  req.params.idmail;
    console.log("id: "  + idmail);
    var ObjectId = require('mongodb').ObjectID;
    var collec = ['emails'];
    var db = mongojs(databaseUrl, collec);   
    db.emails.find({ "_id":   new ObjectId(idmail) },function (err, docs) {
        newdocs = []
        for (var i = docs.length - 1; i >= 0; i--) {
            
            temp = { 
                    "subject" : docs[i].subject,
                    "from" : docs[i].from,
                    "to" : docs[i].to,
                    "body" : docs[i].body, 
                    "date" : docs[i].date,
                    "__id" : docs[i]._id
                }
            newdocs.push(temp);
        };
        res.send(newdocs);
    })
});

/*
//detalle mail
URI: mails/1231
{
    subject:
    from:
    to:
    body:
    date:
    _id:
}*/
