import mongoose from "mongoose";
let conn = mongoose.createConnection("mongodb://localhost/mipoty");
// the middleware function
module.exports = function() {
    // create schema
    let model_schema_user = mongoose.Schema({}, {
        strict: false,
        collection: 'User'
    });
    let CollectionModel_user = conn.model('User', model_schema_user);

    let model_schema_image = mongoose.Schema({}, {
        strict: false,
        collection: 'Image'
    });
    let CollectionModel_Image = conn.model('Image', model_schema_image);


    let model_intresting_topics = mongoose.Schema({}, {
        strict: false,
        collection: 'intresting_topics'
    });
    let CollectionModel_intresting_topics = conn.model('intresting_topics', model_intresting_topics);

    return function(req, res, next) {
        req.User = CollectionModel_user;
        req.Image = CollectionModel_Image;
        req.Intresting_topics = CollectionModel_intresting_topics
        next();
    };
};