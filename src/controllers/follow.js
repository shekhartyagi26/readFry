import BaseAPIController from "./BaseAPIController";
import { successResponse } from "../modules/generic";
import { SUCCESS, ERROR } from "../modules/constant";
import _ from "lodash";

export class ImageController extends BaseAPIController {
    getFollow = (req, res) => {
        let { UserId } = req.params;
        if (UserId) {
            req.User.findOne({ _id: UserId }, { "_id": 1, "follow": 1, "followers": 1 }, function(err, result) {
                if (err) {
                    res.status(ERROR);
                    res.json(successResponse(ERROR, err, 'Error.'));
                } else {
                    res.status(SUCCESS);
                    res.json(successResponse(SUCCESS, result, 'Get Followers Successfully.'));
                }
            })
        } else {
            res.status(ERROR)
            res.json(successResponse(ERROR, {}, 'UserId missing.'));
        }
    }

    postFollow = (req, res) => {
        let { access_token, followers_id } = req.body;
        let UserModel = req.User;
        if (access_token && followers_id && Array.isArray(followers_id)) {
            _.each(followers_id, (val, key) => {
                let where = { "$addToSet": { "follow": val }, returnNewDocument: true };
                UserModel.findOneAndUpdate({ access_token: access_token }, where).exec((err, insertData) => {
                    if (err) {
                        res.status(ERROR)
                        res.json(successResponse(ERROR, err, 'Error.'));
                    } else {
                        if (insertData) {
                            if (key == (_.size(followers_id) - 1)) {
                                res.status(SUCCESS);
                                res.json(successResponse(SUCCESS, {}, 'Followers Add Successfully.'));
                            }
                        } else {
                            res.status(ERROR);
                            res.json(successResponse(ERROR, {}, 'access_token not found.'));
                        }

                    }
                });
            })
        } else {
            res.status(ERROR)
            res.json(successResponse(ERROR, {}, 'access_token missing.'));
        }
    }
}

const controller = new ImageController();
export default controller;