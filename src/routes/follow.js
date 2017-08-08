import follow from "../controllers/follow";

export default (app) => {

    /* Route for login */
    app.route("/follow/getFollow/:user_id").get(follow.getFollow);

      /* Route for login */
    app.route("/follow/postFollow").post(follow.postFollow);

      /* Route for login */
    app.route("/follow/getOtherUserProfile/:user_id").get(follow.getOtherUserProfile);
    return app;
};