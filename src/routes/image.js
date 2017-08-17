import image from "../controllers/image";
import mkdirp from "mkdirp";
import multer from "multer";
import path from "path";

export default (app) => {
    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            let dest = 'uploads/profile';
            mkdirp.sync(dest);
            callback(null, dest);
        },
        filename: function(req, file, callback) {
            var fileUniquename = Date.now();
            callback(null, fileUniquename + path.extname(file.originalname));
        }
    });
    var upload = multer({ storage: storage });

    app.post('/upload/profileImage', upload.single('file'), image.profileImage);

    return app;
};