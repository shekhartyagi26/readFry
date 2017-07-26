"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _BaseProvider = require("./BaseProvider");

var BaseProvider = _interopRequireWildcard(_BaseProvider);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Provider for User Registration */
var create = function create(body) {
    return new Promise(function (resolve, reject) {
        if (!body.email || !body.userName || !body.fullName || !body.mobileNumber || !body.profilePicture || !body.password || !body.profession || !body.website || !body.age || !body.bio) {
            reject('parameters missing');
        } else {
            resolve(body);
        }
    });
};
var checkBlank = function checkBlank(arr, req, res) {
    return new Promise(function (resolve, reject) {
        _lodash2.default.map(arr, function (val, key) {
            if (val == '' || val === "" || val == undefined) {
                reject('Some parameters missing');
            } else {
                if (key == _lodash2.default.size(arr) - 1) {
                    resolve('done');
                }
            }
        });
    });
};

/* Provider for User login */
var login = function login(model, body) {
    var password = _crypto2.default.createHash("sha256").update(body.password).digest("base64");
    delete body.confirm_password;
    return _extends({}, body, {
        password: password
    });
};

exports.default = _extends({}, BaseProvider, {
    create: create,
    checkBlank: checkBlank,
    login: login
});
//# sourceMappingURL=UserProvider.js.map