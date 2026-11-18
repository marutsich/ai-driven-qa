import 'dotenv/config';

type RealWorldUser = {
  name: string;
  username: string;
  password: string;
};

type RealWorldProjectData = {
  baseUrl: string;
  apiBaseUrl: string;
  users: RealWorldUser[];
};

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function isRealWorldUser(user: unknown): user is RealWorldUser {
  return (
    typeof user === 'object' &&
    user !== null &&
    'name' in user &&
    typeof user.name === 'string' &&
    user.name.trim().length > 0 &&
    'username' in user &&
    typeof user.username === 'string' &&
    user.username.trim().length > 0 &&
    'password' in user &&
    typeof user.password === 'string' &&
    user.password.trim().length > 0
  );
}

function isRealWorldProjectData(data: unknown): data is RealWorldProjectData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'baseUrl' in data &&
    isHttpUrl(data.baseUrl) &&
    'apiBaseUrl' in data &&
    isHttpUrl(data.apiBaseUrl) &&
    'users' in data &&
    Array.isArray(data.users) &&
    data.users.length > 0 &&
    data.users.every(isRealWorldUser)
  );
}

export function getRealWorldProjectData(): RealWorldProjectData {
  const raw = process.env.REAL_WORLD_PROJECT_DATA;

  if (!raw?.trim()) {
    throw new Error('Set the REAL_WORLD_PROJECT_DATA environment variable.');
  }

  let data: unknown;

  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('REAL_WORLD_PROJECT_DATA must contain valid JSON.');
  }

  if (!isRealWorldProjectData(data)) {
    throw new Error(
      'REAL_WORLD_PROJECT_DATA requires HTTP or HTTPS URLs for baseUrl and apiBaseUrl ' +
        'and at least one user with a non-empty name, username, and password.',
    );
  }

  const apiUrl = new URL(data.apiBaseUrl);

  if (!apiUrl.pathname.endsWith('/')) {
    apiUrl.pathname += '/';
  }

  return { ...data, apiBaseUrl: apiUrl.href };
}

export function authFilePath(userName: string): string {
  return `.auth/realworld-${userName}.json`;
}
