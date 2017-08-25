import post from "../controllers/post";
import auth from "../middleware/auth";
import multer from "multer";
import { STORAGE } from "../modules/image";

export default (app) => {
    /*route for create post*/
    app.post('/post', auth.requiresLogin, multer({ storage: STORAGE('post') }).single('file'), post.createPost);

    /*route for edit post*/
    app.put('/post/:post_id', auth.requiresLogin, post.editPost);

    /*route for get post*/
    // app.get('/post/:post_id', auth.requiresLogin, post.getPost);

    /*route for delete post*/
    app.delete('/post/:post_id', auth.requiresLogin, post.deletePost);

    /*route for get post by user*/
    app.get('/post/postByUser/:user_id', auth.requiresLogin, post.postByUser);

    /*route for get all user post*/
    app.get('/post/getAllPost', auth.requiresLogin, post.getAllPost);
    return app;
};