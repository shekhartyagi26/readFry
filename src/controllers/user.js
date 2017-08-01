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
import jwt from "jsonwebtoken";

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
            res.status(500)
            res.json({ status: 500, flag: 1, response: {}, message: 'Data Missing' });
            return;
        }
        let md5 = crypto.createHash('md5');
        md5.update(password);
        data.password = md5.digest('hex');

        User.findOne(UserModel, data)
            .then((user) => {
                if (user) {
                    let token = jwt.sign({ token: user._id }, "secret_key", { expiresIn: 60 * 60 });
                    res.status(200);
                    res.json({ status: 200, flag: 1, response: { access_token: token }, message: 'Login Successfull' });
                } else {
                    res.status(400);
                    res.json({ status: 400, flag: 1, response: {}, message: 'USER_NOT_FOUND' });
                }
            }).catch((e) => {
                res.status(500);
                res.json(serverError(e))
            })
    }

    create_account = (req, res) => {
        var body = req.body;
        var user_details = body.user;
        let UserModel = req.User;
        if (!user_details) {
            res.json({ status: 200, flag: 1, response: {}, message: 'Invalid Request' });
            return;
        }
        let data = {};
        let { mobile, email, password } = body.user;
        if (mobile && password) {
            data = { mobile: mobile }
        } else if (email && password) {
            data = { email: email }
        } else if (!mobile && !password || !email && !password) {
            res.json({ status: 200, flag: 1, response: {}, message: 'Data Missing' });
            return;
        }

        User.findOne(UserModel, data)
            .then((user) => {
                if (user) {
                    res.status(404);
                    res.json({ Status: 200, Flag: 1, Response: {}, Message: 'USER_ALREADY_EXISTS' });
                } else {
                    let md5 = crypto.createHash('md5');
                    md5.update(password);
                    let pass_md5 = md5.digest('hex');
                    user_details.password = pass_md5
                    user_details.createdOn = new Date();
                    user_details.timeStamp = new Date().getTime();
                    user_details.isVerified = 0;
                    User.save(UserModel, user_details)
                        .then((userData) => {
                            let verification_code = Math.ceil(Math.random() * 10000);
                            let updatedData = { verification_code: verification_code }
                            if (mobile) {
                                twilio.sendMessageTwilio(`your Mypoty verification code is: ${verification_code}`, '+918126724591')
                                    .then((result) => {
                                        User.update(UserModel, data, updatedData)
                                            .then((data) => {
                                                res.status(200);
                                                res.json({ status: 200, flag: 1, response: userData, message: 'OTP has been sent successfully , Please Verify' });
                                            }).catch((e) => {
                                                res.status(500);
                                                res.json(serverError(e))
                                            })
                                    }).catch((e) => {
                                        res.status(500);
                                        res.json(serverError(e))
                                    })
                            } else {
                                mail.sendMail(email, constant().nodeMailer.subject, constant().nodeMailer.text, config.nodeMailer_email, constant().nodeMailer.html + verification_code)
                                    .then((response) => {
                                        User.update(UserModel, data, updatedData)
                                            .then(() => {
                                                res.status(200);
                                                res.json({ status: 200, flag: 1, response: userData, message: 'email has been sent successfully , Please Verify' });
                                            }).catch((e) => {
                                                res.status(500);
                                                res.json(serverError(e))
                                            })
                                    })
                                    .catch((e) => {
                                        res.status(500);
                                        res.json(serverError(e))
                                    });
                            }
                        }).catch((e) => {
                            res.status(500);
                            res.json(serverError(e))
                        })
                }
            }).catch((e) => {
                res.status(500);
                res.json(serverError(e))
            })
    }

    social = (req, res) => {
        var body = req.body;
        var user = body.user;
        if (!user) {
            res.json({ error: 1, message: 'Invalid Request' });
            return;
        }
        var email = user.email;
        var password = '';
        var name = user.name;

        if (user.fb_id && name && name.length > 0 && email && email.length > 0) {
            user.type = 'facebook';
            password = generatePassword(6);
            user.password = password;
            user.is_verify = 0;
            var UserModel = req.User;
            var userObj = user;
            User.findOne(UserModel, { email: email })
                .then((user_details) => {
                    if (user_details) {
                        res.status(200);
                        res.json({ status: 200, flag: 1, response: user_details, message: 'USER_ALREADY_EXISTS' });
                    } else {
                        User.save(UserModel, user)
                            .then((userData) => {
                                res.status(200);
                                res.json({ Status: 200, Flag: 1, Response: userData, Message: 'USER_SAVED_SUCCESSFULLY' });
                            }).catch((e) => {
                                res.status(500);
                                res.json(serverError(e))
                            })
                    }
                }).catch((e) => {
                    res.status(500);
                    res.json(serverError(e))
                })
        } else {
            res.status(500)
            res.json({ error: 1, message: 'InComplete Details' });
        }
    }

    forgot_password = (req, res) => {
        let { email, mobileNumber } = req.body;
        let data = {};
        let UserModel = req.User;
        if (mobileNumber) {
            data = { mobileNumber: mobileNumber }
        } else if (email) {
            data = { email: email }
        } else if (!mobileNumber && !email) {
            res.json({ status: 1, message: 'Invalid Request' });
            return;
        }
        User.findOne(UserModel, data)
            .then((user) => {
                if (user) {
                    let verificationCode = Math.ceil(Math.random() * 10000);
                    let updatedData = { verificationCode: verificationCode }

                    if (mobileNumber) {
                        twilio.sendMessageTwilio(`your Mypoty verification code is: ${verificationCode}`, '+918126724591')
                            .then((result) => {
                                User.update(UserModel, data, updatedData)
                                    .then(() => {
                                        res.status(200);
                                        res.json(getSuccessMessage())
                                    }).catch((e) => {
                                        res.status(500);
                                        res.json(serverError(e))
                                    })
                            }).catch((e) => {
                                res.status(500);
                                res.json(serverError(e))
                            })
                    } else {
                        mail.sendMail(email, constant().nodeMailer.subject, constant().nodeMailer.text, config.nodeMailer_email, constant().nodeMailer.html + verificationCode)
                            .then((response) => {
                                User.update(UserModel, data, updatedData)
                                    .then(() => {
                                        res.status(200);
                                        res.json(getSuccessMessage())
                                    }).catch((e) => {
                                        res.status(500);
                                        res.json(serverError(e))
                                    })
                            })
                            .catch((e) => {
                                res.status(500);
                                res.json(serverError(e))
                            });
                    }
                } else {
                    res.status(404);
                    res.json(notFoundError('Details Not Found!'))
                }
            }).catch((e) => {
                res.status(500);
                res.json(serverError(e))
            })
    }

    verify = (req, res) => {
        let { mobile, email, verification_code } = req.body;
        const UserModel = req.User;
        let data = {};
        if (mobile && verification_code) {
            data = { mobile: mobile, verification_code: Number(verification_code) }
        } else if (email && verification_code) {
            data = { email: email, verification_code: Number(verification_code) }
        } else {
            res.status(400)
            res.json(successResponse(400, {}, 'INVALID_DETAILS'));
            return;
        }
        User.findOne(UserModel, data)
            .then((user) => {
                if (!user) {
                    res.status(404);
                    res.json(successResponse(400, '{}', 'USER_NOT_FOUND'));
                } else {
                    let updatedData = { is_verify: 1 };
                    User.update(UserModel, data, updatedData)
                        .then(() => {
                            res.status(200);
                            res.json(successResponse(200, user, 'OTP_MATCHED_SUCCESSFULLY'));
                        }).catch((e) => {
                            res.status(500);
                            res.json(successResponse(500, e, 'Error'));
                        })
                }
            }).catch((e) => {
                res.status(500);
                res.json(successResponse(500, e, 'Error'));
            })
    }

    createUserName = (req, res) => {
        let { mobileNumber, email, userName } = req.body;
        let data = {};
        let updatedData = {};
        let UserModel = req.User;

        if (mobileNumber && userName) {
            updatedData = { userName: userName }
            data = { mobileNumber: mobileNumber }
        } else if (email && userName) {
            updatedData = { userName: userName }
            data = { email: email }
        } else {
            res.json({ status: 1, message: 'Invalid Request' });
            return;
        }
        User.findOne(UserModel, updatedData)
            .then((user) => {
                if (user) {
                    res.status(404);
                    res.json(notFoundError('User Name Already Exists!'))
                } else {
                    User.update(UserModel, data, updatedData)
                        .then(() => {
                            res.status(200);
                            res.json({ status: 200, message: 'userName updated', data: {} });
                        }).catch((e) => {
                            res.status(500);
                            res.json(serverError(e))
                        })
                }
            }).catch((e) => {
                res.status(500);
                res.json(serverError(e))
            })
    }
}

const controller = new UserController();
export default controller;