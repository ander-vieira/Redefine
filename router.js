//Este script será el encargado de definir el comportamiento ante las
//diferentes peticiones que pueda hacer el usuario.

var MongoClient = require('mongodb').MongoClient;
var constants = require('./constants'); //URL a mongo "mongodb://localhost:27017/prueba"
var queries = require('./queries'); //JS encargado de manejar los queries de la base de datos

module.exports = function(app) {

    //Se muestra el index, se usa render, que ya lo definimos en la app express, en el server.
    app.get('/', function(req, res) {
        res.render('./public/index.html');
    });

    app.get('/hola', function(req, res) {
        res.send('Hola mundo!!!!');
    });

    //Mostrara los insultos guardados en la base de datos, en concreto, lo que metemos en el index ("nombre" y "apellido")
    app.get('/insultos', function(req, res) {
        MongoClient.connect(constants.mongourl, function(err, db) {
            if (err) {
                console.log("ha habido un error");
            } else {
                var col = db.collection('insultos');
                col.find({}).toArray(function(err, items) {
                    if (err) {
                        console.log("error, ha cascao");
                    } else {
                        res.send(items);
                    }
                });
            }
        });
    });

    //COMENTADLO BIEN VOSOTROS ! =D
    app.get('/nombre', function(req, res) {
        var cookie = req.cookies.redefine;

        var items = queries.get_session_data(cookie, function(items) {
            res.send(items);
        });
    });

    //Comprotamiento cuando se le da a enviar en el formulario de nombre y apellido
    app.post('/form', function(req, res) {
        var nombre = req.body.firstname;
        var insulto = req.body.lastname;

        console.log("Insertando: " + nombre + ":" + insulto);

        //La parte de comprobar si es un nombre valido se hara en un js en el propio navegador, esto es provisional.
        if (nombre !== "") {
            queries.insert_name_entry(nombre, insulto, function() {
                res.redirect(req.get('referer'));
            });
        } else {
            res.write("IEPA COLEGA, QUE NO HAS METIDO UN NOMBRE VALIDO !!");
            res.end();
        }
    });

    app.get('/delete', function(req, res) {
        queries.delete_name_entries(function() {
            res.redirect(req.get('referer'));
        });
    });

    app.post('/log_in', function(req, res) {
        var nombre = req.body.user;
        var cookie = Math.random().toString();
        cookie = cookie.substring(2, cookie.length);

        queries.insert_cookie(nombre, cookie);

        res.cookie("redefine", cookie);
        res.redirect("/");
    });

    app.get('/log_out', function(req, res) {
        var cookie = req.cookies.redefine;

        queries.delete_cookie(cookie);

        res.clearCookie("redefine");
        res.redirect("/");
    });
    
    //Cualquier otra URL que los locos usuarios de redefine puedan poner les redireccionara al index
    app.get('*', function(req, res) {
        res.redirect('/');
    });
};
