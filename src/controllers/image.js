import BaseAPIController from "./BaseAPIController";
import { successResponse } from "../modules/generic";
import { SUCCESS, ERROR } from "../modules/constant";
var fs = require('fs');

export class ImageController extends BaseAPIController {
    profileImage = (req, res) => {
        let UserModel = req.User;
        let { access_token } = req.body
        if (access_token && req.file) {
            let path_name = req.file.originalname
            let type = req.file.mimetype
            let data = { "access_token": access_token };
            UserModel.findOneAndUpdate(data, { $set: { profilePicture: req.file, status: 3 }, returnNewDocument: true, upsert: true }, (err, insertData) => {
                if (err) {
                    res.status(ERROR);
                    res.json(successResponse(ERROR, err, 'Error.'));
                } else {
                    if (insertData) {
                        res.status(SUCCESS);
                        data.file = req.file;
                        data.status = 3;
                        res.json(successResponse(SUCCESS, data, 'Image Upload Successfully.'));
                    } else {
                        res.status(ERROR);
                        res.json(successResponse(ERROR, {}, 'Invalid access token.'));
                    }
                }
            });
        } else {
            if (req.file) {
                fs.unlink(req.file.path, function() {
                    res.status(ERROR)
                    res.json(successResponse(ERROR, {}, 'Invalid Token.'));
                })
            } else {
                res.status(ERROR)
                res.json(successResponse(ERROR, {}, 'Please Attach Image or Video.'));
            }
        }
    }
}

const controller = new ImageController();
export default controller;