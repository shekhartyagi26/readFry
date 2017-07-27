import BaseAPIController from "./BaseAPIController";
import UserProvider from "../providers/UserProvider.js";
import User from "../models/User.js";
import generatePassword from 'password-generator';
import crypto from 'crypto';

export class UserController extends BaseAPIController {
    /* Controller for User Register  */
    create = (req, res) => {
        let { userName, fullName, mobileNumber, profilePicture, password, profession, website, age, bio, email } = req.body;
        UserProvider.checkBlank([userName, fullName, mobileNumber, profilePicture, password, profession, website, age, bio, email])
            .then((data) => {
                data = { email: email };
                User.findOne(req.User, data)
                    .then((data) => {
                        if (!data) {
                            User.create(req.User, email, userName, fullName, mobileNumber, profilePicture, password, profession, website, age, bio)
                                .then((data) => {
                                    res.json({ data })
                                }, (err) => {
                                    throw new Error(res.json(400, { message: err }));
                                })
                        } else {
                            throw new Error(res.json(400, { message: 'email id already exist' }));
                        }
                    }).catch((err) => {
                        throw new Error(res.json(400, { message: err }));
                    })
            }).catch((err) => {
                throw new Error(res.json(400, { message: err }))
            })
    }

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
}

const controller = new UserController();
export default controller;