export function setCookie(name: string, value: string, days: number = 30) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

export function getCookie(name: string): string | null {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(cookieName)) {
      return cookie.substring(cookieName.length);
    }
  }
  return null;
}

export function parseJSONCookie<T>(name: string, defaultValue: T): T {
  const cookie = getCookie(name);
  if (!cookie) return defaultValue;
  
  try {
    return JSON.parse(cookie) as T;
  } catch {
    return defaultValue;
  }
}

export function setJSONCookie(name: string, value: any, days: number = 30) {
  setCookie(name, JSON.stringify(value), days);
} 