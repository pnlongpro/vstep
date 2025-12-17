'use client';

import GoogleLoginButton from './GoogleLoginButton';

interface SocialLoginButtonsProps {
  mode?: 'login' | 'register';
  redirectTo?: string;
}

export default function SocialLoginButtons({
  mode = 'login',
  redirectTo,
}: SocialLoginButtonsProps) {
  return (
    <div className="space-y-3">
      <GoogleLoginButton
        mode={mode}
        redirectTo={redirectTo}
        onError={(error) => {
          console.error('Social login error:', error);
        }}
      />
    </div>
  );
}
