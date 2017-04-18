var MongoClient = require('mongodb').MongoClient;
var constants = require('./constants');
var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'redefine78@gmail.com',//correo desde donde se manda
        pass: 'redefine1234'//contraseña del correo
    }
});

function insert_cookie(nombre, cookie) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if(!err) {
      var col = db.collection('logins');

      col.insert({"nombre":nombre, "cookie":cookie}, function() {db.close();});
    }
  });
}

function delete_cookie(cookie) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if(!err) {
      var col = db.collection('logins');

      col.remove({"cookie":cookie}, function() {db.close();});
    }
  });

}

function get_session_data(cookie, aftercall) {
  var datos;
  MongoClient.connect(constants.mongourl, function(err, db)
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
          aftercall(items[0]);
        }
        db.close();
      });
    }
  });

  return datos;
}

function insert_name_entry(nombre, apellido, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db)
  {
    if(err)
    {
      console.log("ha habido un error");
      res.send('La DB ha petado');
    }
    else
    {
      var col = db.collection('insultos');
      col.insert({"nombre":nombre,"insulto":apellido},function(){db.close();});
      aftercall();
    }
  });
}

function delete_name_entries(aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db)
  {
    if(err)
    {
      console.log("ha habido un error");
      res.send('La DB ha petado');
    }
    else
    {
      var col = db.collection('insultos');
      col.remove({}, function() {db.close();});
      aftercall();
    }
  });
}

function register_user(nombre, codigo, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if(!err) {
      var users = db.collection('users');
      var temporal = db.collection('temporal_register');

      temporal.find({"_id":nombre}).toArray(function(err, item)
      {
        console.log(item[0]);
        if(!err && item[0]["hash"]==codigo) {
          users.insert({"_id":nombre,"pass":item[0]["pass"],"avatar":constants.def_avatar,"description":constants.def_description},function(error, result){
            if ( error ) console.log ( error );
            temporal.remove({"_id":nombre}, function() {db.close();});
          });
        }
      });
      //tiene que hacer un aftercall para que te mande a algun sitio
      aftercall();
    }
  });
}

function temporal_registration(nombre, pass, req, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if(!err) {
      var col = db.collection('temporal_register');
      var hash = Math.random().toString();
      var hostname = req.headers.host; // hostname = 'localhost:8080'
      var url = 'http://' + hostname + '/register_user?user=' + nombre +'&code='+ hash;
      //falta comprobar que no este ya registrado
      col.insert({"_id":nombre,"created": new Date(),"pass":pass,"hash":hash},function(error, result){
        if ( error )
          console.log ( error );
        else {
          let mailOptions = {
              from: '"Redefine" <redefine@gmail.com>', // sender address
              to: nombre, // list of receivers
              subject: 'Activar cuenta', // Subject line
              text: 'Clica en el siguiente enlace para activar tu cuenta', // plain text body
              html: '<p>Clica en el siguiente enlace para activar tu cuenta</p><a href=\"'+url+'\">Activar cuenta/a>' // html body
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
      //tiene que hacer un aftercall para que te mande a algun sitio
      aftercall();
    }
  });
}

function get_user(nombre, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if(!err) {
      var col = db.collection('users');

      col.find({"_id":nombre}).toArray(function(error, result){
        if ( error ) console.log ( error );
        db.close();
        aftercall(result);
      });
    }
  });

}

function set_user_data(nombre, avatar, description, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if(!err) {
      var col = db.collection('users');

      col.update({"_id":nombre}, {$set: {"avatar":avatar, "description":description}}, function(error, result){
        if ( error ) console.log ( error );
        db.close();
        aftercall();
      });
    }
  });

}

function add_content(content, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if(!err) {
      var col = db.collection('content');

      col.insert(content,function(error, result){
        if ( error ) console.log ( error );
        db.close();
      });
      //tiene que hacer un aftercall para que te mande a algun sitio
      aftercall();
    }
  });
}

function get_all_content(aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db)
  {
    if(err)
    {console.log("ha habido un error");}
    else
    {
      var col = db.collection('content');
      col.find({}).toArray(function(err, items)
      {
        if(err)
        {console.log("error, ha cascao")}
        else{
          aftercall(items);
        }
        db.close();
      });
    }
  });
}

function get_user_content(nombre, aftercall) {
  MongoClient.connect(constants.mongourl, function(err, db)
  {
    if(err)
    {console.log("ha habido un error");}
    else
    {
      var col = db.collection('content');
      col.find({"autor":nombre}).toArray(function(err, items)
      {
        if(err)
        {console.log("error, ha cascao")}
        else{
          aftercall(items);
        }
        db.close();
      });
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
