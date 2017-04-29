//------------------------------------------------------------------------------
/*
En este script encontraremos las funciones dedicadas a acceder y
gestionar la base de datos. Para saber en todo momento que organizacion hay
en la misma propongo que lo describamos en este comentario.

-- Estructura de la BD -- (mongodb://localhost:27017/redefinedb)
 ___________________
|*Database:
|   redefinedb
|
|*Collections:
|     logins: {nombre:,cookie:}
|     insultos
|     users: {username:,email:,password:}
|     temporal_register: {username:,email:,pass:,hash:,created:}
*/
//------------------------------------------------------------------------------


var MongoClient = require('mongodb').MongoClient;
var constants = require('./constants');
var nodemailer = require('nodemailer');

//------------------------------------------------------------------------------
//    QUERIES ORDENADAS SEGUN EL TIPO DE DATOS QUE SE GESTIONA **(TODO)**
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//    PARA MANTENER LA SESION
//------------------------------------------------------------------------------
//Se introduce una cookie que nos servira para mantener la sesion del usuario
function insert_cookie(nombre, cookie) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (!err) {
      var col = db.collection('logins');
      col.insert({
        "nombre": nombre,
        "cookie": cookie
      }, function() {
        db.close();
      });
    }
  });
}

//Se elimina la cookie
function delete_cookie(cookie) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (!err) {
      var col = db.collection('logins');

      col.remove({
        "cookie": cookie
      }, function() {
        db.close();
      });
    }
  });
}

function get_session_data(cookie, aftercall) {
  var datos;
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (err) {
      console.log("ha habido un error");
    } else {
      var col = db.collection('logins');
      col.find({
        "cookie": cookie
      }).toArray(function(err, items) {
        if (err) {
          console.log("error, ha cascao")
        } else {
          aftercall(items[0]);
        }
        db.close();
      });
    }
  });

  return datos;
}


//------------------------------------------------------------------------------
// PASOS QUE SIGUE UN USUARIO QUE SE CREA UNA CUENTA NUEVA
//------------------------------------------------------------------------------
//Utilizado para enviar mails
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'redefine78@gmail.com', //correo desde donde se manda
    pass: 'redefine1234' //contraseña del correo
  }
});

//Paso 1: Registro temporal --> Se llama cuando se rellena el formulario.
//Con  los datos que tenemos almacenados, posteriormente activaremos la cuenta final.
function temporal_registration(username, email, password, req, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (!err) {
      var col = db.collection('temporal_register');
      var hash = Math.random().toString();
      var hostname = req.headers.host; // hostname = 'localhost:8080'
      var url = 'http://' + hostname + '/register_user?user=' + email + '&code=' + hash;

      //falta comprobar que no este ya registrado
      col.insert({
        "_id": username,
        "email": email,
        "pass": password,
        "hash": hash,
        "created": new Date()
      }, function(error, result) {
        if (error)
          console.log(error);
        else {
          let mailOptions = {
            from: '"Redefine" <redefine@gmail.com>', // sender address
            to: email, // list of receivers
            subject: 'Activación de cuenta Redefine', // Subject line
            text: 'Bienvenido a Redefine, esperamos que disfrutes! \nHaz click en el siguiente enlace para activar tu cuenta:', // plain text body
            html: '<p style="text-align:center;">¡Bienvenido a Redefine!, Tu cuenta casi está lista.<br/>Haz click en el siguiente enlace para activarla:</p><div style="text-align:center;"  ><a href=\"' + url + '\">Activar cuenta</a></div>' // html body
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
          });
        }
        db.close();
      });
      aftercall(); //tiene que hacer un aftercall para que te mande a algun sitio
    }
  });
}

//Registro final, haciendo uso del registro temporal
function register_user(email, codigo, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (!err) {
      var users = db.collection('users');
      var temporal = db.collection('temporal_register');

      temporal.find({
        "email": email
      }).toArray(function(err, item) {

        if (!err && item[0].hash == codigo) {
          users.insert({
            "_id": item[0]["_id"],
            "email": email,
            "pass": item[0].pass,
            "avatar": constants.def_avatar,
            "description": constants.def_description
          }, function(error, result) {
            if (error) console.log(error);
            temporal.remove({
              "email": email
            }, function() {
              db.close();
            });
          });
        }
      });
      aftercall();
    }
  });
}





//Esto en principio lo tenemos en desuso no?
function insert_name_entry(nombre, apellido, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (err) {
      console.log("ha habido un error");
      res.send('La DB ha petado');
    } else {
      var col = db.collection('insultos');
      col.insert({
        "nombre": nombre,
        "insulto": apellido
      }, function() {
        db.close();
      });
      aftercall();
    }
  });
}

function delete_name_entries(aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (err) {
      console.log("ha habido un error");
      res.send('La DB ha petado');
    } else {
      var col = db.collection('insultos');
      col.remove({}, function() {
        db.close();
      });
      aftercall();
    }
  });
}


function get_user(nombre, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (!err) {
      var col = db.collection('users');

      col.find({
        "_id": nombre
      }).toArray(function(error, result) {
        if (error) console.log(error);
        db.close();
        aftercall(result);
      });
    }
  });

}

function set_user_data(nombre, avatar, description, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (!err) {
      var col = db.collection('users');

      col.update({
        "_id": nombre
      }, {
        $set: {
          "avatar": avatar,
          "description": description
        }
      }, function(error, result) {
        if (error) console.log(error);
        db.close();
        aftercall();
      });
    }
  });

}

function add_content(content, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (!err) {
      var col = db.collection('content');

      col.insert(content, function(error, result) {
        if (error) console.log(error);
        db.close();
      });
      //tiene que hacer un aftercall para que te mande a algun sitio
      aftercall();
    }
  });
}

function get_all_content(aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (err) {
      console.log("ha habido un error");
    } else {
      var col = db.collection('content');
      col.find({}).toArray(function(err, items) {
        if (err) {
          console.log("error, ha cascao")
        } else {
          aftercall(items);
        }
        db.close();
      });
    }
  });
}

function get_user_content(nombre, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (err) {
      console.log("ha habido un error");
    } else {
      var col = db.collection('content');
      col.find({
        "autor": nombre
      }).toArray(function(err, items) {
        if (err) {
          console.log("error, ha cascao")
        } else {
          aftercall(items);
        }
        db.close();
      });
    }
  });
}

//*** COLLECTION USERS ***
function getUsersByUsernameOrMail(buscado, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if (!err) {
      var usuariosdb = db.collection('users');
      var usuarios;
      if (buscado.indexOf('@') == -1) {
        usuarios = usuariosdb.find({
          "_id": buscado
        }).toArray(function(err, items) {
          if (!err) aftercall(items);
          db.close();
        });
      } else {
        usuarios = usuariosdb.find({
          "email": buscado
        }).toArray(function(err, items) {
          if (!err) aftercall(items);
          db.close();
        });
      }
    }
  });
}



module.exports.temporal_registration = temporal_registration;
module.exports.insert_cookie = insert_cookie;
module.exports.delete_cookie = delete_cookie;
module.exports.get_session_data = get_session_data;
module.exports.insert_name_entry = insert_name_entry;
module.exports.delete_name_entries = delete_name_entries;
module.exports.register_user = register_user;
module.exports.get_user = get_user;
module.exports.set_user_data = set_user_data;
module.exports.add_content = add_content;
module.exports.get_all_content = get_all_content;
module.exports.get_user_content = get_user_content;

module.exports.getUsersByUsernameOrMail = getUsersByUsernameOrMail;
