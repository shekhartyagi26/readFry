import image from "../controllers/image";
var multer = require('multer');
var Grid = require('gridfs-stream');
var path = require('path');
var md5 = require('md5');

export default (app) => {
    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, 'uploads');
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