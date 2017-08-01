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
import { encodeToken, decodeToken } from "../modules/token";

export class UserController extends BaseAPIController {

    /* Controller for User Login  */
    // login = (req, res) => {
    //     let { email, mobile, password } = req.body;
    //     let data = {};
    //     let UserModel = req.User;
    //     if (mobile && password) {
    //         data = { mobile: mobile }
    //     } else if (email && password) {
    //         data = { email: email }
    //     } else {
    //         res.status(500)
    //         res.json({ status: 500, flag: 1, response: {}, message: 'Data Missing' });
    //         return;
    //     }
    //     let md5 = crypto.createHash('md5');
    //     md5.update(password);
    //     data.password = md5.digest('hex');

    //     User.findOne(UserModel, data)
    //         .then((user) => {
    //             if (user) {
    //                 let token = jwt.sign({ token: user._id }, "secret_key", { expiresIn: 60 * 60 });
    //                 res.status(200);
    //                 res.json({ status: 200, flag: 1, response: { access_token: token }, message: 'Login Successfull' });
    //             } else {
    //                 res.status(400);
    //                 res.json({ status: 400, flag: 1, response: {}, message: 'USER_NOT_FOUND' });
    //             }
    //         }).catch((e) => {
    //             res.status(500);
    //             res.json(serverError(e))
    //         })
    // }

