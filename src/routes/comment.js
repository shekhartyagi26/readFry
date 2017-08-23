import comment from "../controllers/comment";
import auth from "../middleware/auth";

export default (app) => {
    /*route for create comment*/
    app.post('/comment', auth.requiresLogin, comment.createComment);

    /*route for edit comment*/
    app.put('/comment/:comment_id', auth.requiresLogin, comment.editComment);

    /*route for get comment*/
    app.get('/comment/:comment_id', auth.requiresLogin, comment.getComment);

    /*route for delete comment*/
    app.delete('/comment/:comment_id', auth.requiresLogin, comment.deleteComment);

    /*route for get comment on post*/
    app.get('/comment/commentOnPost/:post_id', auth.requiresLogin, comment.commentOnPost);

    /*route for get comment by user*/
    app.get('/comment/commentByUser/:user_id', auth.requiresLogin, comment.commentByUser);

    return app;
};