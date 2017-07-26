"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Provider for User Registration */
var create = function create(db, email, userName, fullName, mobileNumber, profilePicture, password, profession, website, age, bio) {
    return new Promise(function (resolve, reject) {
        var record = new db({
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
            updatedOn: new Date()
        });
        record.save(function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

var findOne = function findOne(db, data) {
    return new Promise(function (resolve, reject) {
        db.findOne(data, function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

exports.default = {
    create: create,
    findOne: findOne
};
//# sourceMappingURL=User.js.map