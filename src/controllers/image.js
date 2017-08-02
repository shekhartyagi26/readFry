import BaseAPIController from "./BaseAPIController";
import { successResponse } from "../modules/generic";
import { SUCCESS, ERROR } from "../modules/constant";

export class ImageController extends BaseAPIController {
    profileImage = (req, res) => {
        let UserModel = req.User;
        let { access_token } = req.body
        if (access_token && req.file) {
            let path_name = req.file.originalname
            let type = req.file.mimetype
            let data = { "access_token": access_token };
            UserModel.findOneAndUpdate(data, { $set: { profilePicture: req.file }, returnNewDocument: true, upsert: true }, (err, insertData) => {
                if (err) {
                    res.status(ERROR);
                    res.json(successResponse(ERROR, err, 'Error.'));
                } else {
                    if (insertData) {
                        res.status(SUCCESS);
                        res.json(successResponse(SUCCESS, {}, 'Image Upload Successfully.'));
                    } else {
                        res.status(ERROR);
                        res.json(successResponse(ERROR, {}, 'Invalid access token.'));
                    }
                }
            });
        } else {
            res.status(ERROR)
            res.json(successResponse(ERROR, {}, 'Some parameter missing.'));
        }
    }
}

const controller = new ImageController();
export default controller;