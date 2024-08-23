export const apiHost = (import.meta.env.VITE_API_HOST as string) ?? '';
export const clientId = (import.meta.env.VITE_CLIENT_ID as string) ?? '';

export const nanoauthCredentials = {
  myanimelist: {
    clientId: (import.meta.env.VITE_MYANIMELIST_CLIENT_ID as string) ?? '',
  },
};
