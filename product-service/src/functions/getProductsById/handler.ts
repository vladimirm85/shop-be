import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import API from '../../dbApi';

const getProduct: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  console.log('GET PRODUCT LAMBDA LAUNCHED WITH EVENT: ', event);

  try {
    const id = event.pathParameters.id;
    const product = await API.getOne(id);

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
