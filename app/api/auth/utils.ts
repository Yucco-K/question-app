export function extractTokensFromCookie(cookieHeader: string) {
  const cookies = cookieHeader.split('; ');
  const accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));
  const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refresh_token='));

  const accessToken = accessTokenCookie ? accessTokenCookie.split('=')[1] : undefined;
  const refreshToken = refreshTokenCookie ? refreshTokenCookie.split('=')[1] : undefined;

  return { accessToken, refreshToken };
}