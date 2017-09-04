import BaseAPIController from "./BaseAPIController";
import User from "../models/User.js";
import Topics from "../models/IntrestingTopics.js";
import { successResult, serverError, verifyData } from "../modules/generic";
import _ from "lodash";
import { BAD_REQUEST_STATUS, SUCCESS_STATUS } from '../constant/status';

export class articleController extends BaseAPIController {
    saveArticle = (req, res) => {
        let user_id = req.user._id;
        const ArticleModel = req.Article;
        let { subject, content } = req.body;
        let data = req.file ? DEFAULT_FILE(req.file) : data = {};
        data.created_on = new Date();
        data.timestamp = new Date().getTime();
        console.log('===============')
        console.log(data)
        console.log('===============')
        let verifiedData = verifyData({ subject, content });
        verifiedData = _.merge(data, verifiedData)
        console.log(verifiedData)
        // User.update(ArticleModel, { access_token }, verifiedData).then((result) => {
        //     res.status(SUCCESS_STATUS).json(successResult(result))
        // }).catch((e) => {
        //     DELETE_IMAGE(req.actual_path);
        //     res.status(BAD_REQUEST_STATUS).json(serverError(e));
        // });
    }
}
const controller = new articleController();
export default controller;