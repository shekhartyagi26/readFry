import crypto from "crypto";
import * as BaseProvider from "./BaseProvider";
import util from "util";
import _ from "lodash";

/* Provider for User Registration */
const create = (body) => {
    return new Promise((resolve, reject) => {
        if (!body.email || !body.userName || !body.fullName || !body.mobileNumber || !body.profilePicture || !body.password || !body.profession || !body.website || !body.age || !body.bio) {
            reject('parameters missing');
        } else {
            resolve(body);
        }
    });
};
const checkBlank = function(arr, req, res) {
    return new Promise((resolve, reject) => {
        _.map(arr, (val, key) => {
            if (val == '' || val === "" || val == undefined) {
                reject('Some parameters missing');
            } else {
                if (key == (_.size(arr) - 1)) {
                    resolve('done');
                }
            }
        })
    })
};

/* Provider for User login */
const login = (model, body) => {
    let password = crypto.createHash("sha256").update(body.password).digest("base64");
    delete body.confirm_password;
    return { ...body,
        ...{
            password
        }
    };
};

export default {
    ...BaseProvider,
    create,
    checkBlank,
    login,
};