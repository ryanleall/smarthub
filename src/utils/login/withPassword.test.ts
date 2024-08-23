import { describe, expect, test, vi } from 'vitest';

import fetchMock from 'app/test-utils/fetch-mock';

import loginWithPassword from './withPassword';

vi.mock('app/constants/config');

describe('loginWithPassword', () => {
  test('with successful response', async () => {
    fetchMock.post('https://kitsu.io/api/oauth/token', {
      status: 200,
      body: {
        access_token: 'TOKEN',
        token_type: 'Bearer',
        expires_in: 30 * 24 * 60 * 60,
        created_at: Date.now() / 1000,
      },
    });
    const session = await loginWithPassword({
      username: 'michiru',
      password: 'ogami ear scritches',
    });
    expect(session).not.toBeNull();
    expect(session?.accessToken).toBe('TOKEN');
  });
});
