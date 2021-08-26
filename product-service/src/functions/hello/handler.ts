import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

// import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log(event)
  return formatJSONResponse({
    productName: `Hello, welcome to the exciting Serverless world!`,
    event,
  });
}

export const main = middyfy(hello);
