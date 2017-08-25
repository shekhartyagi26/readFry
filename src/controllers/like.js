import { DELETE_IMAGE, DEFAULT_FILE } from "../modules/image";
import { successResult, serverError, parameterMissing, validate, timeStamp } from "../modules/generic";
import { BAD_REQUEST_STATUS, SUCCESS_STATUS, PARAMETER_MISSING_STATUS } from '../constant/status';
import { INVALID_POSTID, INVALID_USERID, INVALID_LIKERID } from '../constant/message';
import BaseAPIController from "./BaseAPIController";
import Post from "../models/Post.js";
import _ from "lodash";
export class postController extends BaseAPIController {
    
    likeUnlike = (req, res) => {
        let { liker_id, post_id } = req.body;
        let data = validate({ liker_id, post_id });
        if (data.status) {
            Post.findOne(req.User, { _id: liker_id }).then((result) => {
                if (result) {
                    Post.findOne(req.Post, { post_id }).then((post) => {
                        if (post) {
                            let likes = post.get('like') || [];
                            let haslikerId = likes.some(likes => likes['liker_id'] === liker_id)
                            if (haslikerId) {
                                data = { $pull: { like: { liker_id: '599e5e90b7606a131e41afc6' } } };
                            } else {
                                let resp = {};
                                resp.liker_id = liker_id;
                                resp.created_at = new Date();
                                resp.created_timestamp = timeStamp();
                                data = { $addToSet: { like: resp } };
                            }
                            Post.updateOne(req.Post, { post_id }, data).then((response) => {
                                res.status(SUCCESS_STATUS).json(successResult());
                            }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
                        } else {
                            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_POSTID));
                        }
                    }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
                } else {
                    res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_LIKERID));
                }
            }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
        } else {
            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
        }
    }

    // editPost = (req, res) => {
    //     let { caption } = req.body;
    //     let { post_id } = req.params;
    //     let data = validate({ caption, post_id });
    //     if (data.status) {
    //         Post.update(req.post, { post_id }, data.data).then((result) => {
    //             if (result) {
    //                 res.status(SUCCESS_STATUS).json(successResult(result));
    //             } else {
    //                 res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_POSTID));
    //             }
    //         }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
    //     } else {
    //         res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
    //     }
    // }

    // getPost = (req, res) => {
    //     let { post_id } = req.params;
    //     let data = validate({ post_id });
    //     if (data.status) {
    //         Post.findOne(req.post, post_id).then((result) => {
    //             if (!result) {
    //                 res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_POSTID));
    //             } else {
    //                 res.status(SUCCESS_STATUS).json(successResult(result));
    //             }
    //         }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
    //     } else {
    //         res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
    //     }
    // }

    // deletePost = (req, res) => {
    //     let { post_id } = req.params;
    //     let data = validate({ post_id });
    //     if (data.status) {
    //         Post.findOne(req.post, post_id).then((result) => {
    //             if (!result) {
    //                 res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_POSTID));
    //             } else {
    //                 result.remove();
    //                 res.status(SUCCESS_STATUS).json(successResult());
    //             }
    //         }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
    //     } else {
    //         res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
    //     }
    // }

    // postByUser = (req, res) => {
    //     let { user_id } = req.params;
    //     let data = validate({ user_id });
    //     if (data.status) {
    //         User.find(req.post, user_id).then((result) => {
    //             if (!result) {
    //                 res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_USERID));
    //             } else {
    //                 res.status(SUCCESS_STATUS).json(successResult(result));
    //             }
    //         }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
    //     } else {
    //         res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
    //     }
    // }

}

const controller = new postController();
export default controller;