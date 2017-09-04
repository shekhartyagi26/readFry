import article from "../controllers/article";
import auth from "../middleware/auth";
import multer from "multer";
import { STORAGE } from "../modules/image";

export default (app) => {

    /* Route for get interest */
    // app.route("/article").get(auth.requiresLogin, interest.getInterest);

    /* Route for save Article */
    app.route("/article").post(auth.requiresLogin, multer({ storage: STORAGE('article') }).single('file'), article.saveArticle);

    return app;
};