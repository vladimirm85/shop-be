import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getProducts as getDBProducts } from '../../db';

const getProducts: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log('GET PRODUCT LAMBDA LAUNCHED WITH EVENT: ', event);

  try {
    const products = await getDBProducts();

    if (products) {
      return formatJSONResponse(200, { products });
    }
  } catch (e) {
    console.log('DATABASE ERROR: ', e);
    formatJSONResponse(404, { message: e.message });
  }
};

export const main = middyfy(getProducts);
