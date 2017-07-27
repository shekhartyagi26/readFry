"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UserController = undefined;

var _BaseAPIController2 = require("./BaseAPIController");

var _BaseAPIController3 = _interopRequireDefault(_BaseAPIController2);

var _UserProvider = require("../providers/UserProvider.js");

var _UserProvider2 = _interopRequireDefault(_UserProvider);

var _User = require("../models/User.js");

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserController = exports.UserController = function (_BaseAPIController) {
    _inherits(UserController, _BaseAPIController);

    function UserController() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, UserController);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = UserController.__proto__ || Object.getPrototypeOf(UserController)).call.apply(_ref, [this].concat(args))), _this), _this.create = function (req, res) {
            var _req$body = req.body,
                userName = _req$body.userName,
                fullName = _req$body.fullName,
                mobileNumber = _req$body.mobileNumber,
                profilePicture = _req$body.profilePicture,
                password = _req$body.password,
                profession = _req$body.profession,
                website = _req$body.website,
                age = _req$body.age,
                bio = _req$body.bio,
                email = _req$body.email;

            _UserProvider2.default.checkBlank([userName, fullName, mobileNumber, profilePicture, password, profession, website, age, bio, email]).then(function (data) {
                data = { email: email };
                console.log(data, '+++++++++');
                _User2.default.findOne(req.users, data).then(function (data) {
                    console.log(data);
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
                }).catch(function (err) {
                    console.log(err);
                    // throw new Error(res.json(400, { message: err }));
                });
            }).catch(function (err) {
                console.log(err, '=========');
                // throw new Error(res.json(400, { message: err }))
            });
        }, _this.login = function (req, res) {
            _UserProvider2.default.checkBlank([password, email]).then(function (data) {
                data = { email: req.email, password: req.password };
                _User2.default.findOne(req.users, data).then(function (data) {
                    res.json({ data: data });
                }).catch(function (err) {
                    throw new Error(res.json(400, { message: err }));
                });
            }).catch(function (err) {
                throw new Error(res.json(400, { message: err }));
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    /* Controller for User Register  */


    /* Controller for User Login  */


    return UserController;
}(_BaseAPIController3.default);

var controller = new UserController();
exports.default = controller;
//# sourceMappingURL=user.js.map