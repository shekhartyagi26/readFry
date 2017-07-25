import mongoose from "mongoose";
let conn = mongoose.createConnection("mongodb://localhost/mipoty");
// the middleware function
module.exports = function() {
    // create schema
    let model_schema_user = mongoose.Schema({}, {
        strict: false,
        collection: 'users'
    });
    let CollectionModel_user = conn.model('users', model_schema_user);
    return function(req, res, next) {
        req.users = CollectionModel_user;
        next();
    };
};