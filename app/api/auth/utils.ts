// app/api/auth/utils.ts
export function extractTokensFromCookie(cookieHeader: string) {
  const cookies = cookieHeader.split('; ');

  const accessToken = cookies.find(cookie => cookie.startsWith('access_token='))?.split('=')[1];
  const refreshToken = cookies.find(cookie => cookie.startsWith('refresh_token='))?.split('=')[1];

  return { accessToken, refreshToken };
}
