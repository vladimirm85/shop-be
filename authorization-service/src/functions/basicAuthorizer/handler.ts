import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import { APIGatewayAuthorizerHandler } from 'aws-lambda';

const { REGION } = process.env;

const basicAuthorizer: APIGatewayAuthorizerHandler = async (
  { type, methodArn, authorizationToken },
  _,
  cb
) => {
  console.log('BASIC AUTHORIZER LAMBDA LAUNCHED WITH EVENT: ', event);

  if (type !== 'TOKEN') {
    cb('Unauthorized');
  }

  try {
    console.log('IMPORT FILE PARSER LAMBDA FINISHED: SUCCESSFULLY PARSED');
  } catch (e) {
    console.log('DATABASE ERROR: ', e);
  }
};

export const main = middyfy(basicAuthorizer);
