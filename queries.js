var MongoClient = require('mongodb').MongoClient;
var constants = require('./constants');

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

  function register_user(nombre, pass) {
    MongoClient.connect(constants.mongourl, function(err, db) {
      if(!err) {
        var col = db.collection('users');

        col.insert({"nombre":nombre,"pass":pass},function(){db.close();});
        //tiene que hacer un aftercall para que te mande a algun sitio
      }
    });

  }
}

module.exports.insert_cookie = insert_cookie;
module.exports.delete_cookie = delete_cookie;
module.exports.get_session_data = get_session_data;
module.exports.insert_name_entry = insert_name_entry;
module.exports.delete_name_entries = delete_name_entries;
