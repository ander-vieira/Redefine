//Este script será el encargado de definir el comportamiento ante las
//diferentes peticiones que pueda hacer el usuario.

var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
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
            if(items != null) {
                var content = {};

                content["autor"] = items.nombre;
                content["tipo"] = req.body.tipo_cont;
                content["date"] = new Date().toUTCString();
                if(content["tipo"] == "texto") {
                    content["texto"] = req.body.texto_valor;
                }
                else if(content["tipo"] == "imagen") {
                    content["imagen"] = req.body.imagen_url;
                }
                else if(content["tipo"] == "link") {
                    content["link_url"] = req.body.link_url;
                }

                queries.add_content(content, function() {
                    res.redirect("/");
                });
            } else res.redirect("/");
        });
    });

    app.get('/all_content', function(req, res) {
        queries.get_all_content(function(items) {
            res.send(items);
        });
    });

    app.get('/my_content', function(req, res) {
        var nombre;
        var cookie = req.cookies.redefine;

        queries.get_session_data(cookie, function(session) {
            if(session!=null) nombre = session.nombre;
            else nombre = "";
            queries.get_user_content(nombre, function(items) {
                res.send(items);
            });
        });
    });

    //Devuelve un html modificado
    app.get('/user/:username', function(req, res) {
        var nombre = req.params.username;

        //Coge los datos del usuario de la BD
        queries.get_user(nombre, function(result) {
            //Si el usuario existe
            if(result != null && result.length > 0) {
                fs.readFile('public/user_template.html', 'utf8', function(err, data) {
                    //Leer los datos del usuario
                    var user_avatar = result[0]["avatar"];
                    var user_description = result[0]["description"];

                    //Modificar la plantilla con los datos
                    data = data.replace(/:user/g, nombre);
                    data = data.replace(":avatar", user_avatar);
                    data = data.replace(":description", user_description);

                    res.send(data);
                });
            }
            else res.redirect("/error.html");
        });

    });

    app.post("/modify_user", function(req, res) {
        var cookie = req.cookies.redefine;

        queries.get_session_data(cookie, function(items) {
            if(items != null) {
                var nombre = items.nombre;
                var avatar = req.body.avatar;
                var description = req.body.description;

                queries.set_user_data(nombre, avatar, description, function() {
                    res.redirect("/user/"+nombre);
                });
            } else {
                res.redirect("/error.html");
            }
         });
    });

    app.get('/my_user_data', function(req, res) {
        var cookie = req.cookies.redefine;

        queries.get_session_data(cookie, function(items) {
            queries.get_user(items.nombre, function(result) {
                if(result != null || result.length > 0)
                    res.send(result[0]);
            });
        });
    });

    app.post('/user_data', function(req, res) {
        console.log(req.body);

        var nombre = req.body.nombre;

        queries.get_user(nombre, function(result) {
            if(result != null || result.length > 0)
                res.send(result[0]);
        });
    });

    //Cualquier otra URL que los locos usuarios de redefine puedan poner les redireccionara a la pagina de error
    app.get('/aaa', function(req, res) {
        res.redirect("/error.html");
    });
};
