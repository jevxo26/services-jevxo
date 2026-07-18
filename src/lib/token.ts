// Helper to check if we are in the browser environment
const isBrowser = () => typeof window !== "undefined";

const ACCESS_TOKEN_KEY = "jevxo services_access_token";
const REFRESH_TOKEN_KEY = "jevxo services_refresh_token";

// Cookie helper functions
export const setCookie = (name: string, value: string, days = 30): void => {
  if (!isBrowser()) return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  if (!isBrowser()) return null;
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const eraseCookie = (name: string): void => {
  if (!isBrowser()) return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const getAccessToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem("token");
};

export const getRefreshToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem("token", token);
  setCookie(ACCESS_TOKEN_KEY, token);
  setCookie("token", token);
};

export const setRefreshToken = (token: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
  setCookie(REFRESH_TOKEN_KEY, token);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem("token", accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  setCookie(ACCESS_TOKEN_KEY, accessToken);
  setCookie("token", accessToken);
  setCookie(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("jevxo services_user_role");
  eraseCookie(ACCESS_TOKEN_KEY);
  eraseCookie("token");
  eraseCookie(REFRESH_TOKEN_KEY);
  eraseCookie("jevxo services_user_role");
};
