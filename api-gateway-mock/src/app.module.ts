import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoGatewayController } from './video.gateway.controller';

@Module({
  imports: [],
  // controllers: [AppController],
  controllers: [VideoGatewayController],
  providers: [AppService],
})
export class AppModule {}
