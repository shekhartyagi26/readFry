import BaseAPIController from "./BaseAPIController";
import UserProvider from "../providers/UserProvider.js";
import User from "../models/User.js";
import generatePassword from 'password-generator';
import crypto from 'crypto';
import config from "../../config.json";
import { getSuccess, notFoundError, serverError, getSuccessMessage, validateEmail, successResponse } from "../modules/generic";
import twilio from "../modules/twilio";
import mail from "../modules/mail";
import constant from "../models/constant";
import jwt from "jwt-simple";
import { encodeToken } from "../modules/token";
import token from "../modules/token";

export class UserController extends BaseAPIController {

    /* Controller for User Login  */
    login = (req, res) => {
        let { email, mobile, password } = req.body;
        let data = {};
        let UserModel = req.User;
        if (mobile && password) {
            data = { mobile: mobile }
        } else if (email && password) {
            data = { email: email }
        } else {
            res.status(100)
            res.json(successResponse(100, {}, 'Some parameter missing.'));
            return;
        }
        var md5 = crypto.createHash('md5');
        md5.update(password);
        var pass_md5 = md5.digest('hex');
        data.password = pass_md5
        User.findOne(UserModel, data)
            .then((user) => {
                if (user) {
                    let access_token = encodeToken(user._id)
                    UserModel.findOneAndUpdate(data, { $set: { "access_token": access_token }, returnNewDocument: true, upsert: true }, (err, insertData) => {
                        if (err) {
                            res.status(500);
                            res.json(successResponse(500, err, 'Error.'));
                        } else {
                            if (insertData) {
                                insertData.access_token = access_token;
                                delete insertData.get('password')
                                res.status(200);
                                res.json(successResponse(200, insertData, 'Logged in successfully.'));
                            } else {

                                res.status(101);
                                res.json(successResponse(101, {}, 'Invalid access token.'));
                            }
                        }
                    });
                } else {
                    res.status(201);
                    res.json(successResponse(201, {}, 'User not found.'));
                }
            }).catch((e) => {
                res.status(500);
                res.json(successResponse(500, e, 'Error.'));
            })
    }

    signUp = (req, res) => {
        var body = req.body;
        var user_details = body.user;
        let UserModel = req.User;
        if (!user_details) {
            res.status(100)
            res.json(successResponse(100, {}, 'Some parameter missing.'));
            return;
        }
        let data = {};
        let { mobile, email, password } = body.user;
        console.log(mobile, email, password)
        if (mobile && password) {
            data = { mobile: mobile }
        } else if (email && password) {
            data = { email: email }
        } else {
            res.status(100)
            res.json(successResponse(100, {}, 'Some parameter missing.'));
            return;
        }
        User.findOne(UserModel, data)
            .then((user) => {
                if (user) {
                    res.status(200)
                    res.json(successResponse(200, {}, 'User already exist.'));
                } else {
                    let md5 = crypto.createHash('md5');
                    md5.update(password);
                    let pass_md5 = md5.digest('hex');
                    user_details.password = pass_md5
                    user_details.created_on = new Date();
                    user_details.timeStamp = new Date().getTime();
                    user_details.is_verify = 0;
                    user_details.is_deleted = 0;
                    user_details.is_blocked = 0;
                    user_details.modified_on = new Date();
                    user_details.status = 1;
                    User.save(UserModel, user_details)
                        .then((userData) => {
                            let verification_code = Math.ceil(Math.random() * 10000);
                            let updatedData = { verification_code: verification_code }
                            updatedData.access_token = encodeToken(userData._id);
                            if (mobile) {
                                twilio.sendMessageTwilio(`your Mypoty verification code is: ${verification_code}`, '+918126724591')
                                    .then((result) => {
                                        User.update(UserModel, data, updatedData)
                                            .then((data) => {
                                                res.status(200)
                                                res.json(successResponse(200, { access_token: updatedData.access_token, status: 1, mobile: mobile }, 'An OTP has been sent,please verify.'));
                                            }).catch((e) => {
                                                res.status(500);
                                                res.json(successResponse(500, e, 'Error.'));
                                            })
                                    }).catch((e) => {
                                        res.status(500);
                                        res.json(successResponse(500, e, 'Error.'));
                                    })
                            } else {
                                mail.sendMail(email, constant().nodeMailer.subject, constant().nodeMailer.text, config.nodeMailer_email, constant().nodeMailer.html + verification_code)
                                    .then((response) => {
                                        User.update(UserModel, data, updatedData)
                                            .then(() => {
                                                res.status(200)
                                                res.json(successResponse(200, { access_token: updatedData.access_token, status: 1, email: email }, 'An Email has been sent , please verify.'));
                                            }).catch((e) => {
                                                res.status(500);
                                                res.json(successResponse(500, e, 'Error.'));
                                            })
                                    })
                                    .catch((e) => {
                                        res.status(500);
                                        res.json(successResponse(500, e, 'Error.'));
                                    });
                            }
                        }).catch((e) => {
                            res.status(500);
                            res.json(successResponse(500, e, 'Error.'));
                        })
                }
            }).catch((e) => {
                res.status(500);
                res.json(successResponse(500, e, 'Error.'));
            })
    }

