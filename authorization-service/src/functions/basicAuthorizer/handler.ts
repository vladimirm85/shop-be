import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';
import { generatePolicy, getCredentials } from 'src/utils';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event,
  _,
  cb
) => {
  console.log('BASIC AUTHORIZER LAMBDA LAUNCHED WITH EVENT: ', event);

  const { type, methodArn, authorizationToken } = event;

  if (type !== 'TOKEN') {
    cb('Unauthorized');
  }

  try {
    const { username, password, token } = getCredentials(authorizationToken);

    console.log(`USERNAME: ${username}, PASSWORD: ${password}`);

    const storedUserPassword = process.env[username];

    const effect =
      !storedUserPassword || storedUserPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolicy(token, methodArn, effect);

    cb(null, policy);

    return policy;
  } catch (e) {
    console.log('ERROR: ', e);
    cb(`ERROR: ${JSON.stringify(e)}`);
  }
};

export const main = middyfy(basicAuthorizer);
