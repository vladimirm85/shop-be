import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { getProduct as getDBProduct } from 'src/db';

const getProduct: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log('GET PRODUCT LAMBDA LAUNCHED WITH EVENT: ', event);

  try {
    const id = event.pathParameters.id;
    const product = await getDBProduct(id);

    if (!product) {
      return formatJSONResponse(404, {
        message: `No such product with id: ${id}`,
      });
    }

    return formatJSONResponse(200, { product });
  } catch (e) {
    console.log('DATABASE ERROR: ', e);
    return formatJSONResponse(500, { message: e.message });
  }
};

export const main = middyfy(getProduct);
