'use strict';
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator['throw'](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserController = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const base_controller_1 = __importDefault(require('./base-controller'));
const resolved_models_1 = require('..\\..\\resolved-models');
const ensure_authorized_1 = __importDefault(require('..\\middleware\\ensure-authorized'));
class UserController extends (base_controller_1.default) {
    listen(router) {
        router.get('/:userID/company', (0, ensure_authorized_1.default)('company.view'), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const companyName = this.getCompanyName(req.params.userID);
            res.send({
                success: true,
                companyName: companyName
            });
            next();
        }));
    }
    byEmail(email) {
        return resolved_models_1.UserModel.findOne({ email: email });
    }
    byId(_id) {
        return resolved_models_1.UserModel.findOne({ _id: new mongoose_1.default.Types.ObjectId(_id) });
    }
    byUsername(username) {
        return resolved_models_1.UserModel.findOne({ username: username });
    }
    getCompanyName(id) {
        this.byId(id).populate('company').name;
    }
}
exports.UserController = UserController;