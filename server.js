var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cors = require('cors');

//Creamos y ajustamos el comportamiento de la app Express
var app = express();
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())
//Archivo js que se encargara de routar los request
require('./router.js')(app);

//El servidor, a pijo sacao
var server = app.listen(3000, function(){
  console.log("Server listening on port 3000");
});
