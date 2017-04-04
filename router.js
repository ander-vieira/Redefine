//Este script será el encargado de definir el comportamiento ante las
//diferentes peticiones que pueda hacer el usuario.

var MongoClient = require('mongodb').MongoClient;
var constants = require('./constants'); //URL a mongo "mongodb://localhost:27017/prueba"
var queries = require('./queries'); //JS encargado de manejar los queries de la base de datos

module.exports = function(app) {


    //Se muestra el index solo, no hace falta poner un /

    //mandar página de registro
    app.get('/register', function(req, res) {
        res.sendFile(__dirname+'/public/register.html');
    });

    //recibir fomulario de registro
    app.post('/register', function(req, res) {
        var nombre = req.body.email;
        var pass = req.body.pass;
        var conf = req.body.conf;

        console.log(nombre, pass, conf);
        res.redirect("/");
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
          queries.insert_name_entry(nombre, insulto, function() {
                res.redirect("/");
            });
    });

    //aqui se mandan los datos de registro
    app.post('/registerform', function(req, res) {
        var name = req.body.email;
        var password = req.body.pass;

        console.log("Registrando: " + name + ":" + password);

        //La parte de comprobar si es un nombre valido se hara en un js en el propio navegador, esto es provisional.
          queries.register_user(name, password, function() {
                //Después de registrar, hace login automáticamente
                var cookie = Math.random().toString();

                queries.insert_cookie(name, cookie);
                res.cookie("redefine", cookie, {maxAge: 3600000});

                res.redirect("/");
            });
    });

    app.get('/delete', function(req, res) {
        queries.delete_name_entries(function() {
            res.redirect("/");
        });
    });

    app.post('/log_in', function(req, res) {
        var nombre = req.body.user;
        var cookie = Math.random().toString();
        var correct = false;
        cookie = cookie.substring(2, cookie.length);

        //Coge los datos del usuario de la BD
        queries.get_user(nombre, function(result) {
            //Si el usuario existe
            if(result != null && result.length > 0) {
                pass = req.body.pass;
                rightpass = result[0]["pass"];
                //Si las contraseñas coinciden
                if(pass == rightpass) {
                    //Hacer el login
                    console.log("Logged in: "+nombre);
                    queries.insert_cookie(nombre, cookie);
                    res.cookie("redefine", cookie, {maxAge: 3600000});
                }

                //Por hacer: si contraseña incorrecta, devolver al formulario con un mensaje o algo
            }

            res.redirect("/");
        });

    });

    app.get('/log_out', function(req, res) {
        var cookie = req.cookies.redefine;

        queries.delete_cookie(cookie);

        res.clearCookie("redefine");
        res.redirect("/");
    });

    app.post('/publish', function(req, res) {
        var cookie = req.cookies.redefine;

        queries.get_session_data(cookie, function(items) {
            console.log(items);
            if(items != null) {
                var content = {};

                content["autor"] = items.nombre;
                content["tipo"] = req.body.tipo_cont;
                if(content["tipo"] == "texto") {
                    content["texto"] = req.body.texto_valor;
                }
                else if(content["tipo"] == "imagen") {
                    content["imagen"] = req.body.imagen_url;
                }

                console.log(content);

                queries.add_content(content, function() {
                    res.redirect("/");
                });
            }
        });
    });

    app.get('/all_content', function(req, res) {
        queries.get_all_content(function(items) {
            res.send(items);
        });
    });

    //Cualquier otra URL que los locos usuarios de redefine puedan poner les redireccionara al index
    app.get('/aaa', function(req, res) {
        //res.redirect("/");
        //res.sendFile('register.html');
    });
};
