"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require("../controllers/user");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
    /* Route for User Register  */
    app.route("/user/create").post(_user2.default.create);

    /* Route for login */
    app.route("/user/login").post(_user2.default.login);
    return app;
};
//# sourceMappingURL=user.js.map