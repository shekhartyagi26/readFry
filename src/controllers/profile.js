import BaseAPIController from "./BaseAPIController";
import { successResult } from "../modules/generic";
import { SUCCESS_STATUS } from "../constant/status";

export class profileController extends BaseAPIController {
    get = (req, res) => {
        let user = req.user;
        let result = {};
        result.profile_picture = user.get('profile_picture') && user.get('profile_picture').path || "";
        result.profile_picture_format = user.get('profile_picture') && user.get('profile_picture').profile_picture_format || 0;
        result.user_name = user.get('user_name') || "";
        result.full_name = user.get('full_name') || "";
        result.profession = user.get('profession') || "";
        result.mobile = user.get('mobile') || "";
        result.country_code = user.get('country_code') || "";
        result.dob = user.get('dob') || "";
        result.bio = user.get('bio') || "";
        res.status(SUCCESS_STATUS).json(successResult(result))
    }
}

const controller = new profileController();
export default controller;