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

module.exports.insert_cookie = insert_cookie;
module.exports.delete_cookie = delete_cookie;
