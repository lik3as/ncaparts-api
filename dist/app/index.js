"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const info_1 = __importDefault(require("./middleware/info"));
const router_prod_1 = __importDefault(require("./routes/router.prod"));
const router_cli_1 = __importDefault(require("./routes/router.cli"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(info_1.default);
app.use(router_prod_1.default);
app.use(router_cli_1.default);
app.listen(8080, () => {
    console.log('\x1b[35mServer is Listening!\x1b[0m\n');
});