    socialLogin = (req, res) => {
        let body = req.body;
        let user = body.user;
        if (!user) {
            res.status(100)
            res.json(successResponse(100, {}, 'Some parameter missing.'));
            return;
        }
        let password = '';
        let fb_id = user.fb_id;
        if (fb_id) {
            user.type = 'facebook';
            password = generatePassword(6);
            user.password = password;
            user.created_on = new Date();
            user.timeStamp = new Date().getTime();
            user.is_verify = 0;
            user.is_deleted = 0;
            user.is_blocked = 0;
            user.modified_on = new Date();
            user.status = 3;
            const UserModel = req.User;
            var userObj = user;
            User.findOne(UserModel, { fb_id: fb_id })
                .then((user_details) => {
                    if (user_details) {
                        res.status(200)
                        res.json(successResponse(200, user_details, 'Logged in successfully.'));
                    } else {
                        User.save(UserModel, user)
                            .then((userData) => {
                                let access_token = encodeToken(userData._id)
                                userData.access_token = access_token
                                User.update(UserModel, { fb_id: fb_id }, { access_token: access_token })
                                    .then(() => {
                                        res.status(200)
                                        res.json(successResponse(200, userData, 'Logged in successfully.'));
                                    }).catch((e) => {
                                        res.status(500);
                                        res.json(successResponse(500, e, 'Error.'));
                                    })
                            }).catch((e) => {
                                res.status(500);
                                res.json(successResponse(500, e, 'Error.'));
                            })
                    }
                }).catch((e) => {
                    res.status(500);
                    res.json(successResponse(500, e, 'Error.'));
                })
        } else {
            res.status(100)
            res.json(successResponse(100, {}, 'Some parameter missing.'));
        }
    }

    verifyCode = (req, res) => {
        let { mobile, email, verification_code } = req.body;
        const UserModel = req.User;
        let data = {};
        if (mobile && verification_code) {
            data = { mobile: mobile, verification_code: Number(verification_code) }
        } else if (email && verification_code) {
            data = { email: email, verification_code: Number(verification_code) }
        } else {
            res.status(100)
            res.json(successResponse(100, {}, 'Some parameter missing.'));
            return;
        }
        User.findOne(UserModel, data)
            .then((user) => {
                if (!user) {
                    res.status(201);
                    res.json(successResponse(201, {}, 'User not found.'));
                } else {
                    let updatedData = { is_verify: 1, status: 2 };
                    User.update(UserModel, data, updatedData)
                        .then(() => {
                            res.status(200);
                            res.json(successResponse(200, { access_token: user.get('access_token'), status: 2 }, 'OTP match successfully.'));
                        }).catch((e) => {
                            res.status(500);
                            res.json(successResponse(500, e, 'Error.'));
                        })
                }
            }).catch((e) => {
                res.status(500);
                res.json(successResponse(500, e, 'Error.'));
            })
    }


    forgot_password = (req, res) => {
        let { mobile, email } = req.body;
        const UserModel = req.User;
        let data = {};
        if (mobile) {
            data = { mobile: mobile }
        } else if (email) {
            data = { email: email }
        } else {
            res.status(100)
            res.json(successResponse(100, {}, 'Some parameter missing.'));
            return;
        }
        User.findOne(UserModel, data)
            .then((user) => {
                if (!user) {
                    res.status(201);
                    res.json(successResponse(201, {}, 'User not found.'));
                } else {
                    let verificationCode = Math.ceil(Math.random() * 10000);
                    let updatedData = { verificationCode: verificationCode }
                    if (mobile) {
                        twilio.sendMessageTwilio(`your Mypoty verification code is: ${verificationCode}`, '+918126724591')
                            .then((result) => {
                                User.update(UserModel, data, updatedData)
                                    .then(() => {
                                        res.status(200);
                                        res.json(successResponse(200, '{}', 'An OTP has been sent,please verify.'));
                                    }).catch((e) => {
                                        res.status(500);
                                        res.json(successResponse(500, e, 'Error.'));
                                    })
                            }).catch((e) => {
                                res.status(500);
                                res.json(successResponse(500, e, 'Error.'));
                            })
                    } else {
                        mail.sendMail(email, constant().nodeMailer.subject, constant().nodeMailer.text, config.nodeMailer_email, constant().nodeMailer.html + verificationCode)
                            .then((response) => {
                                User.update(UserModel, data, updatedData)
                                    .then(() => {
                                        res.status(200);
                                        res.json(successResponse(200, '{}', 'An Email has been sent,please verify.'));
                                    }).catch((e) => {
                                        res.status(500);
                                        res.json(successResponse(500, e, 'Error.'));
                                    })
                            })
                            .catch((e) => {
                                res.status(500);
                                res.json(successResponse(500, e, 'Error.'));
                            });
                    }
                }
            }).catch((e) => {
                res.status(500);
                res.json(successResponse(500, e, 'Error.'));
            })
    }

    createUserName = (req, res) => {
        let { access_token, user_name } = req.body;
        let UserModel = req.User;
        if (access_token && user_name) {
            User.findOne(UserModel, { user_name: user_name })
                .then((userDetails) => {
                    if (userDetails) {
                        res.status(200)
                        res.json(successResponse(200, {}, 'UserName already exist.'));
                    } else {
                        UserModel.findOneAndUpdate({ "access_token": access_token }, { $set: { "user_name": user_name, "status": 3 }, returnNewDocument: true }, (err, insertData) => {
                            if (err) {
                                res.status(500);
                                res.json(successResponse(500, err, 'Error.'));
                            } else {
                                if (insertData) {
                                    res.status(200);
                                    res.json(successResponse(200, { access_token: access_token, status: 3 }, 'UserName Saved successfully.'));
                                } else {
                                    res.status(101);
                                    res.json(successResponse(101, {}, 'Invalid access token.'));
                                }
                            }
                        });

                    }
                }).catch((e) => {
                    res.status(500);
                    res.json(successResponse(500, e, 'Error.'));
                })
        } else {
            res.status(100)
            res.json(successResponse(100, {}, 'Some parameter missing.'));
        }
    }
}

const controller = new UserController();
export default controller;