import BaseAPIController from "./BaseAPIController";
import { successResponse } from "../modules/generic";
import { SUCCESS, ERROR } from "../modules/constant";
import _ from "lodash";

export class ImageController extends BaseAPIController {
    getFollow = (req, res) => {
        let { user_id } = req.params;
        if (user_id) {
            req.User.findOne({ _id: user_id }, { "_id": 1, "follow": 1, "followers": 1 }, function(err, result) {
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
        let { access_token } = req.headers;
        let { followers_id } = req.body;
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

    getOtherUserProfile = (req, res) => {
        let { user_id } = req.params;
        if (user_id) {
            req.User.findOne({ _id: user_id }, { "_id": 1, "user_name": 1, "follow": 1, "following": 1, "profession": 1, "email": 1, "bio": 1, "post": 1, "profilePicture.path": 1 }, function(err, result) {
                if (err) {
                    res.status(ERROR);
                    res.json(successResponse(ERROR, err, 'Error.'));
                } else {
                    let resp = {};

                    // console.log(result.get('follow').length)
                    resp.user_name = result.get('user_name') || "";

                    resp.profile_picture = result.get('profilePicture').path || "";
                    resp.profession = result.get('profession') || "";
                    resp.bio = result.get('bio') || "";
                    resp.email = result.get('email') || "";
                    resp.number_of_post = result.get('post') && result.get('post').length || 0;
                    resp.number_of_following = result.get('following') && result.get('following').length || 0;
                    resp.number_of_follower = result.get('follow') && result.get('follow').length || 0;
                    res.status(SUCCESS);
                    res.json(successResponse(SUCCESS, resp, 'Get Other User Profile Successfully.'));
                }
            })
        } else {
            res.status(ERROR)
            res.json(successResponse(ERROR, {}, 'UserId missing.'));
        }
    }

}

const controller = new ImageController();
export default controller;