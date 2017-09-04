import user from "../controllers/user";
import auth from "../middleware/auth";
import multer from "multer";
import { STORAGE } from "../modules/image";

export default (app) => {

    /* Route for login */
    app.route("/user/login").post(user.login);

    /* Route for create Account */
    app.route("/user/create").post(user.create);

    /* Route for forgot Password */
    app.route("/user/forgotPassword").post(user.forgotPassword);

    /* Route for verify email */
    app.route("/user/verifyEmail").post(user.verifyEmail);

    /* Route for reset Password */
    app.route("/user/resetPassword").post(user.resetPassword);

    /* Route for logout */
    app.route("/user/logout").post(auth.requiresLogin, user.logout);

    /*Route for upload profile picture and edit profile*/
    app.post('/user/editProfile', auth.requiresLogin, multer({ storage: STORAGE('profile') }).single('file'), user.editProfile)

    return app;
};
