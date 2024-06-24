"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSuccess = void 0;
const CreateSuccess = (status, message, data) => {
    return {
        status,
        message,
        data,
    };
};
exports.CreateSuccess = CreateSuccess;
