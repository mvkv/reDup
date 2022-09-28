import config from '../config.json';

export const RedirectToGoogleAuth = () => {
  const scope = config.googleScopes.join(' ');

  const params = {
    response_type: 'code',
    client_id: config.googleClientId,
    redirect_uri: config.authRedirectUri,
    prompt: 'select_account',
    access_type: 'offline',
    scope,
  };

  const urlParams = new URLSearchParams(params).toString();
  window.location.href = `${config.googleAuthUrl}?${urlParams}`;
};
