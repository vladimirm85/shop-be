export const getCredentials = (authorizationToken) => {
  const [_, token] = authorizationToken.split(' ');
  const credentialsString = Buffer.from(token, 'base64');
  const [username, password] = credentialsString.toString('utf-8').split(':');
  return { username, password, token };
};
