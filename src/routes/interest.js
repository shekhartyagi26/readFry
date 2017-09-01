import interest from "../controllers/interest";
import auth from "../middleware/auth";

export default (app) => {

    /* Route for get interest */
    app.route("/interest").get(auth.requiresLogin, interest.getInterest);

    /* Route for save interest */
    app.route("/interest").post(auth.requiresLogin, interest.saveInterest);

    return app;
};