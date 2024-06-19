import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { from, map, Observable } from 'rxjs';

const accessKey = process.env['AWS_ACCESS_KEY_ID'] as string;
const secretAccessKey = process.env['AWS_SECRET_ACCESS_KEY'] as string;
const exercisrBucket = process.env['EXERCISR_BUCKET'] as string;

@Injectable()
export class AwsService {
  s3 = new AWS.S3({
    credentials: {
      secretAccessKey: secretAccessKey,
      accessKeyId: accessKey,
    },
  });

  ses = new AWS.SES({
    credentials: {
      secretAccessKey,
      accessKeyId: accessKey,
    },
    region: 'us-east-1',
  });

  public uploadExercisrFile(key: string, file: Buffer, fileType: string) {
    return this._uploadFile(exercisrBucket, key, file, fileType);
  }

  public sendEmail(
    email: string,
    emailText: string,
    subject: string
  ): Observable<boolean> {
    return from(
      this.ses
        .sendEmail({
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Body: {
              Text: {
                Data: emailText,
              },
            },
            Subject: {
              Data: subject,
            },
          },
          Source: 'Run Across America <dev@cockpitmobile.com>',
          ReplyToAddresses: ['hello@nationwiderun.org'],
        })
        .promise()
    ).pipe(
      map((response) => {
        if (response.$response.error) {
          console.error(response.$response.error);
          return false;
        }
        return true;
      })
    );
  }

  private _uploadFile(
    bucket: string,
    key: string,
    file: Buffer,
    fileType: string
  ) {
    return from(
      this.s3
        .putObject({
          Bucket: bucket,
          Key: key,
          Body: file,
          ContentType: fileType,
          ACL: 'public-read',
        })
        .promise()
    ).pipe(
      map((response) => ({
        link: `https://${bucket}.s3.us-east-2.amazonaws.com/${key}`,
      }))
    );
  }
}
