import { Injectable } from '@nestjs/common';
import { AwsService } from '@cockpit/api/aws';
import { Observable } from 'rxjs';

@Injectable()
export class EmailService {
  constructor(private readonly _aws: AwsService) {}

  sendEmail(
    email: string,
    emailText: string,
    subject: string
  ): Observable<boolean> {
    return this._aws.sendEmail(email, emailText, subject);
  }
}
