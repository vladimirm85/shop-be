import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import ProductAPI from '../../dbApi';
import schema from './schema';
import { ProductData } from 'src/models';

const postProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  console.log('POST PRODUCT LAMBDA LAUNCHED WITH EVENT: ', event);

  try {
    const { title, description, price, count } = JSON.parse(
      // @ts-ignore
      event.body
    ) as ProductData;

    const product = await ProductAPI.postOne({
      title,
      description,
      price,
      count: count || 0,
    });

    if (!product) {
      console.log(`FAILED TO CREATE PRODUCT WITH DATA: `, event.body);
      return formatJSONResponse(500, {
        message: `FAILED TO CREATE PRODUCT WITH DATA`,
      });
    }

    return formatJSONResponse(200, { product });
  } catch (e) {
    console.log('DATABASE ERROR: ', e);
    return formatJSONResponse(500, { message: e.message });
  }
};

export const main = middyfy(postProduct);
