var express = require('express')
var app = express()
var bodyParser = require("body-parser")
var cookieParser = require("cookie-parser")
var MongoClient = require('mongodb').MongoClient;

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/hola', function (req, res) {
  res.send('Hola mundo!!!!');
});

app.get('/insultos', function (req, res) {
  var url = 'mongodb://localhost:27017/prueba';

  MongoClient.connect(url, function(err, db)
  {
    if(err)
    {console.log("ha habido un error");}
    else
    {
      var col = db.collection('insultos');
      col.find({}).toArray(function(err, items)
      {
        if(err)
        {console.log("error, ha cascao")}
        else{
          res.send(items);
        }
      });
    }
  });
});

app.get('/nombre', function (req, res) {
  var url = 'mongodb://localhost:27017/prueba';
  var cookie = req.cookies["redefine"];

  MongoClient.connect(url, function(err, db)
  {
    if(err)
    {console.log("ha habido un error");}
    else
    {
      var col = db.collection('logins');
      col.find({"cookie":cookie}).toArray(function(err, items)
      {
        if(err)
        {console.log("error, ha cascao")}
        else{
          res.send(items);
        }
      });
    }
  });
});

app.post('/form', function (req, res)
{
  var url = 'mongodb://localhost:27017/prueba';
  var nombre = req.body.firstname;
  var insulto = req.body.lastname;

  console.log("Insertando: "+nombre+":"+insulto);

  MongoClient.connect(url, function(err, db)
  {
    if(err)
    {
      console.log("ha habido un error");
      res.send('La DB ha petado');
    }
    else
    {
      var col = db.collection('insultos');
      col.insert({"nombre":nombre,"insulto":insulto},function(){db.close();});
      res.redirect(req.get('referer'));
    }
  });
});

app.get('/delete', function (req, res)
{
  var url = 'mongodb://localhost:27017/prueba';

  MongoClient.connect(url, function(err, db)
  {
    if(err)
    {
      console.log("ha habido un error");
      res.send('La DB ha petado');
    }
    else
    {
      var col = db.collection('insultos');
      col.remove({});
      res.redirect(req.get('referer'));
    }
  });
});

app.post('/log_in', function(req, res) {
  var url = "mongodb://localhost:27017/prueba";
  var nombre = req.body.user;
  var cookie = Math.random().toString();
  cookie = cookie.substring(2, cookie.length);

  MongoClient.connect(url, function(err, db) {
    if(!err) {
      var col = db.collection('logins');

      col.insert({"nombre":nombre, "cookie":cookie});
    }
  });

  res.cookie("redefine", cookie);
  res.redirect("/");
});

app.get('/log_out', function(req, res) {
  var url = "mongodb://localhost:27017/prueba";
  var cookie = req.cookies["redefine"];

  MongoClient.connect(url, function(err, db) {
    if(!err) {
      var col = db.collection('logins');

      col.remove({"cookie":cookie});
    }
  });

  res.clearCookie("redefine");
  res.redirect("/");
});

var server = app.listen(3000, function () {
    console.log('Servidor escuchando en puerto 3000');
})
