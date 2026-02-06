"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNatsClient = createNatsClient;
const nats_1 = require("nats");
async function createNatsClient() {
    return (0, nats_1.connect)({
        servers: 'nats://localhost:4222',
    });
}
//# sourceMappingURL=index.js.map