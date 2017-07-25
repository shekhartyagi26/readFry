import user from "../controllers/user";

export default (app) => {
    /* Route for User Register  */
    app.route("/user/create").post(user.create);

    /* Route for login */
    app.route("/user/login").post(user.login);
    return app;
};