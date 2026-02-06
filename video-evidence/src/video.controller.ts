import { Controller, Post, Param, Get } from '@nestjs/common';
import { writeFileSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { createNatsClient } from '../../libs/nats-client';
import { EvidenceStoredEvent, EvidenceType } from '../../libs/event-contracts';

@Controller('video')
export class VideoController {

  @Get()
  async healthCheck() {
    return { status: 'Video Evidence Service is healthy' };
  }

  @Post(':inspectionId')
  async generate(@Param('inspectionId') inspectionId: string) {
    mkdirSync('C://storage/video', { recursive: true });

    const filePath = `C://storage/video/${inspectionId}-${Date.now()}.mp4`;
    writeFileSync(filePath, 'FAKE VIDEO DATA');

    const event: EvidenceStoredEvent = {
      eventId: randomUUID(),
      inspectionId,
      evidenceType: EvidenceType.VIDEO,
      filePath,
      createdAt: new Date().toISOString(),
    };

    const nc = await createNatsClient();
    const ack = await nc.request(
      'evidence.video.stored',
      JSON.stringify(event),
      { timeout: 3000 },
    );

    await nc.close();

    return JSON.parse(ack.data.toString());
  }
}
