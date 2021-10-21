import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import ProductAPI from '../../dbApi';
import { validateUUID } from 'src/services';

const getProduct: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log('GET PRODUCT LAMBDA LAUNCHED WITH EVENT: ', event);

  try {
    const { id } = event.pathParameters;

    if (!validateUUID(id)) {
      console.log(`PRODUCT ID: ${id} IS NOT UUID`);

      return formatJSONResponse(400, {
        message: `Invalid path parameter`,
      });
    }

    const product = await ProductAPI.getOne(id);

    if (!product) {
      console.log(`PRODUCT WITH ID: ${id} NOT FOUND`);
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
