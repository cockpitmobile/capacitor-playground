import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '@cockpit/api/models';
import { User } from '@prisma/client';
import { EmailService } from '@cockpit/api-data-access-email';
import { firstValueFrom } from 'rxjs';
import { generateAccessCode } from '@cockpit/api-util-access-code';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly _email: EmailService
  ) {}

  getAll(options?: Partial<User>): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        ...options,
      },
    });
  }

  create(user: User): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...user,
      },
    });
  }

  async signUp(data: User): Promise<User> {
    const accessCode = await this._getNewUserAccessCode();
    return this.prisma.user.create({
      data: {
        ...data,
        accessCode,
      },
    });
  }

  async sendResetAccessCodeEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException(
        'No user with that phone or email address found.',
        500
      );
    }

    const userCode = await this._getNewUserAccessCode();
    await this.prisma.user.update({
      data: {
        accessCode: userCode,
      },
      where: {
        email,
      },
    });
    const message = `${userCode} is your new Run Across America login code. Copy/paste the code to make sure it matches exactly.`;

    const hasSent = await firstValueFrom(
      this._email.sendEmail(
        email,
        message,
        'New Login Code for Run Across America'
      )
    );

    if (hasSent) {
      return hasSent;
    }
    throw new HttpException('Could not send message to email address.', 500);
  }

  private async _getNewUserAccessCode(): Promise<string> {
    let userCode = generateAccessCode();
    let user = await this.prisma.user.findMany({
      where: {
        accessCode: userCode,
      },
    });

    while (user.length) {
      userCode = generateAccessCode();
      // eslint-disable-next-line no-await-in-loop
      user = await this.prisma.user.findMany({
        where: {
          accessCode: userCode,
        },
      });
    }

    return userCode;
  }
}
