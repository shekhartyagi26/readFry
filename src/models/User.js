import crypto from "crypto";
import util from "util";

/* Provider for User Registration */
const create = (db, email, userName, fullName, mobileNumber, profilePicture, password, profession, website, age, bio) => {
    return new Promise((resolve, reject) => {
        let record = new db({
            userName: userName,
            fullName: fullName,
            mobileNumber: mobileNumber,
            profilePicture: profilePicture,
            password: password,
            profession: profession,
            website: website,
            age: age,
            bio: bio,
            email: email,
            createdOn: new Date(),
            updatedOn: new Date(),
        });
        record.save(function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result)
            }
        })
    })
};

const findOne = (db, data) => {
    return new Promise((resolve, reject) => {
        db.findOne(data, function(err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        })
    })
};

export default {
    create,
    findOne,
};