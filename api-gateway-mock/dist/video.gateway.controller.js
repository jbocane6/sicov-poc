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
exports.VideoGatewayController = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let VideoGatewayController = class VideoGatewayController {
    async receiveFile(payload) {
        try {
            const { filePath, evidenceType } = payload;
            if (!(0, fs_1.existsSync)(filePath)) {
                return { status: 'ERROR', message: 'File not found' };
            }
            const outboxDir = (0, path_1.join)('outbox', evidenceType.toLowerCase());
            (0, fs_1.mkdirSync)(outboxDir, { recursive: true });
            const fileName = filePath.split(/[\\/]/).pop();
            if (!fileName) {
                return { status: 'ERROR', message: 'Invalid file path' };
            }
            const newPath = (0, path_1.join)(outboxDir, fileName);
            (0, fs_1.renameSync)(filePath, newPath);
            console.log(`[API Gateway] Moved file ${fileName} to ${outboxDir}`);
            return { status: 'DELIVERED', newPath };
        }
        catch (err) {
            console.error('[API Gateway] Error moving file:', err);
            return { status: 'ERROR', message: err.message };
        }
    }
};
exports.VideoGatewayController = VideoGatewayController;
__decorate([
    (0, common_1.Post)('receive'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoGatewayController.prototype, "receiveFile", null);
exports.VideoGatewayController = VideoGatewayController = __decorate([
    (0, common_1.Controller)('gateway')
], VideoGatewayController);
//# sourceMappingURL=video.gateway.controller.js.map