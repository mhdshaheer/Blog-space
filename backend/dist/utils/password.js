"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcryptjs_1.default.genSalt(saltRounds);
        return await bcryptjs_1.default.hash(password, salt);
    }
    catch (e) {
        throw e;
    }
};
exports.hashPassword = hashPassword;
const comparePassword = async (candidate, hash) => {
    try {
        return await bcryptjs_1.default.compare(candidate, hash);
    }
    catch (e) {
        throw e;
    }
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=password.js.map