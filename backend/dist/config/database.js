"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        // Handle connection events
        mongoose_1.default.connection.on('error', () => {
            // Silent error handling
        });
        mongoose_1.default.connection.on('disconnected', () => {
            // Silent disconnection handling
        });
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            process.exit(0);
        });
    }
    catch (error) {
        process.exit(1);
    }
};
exports.default = connectDatabase;
//# sourceMappingURL=database.js.map