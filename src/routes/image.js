import image from "../controllers/image";
var multer = require('multer');
var Grid = require('gridfs-stream');
var upload = multer({ dest: 'uploads/' });
export default (app) => {

    /* Route for create UserName */
    app.route("/upload/profileImage").post(image.profileImage);
    // app.route('/upload/profileImage', upload.any(), function(req, res) {
    //     var conn = mongoose.connection;

    //     Grid.mongo = mongoose.mongo;
    //     var path = req.files[0].path
    //     var path_name = req.files[0].originalname
    //     var gfs = Grid(conn.db);
    //     var writestream = gfs.createWriteStream({
    //         filename: path_name
    //     });
    //     fs.createReadStream(path).pipe(writestream);
    //     writestream.on('close', function(file) {
    //         res.json(file.filename + 'Written To DB');
    //         fs.unlink(req.files[0].path, function() {
    //             res.json({ id: file._id, message: "success" });
    //         });
    //     });
    // })

    return app;
};