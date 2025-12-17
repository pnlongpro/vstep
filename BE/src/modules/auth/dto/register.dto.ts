import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @MaxLength(100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số hoặc ký tự đặc biệt',
  })
  password: string;

  @ApiProperty({ example: 'Nguyen' })
  @IsString()
  @IsNotEmpty({ message: 'Họ không được để trống' })
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Van A' })
  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @MaxLength(100)
  lastName: string;
}
