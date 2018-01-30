"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request-promise-native");
var global_1 = require("../lib/global");
var promises_1 = require("../lib/promises");
// TODO all the request methods can be refactored
/** Performs a GET request on the given resource and returns the result */
function request_get(path, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var reqOpts;
        return __generator(this, function (_a) {
            reqOpts = Object.assign(options, {
                uri: path,
                rejectUnauthorized: false,
            });
            return [2 /*return*/, request(reqOpts)];
        });
    });
}
function checkConnection(hostname) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    global_1.Global.log("checking if connection is alive", "debug");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // We always use the non-overwritten version for this as
                    // we might not have credentials yet.
                    return [4 /*yield*/, request_get("http://" + hostname + ":1925", {
                            timeout: 5000,
                            simple: false,
                        })];
                case 2:
                    // We always use the non-overwritten version for this as
                    // we might not have credentials yet.
                    _a.sent();
                    global_1.Global.log("connection is ALIVE", "debug");
                    return [2 /*return*/, true];
                case 3:
                    e_1 = _a.sent();
                    // handle a couple of possible errors
                    switch (e_1.code) {
                        case "ECONNREFUSED":
                        case "ECONNRESET":
                            // the remote host is there, but it won't let us connect
                            // e.g. when trying to connect to port 1925 on a v6 TV
                            global_1.Global.log("connection is ALIVE, but remote host won't let us connect", "debug");
                            return [2 /*return*/, true];
                        case "ETIMEDOUT":
                        default:
                            global_1.Global.log("connection is DEAD. Reason: [" + e_1.code + "] " + e_1.message, "debug");
                            return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Common base class for all specialized APIs that support a range of devices
 */
var API = /** @class */ (function () {
    function API(
        /** The hostname this wrapper is bound to */
        hostname) {
        this.hostname = hostname;
        this._params = new Map();
    }
    API.create = function (hostname) {
        return __awaiter(this, void 0, void 0, function () {
            var ret, _i, _a, apiType;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, checkConnection(hostname)];
                    case 1:
                        if (!(_b.sent()))
                            throw new Error("No connection to host " + hostname);
                        global_1.Global.log("detecting API version", "debug");
                        _i = 0, _a = [api_v1_1.APIv1, api_v5_1.APIv5, api_v6_1.APIv6];
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        apiType = _a[_i];
                        global_1.Global.log("testing " + apiType.name, "debug");
                        ret = new apiType(hostname);
                        return [4 /*yield*/, ret.test()];
                    case 3:
                        if (!_b.sent()) return [3 /*break*/, 4];
                        global_1.Global.log("TV has " + apiType.name, "debug");
                        return [2 /*return*/, ret];
                    case 4: 
                    // don't request too fast
                    return [4 /*yield*/, promises_1.wait(100)];
                    case 5:
                        // don't request too fast
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: throw new Error("No supported device/API version found at \"" + hostname + "\"");
                }
            });
        });
    };
    Object.defineProperty(API.prototype, "params", {
        /** Additional params that should be stored over several API uses */
        get: function () {
            return this._params;
        },
        enumerable: true,
        configurable: true
    });
    API.prototype.getRequestPath = function (path) {
        return path.startsWith("http") ? path : "" + this.requestPrefix + path;
    };
    /** Performs a GET request on the given resource and returns the result */
    API.prototype._get = function (path, options) {
        if (options === void 0) { options = {}; }
        var reqOpts = Object.assign(options, {
            uri: this.getRequestPath(path),
            rejectUnauthorized: false,
        });
        return request(reqOpts);
    };
    /** Performs a GET request on the given resource and returns the result */
    API.prototype.get = function (path, options) {
        if (options === void 0) { options = {}; }
        return this._get(path, options);
    };
    /** Performs a GET request on the given resource and returns the result */
    API.prototype.getWithDigestAuth = function (path, credentials, options) {
        if (options === void 0) { options = {}; }
        var reqOpts = Object.assign(options, {
            uri: this.getRequestPath(path),
            auth: {
                username: credentials.username,
                password: credentials.password,
                sendImmediately: false,
            },
            rejectUnauthorized: false,
        });
        return request(reqOpts);
    };
    /** Posts JSON data to the given resource and returns the result */
    API.prototype.postJSONwithDigestAuth = function (path, credentials, jsonPayload, options) {
        if (options === void 0) { options = {}; }
        var reqOpts = Object.assign(options, {
            uri: this.getRequestPath(path),
            method: "POST",
            json: jsonPayload,
            auth: {
                username: credentials.username,
                password: credentials.password,
                sendImmediately: false,
            },
            rejectUnauthorized: false,
        });
        return request(reqOpts);
    };
    /** Posts JSON data to the given resource and returns the result */
    API.prototype.postJSON = function (path, jsonPayload, options) {
        if (options === void 0) { options = {}; }
        var reqOpts = Object.assign(options, {
            uri: this.getRequestPath(path),
            method: "POST",
            json: jsonPayload,
            rejectUnauthorized: false,
        });
        return request(reqOpts);
    };
    /** Checks if the configured host is reachable */
    API.prototype.checkConnection = function () {
        return checkConnection(this.hostname);
    };
    return API;
}());
exports.API = API;
// has to be imported here or TypeScript chokes
var api_v1_1 = require("./api-v1");
var api_v5_1 = require("./api-v5");
var api_v6_1 = require("./api-v6");
