import mongoose from "mongoose";
let conn = mongoose.createConnection("mongodb://localhost/read_fry");
// the middleware function
module.exports = function() {
    // create schema
    let model_schema_user = mongoose.Schema({}, {
        strict: false,
        collection: 'user'
    });
    let collection_model_user = conn.model('user', model_schema_user);

    // let model_schema_image = mongoose.Schema({}, {
    //     strict: false,
    //     collection: 'image'
    // });
    // let collection_model_image = conn.model('image', model_schema_image);


    let model_interest = mongoose.Schema({}, {
        strict: false,
        collection: 'interest'
    });
    let collection_model_interest = conn.model('interest', model_interest);

    /*model for user_post*/
    let model_article = mongoose.Schema({}, {
        strict: false,
        collection: 'article'
    });
    let collection_model_article = conn.model('post', model_article);

    // /*model for comment*/
    // let model_comment = mongoose.Schema({}, {
    //     strict: false,
    //     collection: 'comment'
    // });
    // let collection_model_comment = conn.model('comment', model_comment);

    // /*model for like*/
    // let model_like = mongoose.Schema({}, {
    //     strict: false,
    //     collection: 'like'
    // });
    // let collection_model_like = conn.model('like', model_like);

    return function(req, res, next) {
        req.User = collection_model_user;
        // req.Image = collection_model_image;
        req.Interest = collection_model_interest;
        req.Article = collection_model_article;
        // req.Comment = collection_model_comment;
        // req.Like = collection_model_like;
        next();
    };
};