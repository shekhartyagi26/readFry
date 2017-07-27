import user from "../controllers/user";

export default (app) => {
    /* Route for User Register  */
    app.route("/user/create").post(user.create);

    /* Route for login */
    app.route("/user/login").post(user.login);

    /* Route for create Account */
    app.route("/user/create_account").post(user.create_account);

    return app;
};