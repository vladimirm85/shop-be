import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { getProduct as getDBProduct } from 'src/db';

const getProduct: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  try {
    const id = JSON.parse(event.pathParameters as any).id;
    const product = await getDBProduct(id);

    if (!product) {
      return formatJSONResponse(404, {
        message: `No such product with id: ${id}`,
      });
    }

    return formatJSONResponse(200, { product });
  } catch (e) {
    console.log(e);
    return formatJSONResponse(404, { message: e.message });
  }
};

export const main = middyfy(getProduct);
