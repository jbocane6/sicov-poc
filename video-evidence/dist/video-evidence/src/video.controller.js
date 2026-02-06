"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const nats_client_1 = require("../../libs/nats-client");
const event_contracts_1 = require("../../libs/event-contracts");
let VideoController = class VideoController {
    async generate(inspectionId) {
        (0, fs_1.mkdirSync)('data/incoming/video', { recursive: true });
        const filePath = `data/incoming/video/${inspectionId}-${Date.now()}.mp4`;
        (0, fs_1.writeFileSync)(filePath, 'FAKE VIDEO DATA');
        const event = {
            eventId: (0, crypto_1.randomUUID)(),
            inspectionId,
            evidenceType: event_contracts_1.EvidenceType.VIDEO,
            filePath,
            createdAt: new Date().toISOString(),
        };
        const nc = await (0, nats_client_1.createNatsClient)();
        const ack = await nc.request('evidence.video.stored', JSON.stringify(event), { timeout: 3000 });
        await nc.close();
        return JSON.parse(ack.data.toString());
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Post)(':inspectionId'),
    __param(0, (0, common_1.Param)('inspectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "generate", null);
exports.VideoController = VideoController = __decorate([
    (0, common_1.Controller)('video')
], VideoController);
//# sourceMappingURL=video.controller.js.map