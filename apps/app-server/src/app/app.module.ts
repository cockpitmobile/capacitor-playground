import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModelsModule } from '@cockpit/api/models';
import { ActivitiesControllersModule } from '@cockpit/api/activities-controllers';

@Module({
  imports: [ApiModelsModule, ActivitiesControllersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
