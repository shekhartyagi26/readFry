import BaseAPIController from "./BaseAPIController";
import { successResponse } from "../modules/generic";
// var gfs = require('gridfs-stream');

export class ImageController extends BaseAPIController {
    profileImage = (req, res) => {
        console.log(req.file);
        var path = req.file.path
        var path_name = req.file.originalname
        res.json()
    }
}

const controller = new ImageController();
export default controller;