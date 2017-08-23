import mongoose from "mongoose";
let conn = mongoose.createConnection("mongodb://localhost/mipoty");
// the middleware function
module.exports = function() {
    // create schema
    let model_schema_user = mongoose.Schema({}, {
        strict: false,
        collection: 'user'
    });
    let collection_model_user = conn.model('user', model_schema_user);

    let model_schema_image = mongoose.Schema({}, {
        strict: false,
        collection: 'image'
    });
    let collection_model_image = conn.model('image', model_schema_image);


    let model_intresting_topics = mongoose.Schema({}, {
        strict: false,
        collection: 'intresting_topics'
    });
    let collection_model_intresting_topics = conn.model('intresting_topics', model_intresting_topics);

    /*model for user_post*/
    let model_post = mongoose.Schema({}, {
        strict: false,
        collection: 'post'
    });
    let collection_model_post = conn.model('post', model_post);

    /*model for comment*/
    let model_comment = mongoose.Schema({}, {
        strict: false,
        collection: 'comment'
    });
    let collection_model_comment = conn.model('comment', model_comment);

    /*model for like*/
    let model_like = mongoose.Schema({}, {
        strict: false,
        collection: 'like'
    });
    let collection_model_like = conn.model('like', model_like);

    return function(req, res, next) {
        req.User = collection_model_user;
        req.Image = collection_model_image;
        req.Intresting_topics = collection_model_intresting_topics;
        req.Post = collection_model_post;
        req.comment = collection_model_comment;
        req.like = collection_model_like;
        next();
    };
};