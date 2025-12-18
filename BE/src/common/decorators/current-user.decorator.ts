import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../modules/users/entities/user.entity';

/**
 * Get current authenticated user from request
 */
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
