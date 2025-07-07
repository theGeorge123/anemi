export function getOrSetCsrfToken(): string {
  if (typeof window === 'undefined') return '';
  let token = getCookie('csrf_token');
  if (!token) {
    token = crypto.randomUUID();
    setCookie('csrf_token', token, 1); // 1 day expiry
  }
  return token;
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match && typeof match[2] === 'string' ? match[2] : null;
}

export function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict`;
} 