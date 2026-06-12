const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function setAccessTokenCookie(token: string): void {
  if (!isBrowser()) return;
  document.cookie = `access_token=${encodeURIComponent(token)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearAccessTokenCookie(): void {
  if (!isBrowser()) return;
  document.cookie = "access_token=; Path=/; Max-Age=0; SameSite=Lax";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthTokens(accessToken: string, refreshToken?: string | null): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken !== undefined && refreshToken !== null) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  setAccessTokenCookie(accessToken);
}

export function clearAuthTokens(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  clearAccessTokenCookie();
}
