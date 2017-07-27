import BaseAPIController from "./BaseAPIController";
import UserProvider from "../providers/UserProvider.js";
import User from "../models/User.js";
import generatePassword from 'password-generator';
import crypto from 'crypto';

export class UserController extends BaseAPIController {

    /* Controller for User Login  */
    login = (req, res) => {
        let { password, email } = req.body
        UserProvider.checkBlank([password, email])
            .then((data) => {
                data = { email: email, password: password }
                User.findOne(req.User, data)
                    .then((data) => {
                        if (data) {
                            res.json({ data })
                        } else {
                            throw new Error(res.json(400, { message: 'Invalid Login Credentials' }));
                        }

                    }).catch((err) => {
                        throw new Error(res.json(400, { message: err }));
                    })
            }).catch((err) => {
                throw new Error(res.json(400, { message: err }))
            })
    }

    /* Controller for User Register  */
    create = (req, res) => {
        let body = req.body;
        let user = body.user;
        let screen = req.body.screen;
        let UserModel = req.User;
        if (!user) {
            res.json({ status: 1, message: 'Invalid Request' });
            return;
        }
        if (screen == 1 && user.mobileNumber) {
            UserModel.findOne({
                mobileNumber: user.mobileNumber
            }).exec(function(err, user) {
                if (err) {
                    res.json({ status: 1, message: err });
                    return;
                } else {
                    if (user) {
                        res.json({ status: 1, message: 'Mobile Number Already Exists!' });
                        return;
                    } else {
                        res.json({ status: 0, message: 'Success' });
                        return;
                    }
                }
            })
        } else if (screen == 2 && user.userName) {
            UserModel.findOne({
                mobileNumber: user.userName
            }).exec(function(err, user) {
                if (err) {
                    res.json({ status: 1, message: err });
                    return;
                } else {
                    if (user) {
                        res.json({ status: 1, message: 'User Name Already Exists!' });
                        return;
                    } else {
                        res.json({ status: 0, message: 'Success' });
                        return;
                    }
                }
            })
        } else if (user.fb_id && user.type == 'facebook' || user.google_id && user.type == 'google' || screen == 3) {
            let email = user.email;
            let password = '';
            let name = user.name;
            if (name && name.length > 0 && email && email.length > 0) {
                if (user.fb_id || user.google_id) {
                    password = generatePassword(6);
                } else {
                    if (user.password) {
                        password = user.password;
                    } else {
                        res.json({ status: 1, message: 'Please provide password' });
                        return;
                    }
                }
                user.password = password;
                let userObj = user;
                UserModel.findOne({
                    email: email
                }).exec(function(err, user) {
                    if (err) {
                        next(err);
                    } else {
                        if (user) {
                            res.json({ status: 1, message: 'Account Already Exists!' });
                        } else {
                            let md5 = crypto.createHash('md5');
                            md5.update(password);
                            let pass_md5 = md5.digest('hex');
                            userObj.password = pass_md5;
                            let model = new UserModel(userObj);
                            model.save(function(err) {
                                if (err) {
                                    next(err);
                                } else {
                                    let id = model._id;
                                    userObj.id = id;
                                    res.json({ status: 0, data: userObj });
                                }
                            });
                        }
                    }
                });
            } else {
                res.json({ status: 1, message: 'InComplete Details' });
            }
        } else {
            res.json({ status: 1, message: 'InComplete Details' });
        }
    }
}

const controller = new UserController();
export default controller;