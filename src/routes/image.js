import image from "../controllers/image";
import mkdirp from "mkdirp";
import multer from "multer";
import path from "path";
import { STORAGE } from "../modules/image";

export default (app) => {

    app.post('/upload/profileImage', multer({ storage: STORAGE('profile') }).single('file'), image.profileImage);

    return app;
};