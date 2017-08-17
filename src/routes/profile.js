import profile from "../controllers/profile";
import auth from "../middleware/auth";

export default (app) => {

    /* Route for get profile */
    app.route("/profile/:id").get(auth.requiresLogin, profile.get);


    return app;
};