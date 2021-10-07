import 'source-map-support/register';
import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import ProductAPI from '../../dbApi';
import schema from './schema';
import { ProductData } from 'src/models';

const postProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  console.log('POST PRODUCT LAMBDA LAUNCHED WITH EVENT: ', event);

  try {
    const projectData = (
      typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    ) as ProductData;

    const product = await ProductAPI.postOne(projectData);

    if (!product) {
      console.log(`FAILED TO CREATE PRODUCT WITH DATA: `, event.body);
      return formatJSONResponse(500, {
        message: `Failed to create product`,
      });
    }

    return formatJSONResponse(200, { product });
  } catch (e) {
    console.log('DATABASE ERROR: ', e);
    return formatJSONResponse(500, { message: e.message });
  }
};

export const main = middyfy(postProduct);
