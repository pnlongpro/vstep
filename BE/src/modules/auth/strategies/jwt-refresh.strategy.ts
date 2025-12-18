import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<any> {
    const refreshToken = req.body.refreshToken;

    // Find session with this refresh token
    const session = await this.sessionRepository.findOne({
      where: {
        refreshToken,
        isActive: true,
      },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if session expired
    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Get user
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      user,
      refreshToken,
      sessionId: session.id,
    };
  }
}
