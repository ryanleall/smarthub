import { describe, expect, test, vi } from 'vitest';

import { LoginFailed, NetworkError } from 'app/errors';
import fetchMock from 'app/test-utils/fetch-mock';

import loginWithAssertion from './withAssertion';

vi.mock('app/constants/config');

describe('loginWithAssertion', () => {
  test('with successful response', async () => {
    fetchMock.post('https://kitsu.io/api/oauth/token', {
      status: 200,
      body: {
        access_token: 'TOKEN',
        token_type: 'Bearer',
        expires_in: 30 * 24 * 60 * 60,
        refresh_token: 'REFRESH-TOKEN',
        scope: 'public',
        created_at: Date.now() / 1000,
      },
    });
    const session = await loginWithAssertion({
      token: 'FACEBOOK-TOKEN',
      provider: 'facebook',
    });
    expect(session).not.toBeNull();
    expect(session?.accessToken).toBe('TOKEN');
    expect(session?.refreshToken).toBe('REFRESH-TOKEN');
  });

  test('with failed response', async () => {
    fetchMock.post('https://kitsu.io/api/oauth/token', {
      status: 401,
      body: {
        error: 'invalid_grant',
        error_description: 'Login failed',
      },
    });

    await expect(
      loginWithAssertion({
        token: 'FACEBOOK-TOKEN',
        provider: 'facebook',
      })
    ).rejects.toThrow(LoginFailed);
  });

  test('with a network error', async () => {
    fetchMock.post('https://kitsu.io/api/oauth/token', {
      throws: new TypeError('Network Error'),
    });

    await expect(
      loginWithAssertion({
        token: 'FACEBOOK-TOKEN',
        provider: 'facebook',
      })
    ).rejects.toThrow(NetworkError);
  });
});
