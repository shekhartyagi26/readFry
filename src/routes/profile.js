import profile from "../controllers/profile";
import auth from "../middleware/auth";

export default (app) => {

    /* Route for get profile */
    app.route("/profile").get(auth.requiresLogin, profile.get);

    /* Route for edit profile */
    // app.route("/profile").post(auth.requiresLogin, profile.post);

    return app;
};