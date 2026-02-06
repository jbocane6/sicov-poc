import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(express.json());

  expressApp.post('/ingest', (req, res) => {
    if (process.env.GATEWAY_MODE === 'offline') {
      return res.status(500).send();
    }
    console.log('[Gateway] Received', req.body.inspectionId);
    res.status(202).send();
  });

  await app.listen(3000);
}
bootstrap();
