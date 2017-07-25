import BaseAPIController from "./BaseAPIController";
import UserProvider from "../providers/UserProvider.js";
import User from "../models/User.js";

export class UserController extends BaseAPIController {
    /* Controller for User Register  */
    create = (req, res) => {
        let { userName, fullName, mobileNumber, profilePicture, password, profession, website, age, bio, email } = req.body;
        UserProvider.checkBlank([userName, fullName, mobileNumber, profilePicture, password, profession, website, age, bio, email])
            .then((data) => {
                data = { email: email };
                console.log(data,'+++++++++')
                User.findOne(req.users, data)
                    .then((data) => {
                        console.log(data)
                        // if (!data) {
                        //     User.create(req.users, userName, fullName, mobileNumber, profilePicture, password, profession, website, age, bio)
                        //         .then((data) => {
                        //             res.json({ data })
                        //         }, (err) => {
                        //             throw new Error(res.json(400, { message: err }));
                        //         })
                        // } else {
                        //     throw new Error(res.json(400, { message: 'email id already exist' }));
                        // }
                    }).catch((err) => {
                        console.log(err)
                        // throw new Error(res.json(400, { message: err }));
                    })
            }).catch((err) => {
                console.log(err,'=========')
                // throw new Error(res.json(400, { message: err }))
            })
    }

    /* Controller for User Login  */
    login = (req, res) => {
        UserProvider.checkBlank([password, email])
            .then((data) => {
                data = { email: req.email, password: req.password }
                User.findOne(req.users, data)
                    .then((data) => {
                        res.json({ data })
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