    signUp = (req, res) => {
        var body = req.body;
        var user_details = body.user;
        let UserModel = req.User;
        if (!user_details) {
            res.status(400)
            res.json(successResponse(400, {}, 'PARAMETER_MISSING'));
            return;
        }
        let data = {};
        let { mobile, email, password } = body.user;
        if (mobile && password) {
            data = { mobile: mobile }
        } else if (email && password) {
            data = { email: email }
        } else {
            res.status(400)
            res.json(successResponse(400, {}, 'PARAMETER_MISSING'));
            return;
        }
        User.findOne(UserModel, data)
            .then((user) => {
                if (user) {
                    res.status(404)
                    res.json(successResponse(404, {}, 'USER_ALREADY_EXISTS'));
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
                                                res.json(successResponse(200, { access_token: updatedData.access_token, status: 1 }, 'AN_OTP_HAS_BEEN_SENT,PLEASE_VERIFY_OTP'));
                                            }).catch((e) => {
                                                res.status(500);
                                                res.json(successResponse(500, e, 'Error'));
                                            })
                                    }).catch((e) => {
                                        res.status(500);
                                        res.json(successResponse(500, e, 'Error'));
                                    })
                            } else {
                                mail.sendMail(email, constant().nodeMailer.subject, constant().nodeMailer.text, config.nodeMailer_email, constant().nodeMailer.html + verification_code)
                                    .then((response) => {
                                        User.update(UserModel, data, updatedData)
                                            .then(() => {
                                                res.status(200)
                                                res.json(successResponse(200, { access_token: updatedData.access_token, status: 1 }, 'AN_EMAIL_HAS_BEEN_SENT, PLEASE_VERIFY_OTP'));
                                            }).catch((e) => {
                                                res.status(500);
                                                res.json(successResponse(500, e, 'Error'));
                                            })
                                    })
                                    .catch((e) => {
                                        res.status(500);
                                        res.json(successResponse(500, e, 'Error'));
                                    });
                            }
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

    // socialLogin = (req, res) => {
    //     var body = req.body;
    //     var user = body.user;
    //     if (!user) {
    //         res.json({ error: 1, message: 'Invalid Request' });
    //         return;
    //     }
    //     var email = user.email;
    //     var password = '';
    //     var name = user.name;

    //     if (user.fb_id && name && name.length > 0 && email && email.length > 0) {
    //         user.type = 'facebook';
    //         password = generatePassword(6);
    //         user.password = password;
    //         user.is_verify = 0;
    //         var UserModel = req.User;
    //         var userObj = user;
    //         User.findOne(UserModel, { email: email })
    //             .then((user_details) => {
    //                 if (user_details) {
    //                     res.status(200);
    //                     res.json({ status: 200, flag: 1, response: user_details, message: 'USER_ALREADY_EXISTS' });
    //                 } else {
    //                     User.save(UserModel, user)
    //                         .then((userData) => {
    //                             res.status(200);
    //                             res.json({ Status: 200, Flag: 1, Response: userData, Message: 'USER_SAVED_SUCCESSFULLY' });
    //                         }).catch((e) => {
    //                             res.status(500);
    //                             res.json(serverError(e))
    //                         })
    //                 }
    //             }).catch((e) => {
    //                 res.status(500);
    //                 res.json(serverError(e))
    //             })
    //     } else {
    //         res.status(500)
    //         res.json({ error: 1, message: 'InComplete Details' });
    //     }
    // }

    // forgot_password = (req, res) => {
    //     let { email, mobileNumber } = req.body;
    //     let data = {};
    //     let UserModel = req.User;
    //     if (mobileNumber) {
    //         data = { mobileNumber: mobileNumber }
    //     } else if (email) {
    //         data = { email: email }
    //     } else if (!mobileNumber && !email) {
    //         res.json({ status: 1, message: 'Invalid Request' });
    //         return;
    //     }
    //     User.findOne(UserModel, data)
    //         .then((user) => {
    //             if (user) {
    //                 let verificationCode = Math.ceil(Math.random() * 10000);
    //                 let updatedData = { verificationCode: verificationCode }

    //                 if (mobileNumber) {
    //                     twilio.sendMessageTwilio(`your Mypoty verification code is: ${verificationCode}`, '+918126724591')
    //                         .then((result) => {
    //                             User.update(UserModel, data, updatedData)
    //                                 .then(() => {
    //                                     res.status(200);
    //                                     res.json(getSuccessMessage())
    //                                 }).catch((e) => {
    //                                     res.status(500);
    //                                     res.json(serverError(e))
    //                                 })
    //                         }).catch((e) => {
    //                             res.status(500);
    //                             res.json(serverError(e))
    //                         })
    //                 } else {
    //                     mail.sendMail(email, constant().nodeMailer.subject, constant().nodeMailer.text, config.nodeMailer_email, constant().nodeMailer.html + verificationCode)
    //                         .then((response) => {
    //                             User.update(UserModel, data, updatedData)
    //                                 .then(() => {
    //                                     res.status(200);
    //                                     res.json(getSuccessMessage())
    //                                 }).catch((e) => {
    //                                     res.status(500);
    //                                     res.json(serverError(e))
    //                                 })
    //                         })
    //                         .catch((e) => {
    //                             res.status(500);
    //                             res.json(serverError(e))
    //                         });
    //                 }
    //             } else {
    //                 res.status(404);
    //                 res.json(notFoundError('Details Not Found!'))
    //             }
    //         }).catch((e) => {
    //             res.status(500);
    //             res.json(serverError(e))
    //         })
    // }

    verifyCode = (req, res) => {
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
                    let updatedData = { is_verify: 1, status: 2 };
                    User.update(UserModel, data, updatedData)
                        .then(() => {
                            res.status(200);
                            res.json(successResponse(200, { access_token: user.get('access_token'), status: 2 }, 'OTP_MATCHED_SUCCESSFULLY'));
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

    // resendOTP = (req, res) => {
    //     let { mobile, email } = req.body;
    //     const UserModel = req.User;
    //     let data = {};
    //     if (mobile) {
    //         data = { mobile: mobile }
    //     } else if (email) {
    //         data = { email: email }
    //     } else {
    //         res.status(400)
    //         res.json(successResponse(400, {}, 'INVALID_DETAILS'));
    //         return;
    //     }
    //     User.findOne(UserModel, data)
    //         .then((user) => {
    //             if (!user) {
    //                 res.status(404);
    //                 res.json(successResponse(400, '{}', 'USER_NOT_FOUND'));
    //             } else {
    //                 let verificationCode = Math.ceil(Math.random() * 10000);
    //                 let updatedData = { verificationCode: verificationCode }
    //                 if (mobile) {
    //                     twilio.sendMessageTwilio(`your Mypoty verification code is: ${verificationCode}`, '+918126724591')
    //                         .then((result) => {
    //                             User.update(UserModel, data, updatedData)
    //                                 .then(() => {
    //                                     res.status(200);
    //                                     res.json(successResponse(200, '{}', 'PLEASE_VERIFY_OTP'));
    //                                 }).catch((e) => {
    //                                     res.status(500);
    //                                     res.json(successResponse(500, e, 'Error'));
    //                                 })
    //                         }).catch((e) => {
    //                             res.status(500);
    //                             res.json(successResponse(500, e, 'Error'));
    //                         })
    //                 } else {
    //                     mail.sendMail(email, constant().nodeMailer.subject, constant().nodeMailer.text, config.nodeMailer_email, constant().nodeMailer.html + verificationCode)
    //                         .then((response) => {
    //                             User.update(UserModel, data, updatedData)
    //                                 .then(() => {
    //                                     res.status(200);
    //                                     res.json(successResponse(200, '{}', 'PLEASE_VERIFY_OTP'));
    //                                 }).catch((e) => {
    //                                     res.status(500);
    //                                     res.json(successResponse(500, e, 'Error'));
    //                                 })
    //                         })
    //                         .catch((e) => {
    //                             res.status(500);
    //                             res.json(successResponse(500, e, 'Error'));
    //                         });
    //                 }
    //             }
    //         }).catch((e) => {
    //             res.status(500);
    //             res.json(successResponse(500, e, 'Error'));
    //         })
    // }
    // createUserName = (req, res) => {
    //     let { mobileNumber, email, userName } = req.body;
    //     let data = {};
    //     let updatedData = {};
    //     let UserModel = req.User;

    //     if (mobileNumber && userName) {
    //         updatedData = { userName: userName }
    //         data = { mobileNumber: mobileNumber }
    //     } else if (email && userName) {
    //         updatedData = { userName: userName }
    //         data = { email: email }
    //     } else {
    //         res.json({ status: 1, message: 'Invalid Request' });
    //         return;
    //     }
    //     User.findOne(UserModel, updatedData)
    //         .then((user) => {
    //             if (user) {
    //                 res.status(404);
    //                 res.json(notFoundError('User Name Already Exists!'))
    //             } else {
    //                 User.update(UserModel, data, updatedData)
    //                     .then(() => {
    //                         res.status(200);
    //                         res.json({ status: 200, message: 'userName updated', data: {} });
    //                     }).catch((e) => {
    //                         res.status(500);
    //                         res.json(serverError(e))
    //                     })
    //             }
    //         }).catch((e) => {
    //             res.status(500);
    //             res.json(serverError(e))
    //         })
    // }
}

const controller = new UserController();
export default controller;