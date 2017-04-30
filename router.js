//Este script será el encargado de definir el comportamiento ante las
//diferentes peticiones que pueda hacer el usuario.

var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var constants = require('./constants'); //URL a mongo "mongodb://localhost:27017/prueba"
var queries = require('./queries'); //JS encargado de manejar los queries de la base de datos

module.exports = function(app) {


  //**************************************************************************
  //    PETICIONES POR POST
  //--------------------------------------------------------------------------


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
  //*************************************************************
  //aqui se mandan los datos de registro
  app.post('/registerform', function(req, res) {

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.pass;
    var request = require('request');
    var headers = {
      'User-Agent': 'Super Agent/0.0.1',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    var options = {
      url: 'https://www.google.com/recaptcha/api/siteverify',
      method: 'POST',
      headers: headers,
      form: {
        'secret': '6LeraRsUAAAAAJvyeSUixNZR5k6-k3Jz5ZlD5lSJ',
        'response': req.body["g-recaptcha-response"]
      }
    }
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body
        body = JSON.parse(body);
        if (body.success) {
          console.log("Registrando temporalmente: USERNAME: " + username + " EMAIL: " + email + " PASSWORD: " + password);
          queries.temporal_registration(username, email, password, req, function() {
            res.sendFile(__dirname + '/public/regok.html');
          });
        } else {
          console.log("Usuario no registrado, captcha fallido");
          res.send("Ha habido algun problema con el captcha");
        }
      }
    });
  });
  //*************************************************************
  app.post('/log_in', function(req, res) {
    var nombre = req.body.user;
    var cookie = Math.random().toString();
    var correct = false;
    cookie = cookie.substring(2, cookie.length);

    //Coge los datos del usuario de la BD
    queries.get_user(nombre, function(result) {
      //Si el usuario existe
      if (result != null && result.length > 0) {
        pass = req.body.pass;
        rightpass = result[0]["pass"];
        //Si las contraseñas coinciden
        if (pass == rightpass) {
          //Hacer el login
          console.log("Logged in: " + nombre);
          queries.insert_cookie(nombre, cookie);
          res.cookie("redefine", cookie, {
            maxAge: 3600000
          });
        }
        /*TODO*/ //Por hacer: si contraseña incorrecta, devolver al formulario con un mensaje o algo
      }
      res.redirect("/");
    });
  });
  //*************************************************************
  app.post('/publish', function(req, res) {
    var cookie = req.cookies.redefine;

    queries.get_session_data(cookie, function(items) {
      if (items != null) {
        var content = {};

        content["autor"] = items.nombre;
        content["tipo"] = req.body.tipo_cont;
        content["date"] = new Date().toUTCString();
        if (content["tipo"] == "texto") {
          content["texto"] = req.body.texto_valor;
        } else if (content["tipo"] == "imagen") {
          content["imagen"] = req.body.imagen_url;
        } else if (content["tipo"] == "link") {
          content["link_url"] = req.body.link_url;
        }

        queries.add_content(content, function() {
          res.redirect("/");
        });
      } else res.redirect("/");
    });
  });
  //*************************************************************
  app.post("/modify_user", function(req, res) {
    var cookie = req.cookies.redefine;

    queries.get_session_data(cookie, function(items) {
      if (items != null) {
        var nombre = items.nombre;
        var avatar = req.body.avatar;
        var description = req.body.description;

        queries.set_user_data(nombre, avatar, description, function() {
          res.redirect("/user/" + nombre);
        });
      } else {
        res.redirect("/error.html");
      }
    });
  });
  //*************************************************************
  app.post('/user_data', function(req, res) {
    var nombre = req.body.nombre;
    queries.get_user(nombre, function(result) {
      if (result != null || result.length > 0)
        res.send(result[0]);
    });
  });

  //**************************************************************************
  //    PETICIONES POR GET
  //--------------------------------------------------------------------------

  //Se muestra el index solo, no hace falta poner un /
  //mandar página de registro
  app.get('/register', function(req, res) {
    res.sendFile(__dirname + '/public/register.html');
  });
  //*************************************************************

  //Se busca el usuario, segun si lo que me pasas es el mail o el nombre de usuario.
  app.get("/findusers", function(req, res) {
    if (req.ip.toString().split(':')[3] != "127.0.0.1") {
      res.redirect("/error.html"); //Esto lo he puesto como medida de seguridad, ¿Se podria saltar de alguna manera? ¿Se os ocurre otra forma mejor?
    } else {
      queries.getUsersByUsernameOrMail(req.query.user, function(items) {
        res.send(items);
      });
    }
  });
  //*************************************************************
  //Devuelve los insultos en la base de datos en formato JSON
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
  //*************************************************************
  //COMENTADLO BIEN VOSOTROS ! =D
  app.get('/nombre', function(req, res) {
    var cookie = req.cookies.redefine;
    var items = queries.get_session_data(cookie, function(items) {
      res.send(items);
    });
  });
  //*************************************************************
  app.get('/delete', function(req, res) {
    queries.delete_name_entries(function() {
      res.redirect("/");
    });
  });
  //*************************************************************
  app.get('/register_user', function(req, res) {
    var user = req.query.user;
    var code = req.query.code;
    queries.register_user(user, code, function() {
      //Después de registrar, hace login automáticamente
      var cookie = Math.random().toString();

      queries.insert_cookie(user, cookie);
      res.cookie("redefine", cookie, {
        maxAge: 3600000
      });
      res.redirect("/");
    });
  });
  //*************************************************************
  app.get('/log_out', function(req, res) {
    var cookie = req.cookies.redefine;

    queries.delete_cookie(cookie);

    res.clearCookie("redefine");
    res.redirect("/");
  });
  //*************************************************************
  app.get('/all_content', function(req, res) {
    queries.get_all_content(function(items) {
      res.send(items);
    });
  });
  //*************************************************************
  app.get('/my_content', function(req, res) {
    var nombre;
    var cookie = req.cookies.redefine;

    queries.get_session_data(cookie, function(session) {
      if (session != null) nombre = session.nombre;
      else nombre = "";
      queries.get_user_content(nombre, function(items) {
        res.send(items);
      });
    });
  });
  //*************************************************************
  //Devuelve un html modificado
  app.get('/user/:username', function(req, res) {
    var nombre = req.params.username;

    //Coge los datos del usuario de la BD
    queries.get_user(nombre, function(result) {
      //Si el usuario existe
      if (result != null && result.length > 0) {
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
      } else res.redirect("/error.html");
    });
  });
  //*************************************************************
  app.get('/my_user_data', function(req, res) {
    var cookie = req.cookies.redefine;

    queries.get_session_data(cookie, function(items) {
      queries.get_user(items.nombre, function(result) {
        if (result != null || result.length > 0)
          res.send(result[0]);
      });
    });
  });
  //*************************************************************
  app.get('*', function(req, res) {
    res.redirect('/error.html');
  });
}
