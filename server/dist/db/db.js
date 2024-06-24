"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { PGHOST: host, PGUSER: user, PGPASSWORD: password, PGDATABASE: database } = process.env;
exports.db = new pg_1.Pool({ host, port: 5432, user, password, database, ssl: true });
