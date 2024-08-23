import { addSeconds } from 'date-fns';

import { apiHost, clientId } from 'app/constants/config';
import { LoginFailed, NetworkError } from 'app/errors';
import { Session } from 'app/types/session';

export default async function login({
  params = {},
  init,
}: {
  params?: Record<string, string>;
  init?: RequestInit;
}): Promise<NonNullable<Session>> {
  const body = new URLSearchParams(params);
  body.set('client_id', clientId);
  const response = await fetch(`${apiHost}api/oauth/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
    ...init,
  }).catch((e) => {
    throw new NetworkError(e.message);
  });
  const json = await response.json();

  if (response.status === 200) {
    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      loggedIn: true,
      expiresAt: addSeconds(new Date(), json.expires_in),
    };
  } else {
    switch (json.error) {
      case 'invalid_grant':
        throw new LoginFailed(json.error_description);
      default:
        throw new Error(json.error_description);
    }
  }
}
