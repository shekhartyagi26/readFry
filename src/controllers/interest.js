import BaseAPIController from "./BaseAPIController";
import User from "../models/User.js";
import Topics from "../models/IntrestingTopics.js";
import { successResult, serverError } from "../modules/generic";
import _ from "lodash";
import { BAD_REQUEST_STATUS, SUCCESS_STATUS } from '../constant/status';

export class intresetController extends BaseAPIController {

    /*Controller for get interest*/
    getInterest = (req, res) => {
        Topics.findOne(req.Interest, {}).then((topic) => {
            res.status(SUCCESS_STATUS).json(successResult(topic.get('interests')))
        }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)); });
    }

    /*Controller for save intreset*/
    saveInterest = (req, res) => {
        let { access_token } = req.headers;
        let { list } = req.body;
        let UserModel = req.User;
        list = (!list && !Array.isArray(list)) ? list = [] : list;
        User.update(UserModel, { access_token }, { user_interest: list }).then((insertData) => {
            res.status(SUCCESS_STATUS).json(successResult());
        }).catch((e) => { res.status(BAD_REQUEST_STATUS).json(serverError(e)) });
    }
}

const controller = new intresetController();
export default controller;