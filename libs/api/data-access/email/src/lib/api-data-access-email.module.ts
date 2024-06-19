import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AwsModule } from '@cockpit/api/aws';

@Module({
  imports: [AwsModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class ApiDataAccessEmailModule {}
