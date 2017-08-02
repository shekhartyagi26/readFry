import BaseAPIController from "./BaseAPIController";
import { successResponse } from "../modules/generic";
var gfs = require('gridfs-stream');
var multer = require('multer');

export class ImageController extends BaseAPIController {
    profileImage = (req, res) => {
        console.log(req.files)
        // console.log('*****************************')
        // console.log('req.files')
        // upload(req, res, function(err) {
        //     if (err) {
        //         res.redirect(req.headers.referer + "/error.html");
        //         return;
        //     }

        //     if (!req.files) {
        //         res.redirect(req.headers.referer + "/error.html");
        //         return;
        //     } else {
        //         //Implement your own logic if needed. Like moving the file, renaming the file, etc.
        //         res.redirect(req.headers.referer);
        //     }
        // });
        // console.log('*****************************')
    }
}

const controller = new ImageController();
export default controller;