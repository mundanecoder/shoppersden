"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const db_1 = __importDefault(require("./Database/db"));
const autoload_1 = __importDefault(require("@fastify/autoload"));
const cors_1 = __importDefault(require("@fastify/cors"));
const path_1 = require("path");
// import { clerkPlugin } from "@clerk/fastify";
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// const clerkOptions = {
//   publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
//   secretKey: process.env.CLERK_SECRET_KEY,
// };
const envToLogger = {
    development: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
            },
        },
    },
    production: true,
    test: false,
};
const environment = "development";
const fastify = (0, fastify_1.default)({
    logger: (_a = envToLogger[environment]) !== null && _a !== void 0 ? _a : true,
});
// fastify.register(clerkPlugin, clerkOptions);
fastify.register(cors_1.default, {
    allowedHeaders: "*",
    methods: "*",
});
fastify.register(autoload_1.default, {
    dir: (0, path_1.join)(__dirname, "./routes"),
});
(0, db_1.default)();
fastify.get("/ping", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return reply.send({ message: "ping" });
}));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fastify.ready();
        yield fastify.listen({ port: 8000 });
        console.log("Server listening on port 8000");
    }
    catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
});
startServer();
//# sourceMappingURL=index.js.map