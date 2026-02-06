import { Controller, Post, Body } from '@nestjs/common';
import { mkdirSync, renameSync, existsSync } from 'fs';
import { join } from 'path';

interface GatewayPayload {
  filePath: string;
  inspectionId: string;
  evidenceType: 'VIDEO' | 'AUDIO';
}

@Controller('gateway')
export class VideoGatewayController {

  @Post('receive')
  async receiveFile(@Body() payload: GatewayPayload) {
    try {
      const { filePath, evidenceType } = payload;
      if (!existsSync(filePath)) {
        return { status: 'ERROR', message: 'File not found' };
      }

      const outboxDir = join('outbox', evidenceType.toLowerCase());
      mkdirSync(outboxDir, { recursive: true });

      const fileName = filePath.split(/[\\/]/).pop();
      if (!fileName) {
        return { status: 'ERROR', message: 'Invalid file path' };
      }
      const newPath = join(outboxDir, fileName);

      renameSync(filePath, newPath);

      console.log(`[API Gateway] Moved file ${fileName} to ${outboxDir}`);
      return { status: 'DELIVERED', newPath };
    } catch (err) {
      console.error('[API Gateway] Error moving file:', err);
      return { status: 'ERROR', message: err.message };
    }
  }
}
