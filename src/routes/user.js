import user from "../controllers/user";

export default (app) => {
    /* Route for User Register  */
    app.route("/user/create").post(user.create);

    /* Route for login */
    app.route("/user/login").post(user.login);

    /* Route for create Account */
    app.route("/user/create_account").post(user.create_account);

    /* Route for forgot Password */
    app.route("/user/forgot_password").post(user.forgot_password);

    /* Route for verify OTP */
    app.route("/user/verify").post(user.verify);

    /* Route for verify OTP */
    app.route("/user/createUserName").post(user.createUserName);

    return app;
};