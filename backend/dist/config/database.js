"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('\x1b[35m[MONGODB] Connected successfully\x1b[0m');
        // Handle connection events
        mongoose_1.default.connection.on('error', (err) => {
            console.error('\x1b[31m[MONGODB] Connection error:', err, '\x1b[0m');
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('\x1b[33m[MONGODB] Connection lost\x1b[0m');
        });
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('\x1b[31m[MONGODB] Initial connection failed:', error.message, '\x1b[0m');
        process.exit(1);
    }
};
exports.default = connectDatabase;
//# sourceMappingURL=database.js.map