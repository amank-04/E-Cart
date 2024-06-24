"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateError = void 0;
const CreateError = (status, message) => {
    return {
        status,
        message,
    };
};
exports.CreateError = CreateError;
