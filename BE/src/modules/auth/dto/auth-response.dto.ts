import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ nullable: true })
  avatar: string | null;

  @ApiProperty()
  status: string;

  @ApiProperty({ nullable: true })
  emailVerifiedAt: string | null;

  @ApiProperty()
  role: {
    id: string;
    name: string;
    displayName: string;
  };

  static fromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      avatar: user.avatar || null,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null,
      role: {
        id: user.role?.id || '',
        name: user.role?.name || '',
        displayName: user.role?.displayName || '',
      },
    };
  }
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}
