"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import db from "../db";


var _util = require("../lib/util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseAPIController = function () {
    function BaseAPIController() {
        _classCallCheck(this, BaseAPIController);
    }

    _createClass(BaseAPIController, [{
        key: "handleErrorResponse",
        value: function handleErrorResponse(res, err, next) {
            res.status(400).send((0, _util2.default)(err));
        }
    }, {
        key: "handleSuccessResponse",
        value: function handleSuccessResponse(res, next) {
            res.json({
                status: "SUCCESS"
            });
        }
    }]);

    return BaseAPIController;
}();

exports.default = BaseAPIController;
//# sourceMappingURL=BaseAPIController.js.map