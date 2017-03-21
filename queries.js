var MongoClient = require('mongodb').MongoClient;
var constants = require('./constants');

function insert_cookie(nombre, cookie) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if(!err) {
      var col = db.collection('logins');

      col.insert({"nombre":nombre, "cookie":cookie});
    }
  });
}

function delete_cookie(cookie) {
  MongoClient.connect(constants.mongourl, function(err, db) {
    if(!err) {
      var col = db.collection('logins');

      col.remove({"cookie":cookie});
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
      });
    }
  });

  return datos;
}

module.exports.insert_cookie = insert_cookie;
module.exports.delete_cookie = delete_cookie;
module.exports.get_session_data = get_session_data;
