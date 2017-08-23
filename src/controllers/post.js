import { DELETE_IMAGE, DEFAULT_FILE } from "../modules/image";
import { successResult, serverError, parameterMissing, validate } from "../modules/generic";
import { BAD_REQUEST_STATUS, SUCCESS_STATUS, PARAMETER_MISSING_STATUS } from '../constant/status';
import { INVALID_POSTID, INVALID_USERID } from '../constant/message';
import BaseAPIController from "./BaseAPIController";
import Post from "../models/Post.js";

export class postController extends BaseAPIController {
    createPost = (req, res) => {
        if (req.file) {
            let { caption } = req.body;
            let data = req.file ? DEFAULT_FILE(req.file) : data = {};
            data.user_id = req.user._id;
            data.caption = caption || '';
            Post.save(req.post, data).then((result) => {
                res.status(SUCCESS_STATUS).json(successResult(result))
            }).catch((e) => {
                DELETE_IMAGE(req.actual_path);
                res.status(BAD_REQUEST_STATUS).json(serverError(e));
            });
        } else {
            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing());
        }
    }

    editPost = (req, res) => {
        let { caption } = req.body;
        let { post_id } = req.params;
        let data = validate({ caption, post_id });
        if (data.status) {
            Post.update(req.post, { post_id }, data.data).then((result) => {
                if (result) {
                    res.status(SUCCESS_STATUS).json(successResult(result));
                } else {
                    res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_POSTID));
                }
            }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
        } else {
            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
        }
    }

    getPost = (req, res) => {
        let { post_id } = req.params;
        let data = validate({ post_id });
        if (data.status) {
            Post.findOne(req.post, post_id).then((result) => {
                if (!result) {
                    res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_POSTID));
                } else {
                    res.status(SUCCESS_STATUS).json(successResult(result));
                }
            }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
        } else {
            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
        }
    }

    deletePost = (req, res) => {
        let { post_id } = req.params;
        let data = validate({ post_id });
        if (data.status) {
            Post.findOne(req.post, post_id).then((result) => {
                if (!result) {
                    res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_POSTID));
                } else {
                    result.remove();
                    res.status(SUCCESS_STATUS).json(successResult());
                }
            }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
        } else {
            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
        }
    }

    postByUser = (req, res) => {
        let { user_id } = req.params;
        let data = validate({ user_id });
        if (data.status) {
            User.find(req.post, user_id).then((result) => {
                if (!result) {
                    res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_USERID));
                } else {
                    res.status(SUCCESS_STATUS).json(successResult(result));
                }
            }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
        } else {
            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
        }
    }

}

const controller = new postController();
export default controller;