import profile from "../controllers/profile";
// import image from "../controllers/image";
import auth from "../middleware/auth";
// import mkdirp from "mkdirp";
// import multer from "multer";
// import Grid from "gridfs-stream";
// import path from "path";
// import md5 from "md5";

// export default (app) => {

//     var storage = multer.diskStorage({
//         destination: function(req, file, callback) {
//             let dest = 'uploads/profile';
//             mkdirp.sync(dest);
//             callback(null, dest);
//         },
//         filename: function(req, file, callback) {
//             var fileUniquename = Date.now();
//             callback(null, fileUniquename + path.extname(file.originalname));
//         }
//     });
//     var upload = multer({ storage: storage });

//     app.post('/profile', upload.single('file'), image.profileImage);

//     /* Route for get profile */
//     // app.route("/profile").get(auth.requiresLogin, profile.get);

//     // Route for edit profile 
//     app.post('/profile', upload.single('file'), function(req, res) {
//         console.log(req.file);
//     });
//     // app.post("/profile").post(auth.requiresLogin, upload.single('file'), profile.edit);
//     return app;
// };

import image from "../controllers/image";
import mkdirp from "mkdirp";
import multer from "multer";
import Grid from "gridfs-stream";
import path from "path";
import md5 from "md5";

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
    app.post('/profile', auth.requiresLogin, upload.single('file'), profile.edit)

    /* Route for get profile */
    app.route("/profile").get(auth.requiresLogin, profile.get);

    return app;
};