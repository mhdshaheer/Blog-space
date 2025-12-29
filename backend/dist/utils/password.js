"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt = require('bcryptjs');
const hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    }
    catch (e) {
        throw e;
    }
};
exports.hashPassword = hashPassword;
const comparePassword = async (candidate, hash) => {
    try {
        return await bcrypt.compare(candidate, hash);
    }
    catch (e) {
        throw e;
    }
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=password.js.map