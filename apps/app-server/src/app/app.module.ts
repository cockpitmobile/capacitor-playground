import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModelsModule } from '@cockpit/api/models';
import { ActivitiesControllersModule } from '@cockpit/api/activities-controllers';
import { ApiAdminUsersControllersModule } from '@cockpit/api-admin-users-controllers';
import { ApiUsersModule } from '@cockpit/api-users';
import { ApiControllersActivityTypesModule } from '@cockpit/api-controllers-activity-types';
import { ApiControllersAdminActivityTypesModule } from '@cockpit/api-controllers-admin-activity-types';
import { ApiControllersAuthenticationModule } from '@cockpit/api-controllers-authentication';
import { JwtModule } from '@nestjs/jwt';
import {
  JWT_CONSTANTS,
  REDIS_CLIENT_OPTIONS,
} from '@cockpit/api-util-constants';
import { ApiGuardAuthenticationModule } from '@cockpit/api-guard-authentication';
import { ApiControllersAdminBadgesModule } from '@cockpit/api/controllers/admin/badges';
import { ApiControllersBadgesModule } from '@cockpit/api/controllers/badges';
import { ApiControllersHabitsModule } from '@cockpit/api/habits';
import { ApiControllersRewardsModule } from '@cockpit/api-controllers-rewards';
import { ApiControllersAdminRewardsModule } from '@cockpit/api-controllers-admin-rewards';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ApiDataAccessCacheModule } from '@cockpit/api/data-access/cache-service';
import { ProjectsControllerModule } from '../../../../libs/api/controllers/projects/projectsControllerModule';

@Module({
  imports: [
    ApiModelsModule,
    ActivitiesControllersModule,
    ApiAdminUsersControllersModule,
    ApiControllersAdminBadgesModule,
    ApiControllersBadgesModule,
    ApiUsersModule,
    ApiControllersActivityTypesModule,
    ApiControllersAdminActivityTypesModule,
    ApiControllersAuthenticationModule,
    ApiGuardAuthenticationModule,
    ApiControllersHabitsModule,
    ApiControllersRewardsModule,
    ApiControllersAdminRewardsModule,
    ApiDataAccessCacheModule,
    ProjectsControllerModule,
    JwtModule.register({
      global: true,
      secret: JWT_CONSTANTS.secret,
      signOptions: { expiresIn: '31d' },
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: REDIS_CLIENT_OPTIONS.host,
            port: REDIS_CLIENT_OPTIONS.port,
          },
          password: REDIS_CLIENT_OPTIONS.password,
          username: REDIS_CLIENT_OPTIONS.user,
          ttl: 50000,
        }),
      }),
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
