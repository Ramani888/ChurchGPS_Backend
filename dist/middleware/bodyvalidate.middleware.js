"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendedRules = exports.validateBody = void 0;
const validatorjs_1 = __importDefault(require("validatorjs"));
const http_status_codes_1 = require("http-status-codes");
var RouteSource;
(function (RouteSource) {
    RouteSource[RouteSource["Body"] = 0] = "Body";
    RouteSource[RouteSource["Query"] = 1] = "Query";
    RouteSource[RouteSource["Params"] = 2] = "Params";
})(RouteSource || (RouteSource = {}));
// Middleware function to validate request body / query / params
const validateBody = (rules, source) => {
    return (req, res, next) => {
        if ((!req.body || Object.keys(req.body).length === 0) && !source) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors: ['Request body is missing'] });
        }
        let body;
        if (source === RouteSource?.Params) {
            body = req?.params;
        }
        else if (source === RouteSource?.Query) {
            body = req?.query;
        }
        else {
            body = req?.body;
        }
        const validator = new validatorjs_1.default(body, rules);
        if (validator.fails()) {
            const errors = validator.errors.all();
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors });
        }
        next();
    };
};
exports.validateBody = validateBody;
// Example rules you can reuse in routes
exports.extendedRules = {
    name: 'required|string',
    isPrivate: 'required|boolean',
    color: 'required|string',
    cardTypeId: 'required|string',
    age: 'numeric|min:0|max:150',
    email: 'required|email',
    // ✅ date fields check only for valid date
    dateOfBirth: 'required|date',
    birthDate: 'required|date'
};
