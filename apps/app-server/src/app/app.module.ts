import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModelsModule } from '@cockpit/api/models';
import { ActivitiesControllersModule } from '@cockpit/api/activities-controllers';
import { ApiAdminUsersControllersModule } from '@cockpit/api-admin-users-controllers';

@Module({
  imports: [
    ApiModelsModule,
    ActivitiesControllersModule,
    ApiAdminUsersControllersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
