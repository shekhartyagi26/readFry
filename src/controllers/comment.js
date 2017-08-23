import { successResult, serverError, parameterMissing, validate, createUniqueId, timeStamp } from "../modules/generic";
import { BAD_REQUEST_STATUS, SUCCESS_STATUS, PARAMETER_MISSING_STATUS } from '../constant/status';
import { INVALID_POSTID, INVALID_COMMENTID, INVALID_USERID } from '../constant/message';
import BaseAPIController from "./BaseAPIController";
import User from "../models/User.js";

export class postController extends BaseAPIController {

    createComment = (req, res) => {
        let { post_id, comment, comment_by_id } = req.body;
        let data = validate({ post_id, comment })
        if (data.status) {
            User.findOne(req.post, { post_id }).then((result) => {
                if (result) {
                    data = data.data;
                    data.user_id = req.user._id;
                    data.comment_id = createUniqueId('comment');
                    data.post_id = post_id;
                    data.comment = comment;
                    data.created_at = new Date();
                    data.created_timestamp = timeStamp();
                    data.comment_by_id = comment_by_id;
                    User.save(req.comment, data).then((result) => {
                        res.status(SUCCESS_STATUS).json(successResult(result))
                    }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
                } else {
                    res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_POSTID));
                }
            }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
        } else {
            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
        }
    }

    editComment = (req, res) => {
        let { comment } = req.body;
        let { comment_id } = req.params;
        let data = validate({ comment_id, comment });
        if (data.status) {
            data = data.data;
            data.updated_at = new Date();
            data.update_timestamp = timeStamp();
            User.update(req.comment, { comment_id }, data).then((result) => {
                if (result) {
                    res.status(SUCCESS_STATUS).json(successResult(result));
                } else {
                    res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_COMMENTID));
                }
            }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
        } else {
            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
        }
    }

    getComment = (req, res) => {
        let { comment_id } = req.params;
        let data = validate({ comment_id });
        if (data.status) {
            User.findOne(req.comment, comment_id).then((result) => {
                if (!result) {
                    res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_COMMENTID));
                } else {
                    res.status(SUCCESS_STATUS).json(successResult(result));
                }
            }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
        } else {
            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
        }
    }

    deleteComment = (req, res) => {
        let { comment_id } = req.params;
        let data = validate({ comment_id });
        if (data.status) {
            User.findOne(req.comment, comment_id).then((result) => {
                if (!result) {
                    res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_COMMENTID));
                } else {
                    result.remove();
                    res.status(SUCCESS_STATUS).json(successResult(result));
                }
            }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
        } else {
            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
        }
    }


    commentOnPost = (req, res) => {
        let { post_id } = req.params;
        let data = validate({ post_id });
        if (data.status) {
            User.find(req.comment, post_id).then((result) => {
                if (!result || result.length == 0) {
                    res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(INVALID_POSTID));
                } else {
                    res.status(SUCCESS_STATUS).json(successResult(result));
                }
            }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
        } else {
            res.status(PARAMETER_MISSING_STATUS).json(parameterMissing(data.data));
        }
    }


    commentByUser = (req, res) => {
        let { user_id } = req.params;
        let data = validate({ user_id });
        if (data.status) {
            User.find(req.comment, user_id).then((result) => {
                if (!result || result.length == 0) {
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