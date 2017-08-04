import follow from "../controllers/follow";

export default (app) => {

    /* Route for login */
    app.route("/follow/getFollow/:UserId").get(follow.getFollow);

      /* Route for login */
    app.route("/follow/postFollow").post(follow.postFollow);

    return app;
};