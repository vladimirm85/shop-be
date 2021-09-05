import { main } from './handler';
import { FormatJSONResponse } from '@libs/apiGateway';
import { Product } from 'src/dbApi/apiInterface';

const event = require('./mock.json');

describe('getProductsById lambda test', () => {
  test('lambda returns success response', async () => {
    const response = (await main(event, null, null)) as FormatJSONResponse;

    expect(response.statusCode).toBe(200);
  });

  test('lambda response data is exists', async () => {
    const response = (await main(event, null, null)) as FormatJSONResponse;
    const product = JSON.parse(response.body);

    expect(product).toBeTruthy();
  });

  test('lambda response data is product', async () => {
    const response = (await main(event, null, null)) as FormatJSONResponse;
    const { product } = JSON.parse(response.body);

    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('count');
    expect(product).toHaveProperty('description');
  });

  test('lambda returns correct product', async () => {
    const response = (await main(event, null, null)) as FormatJSONResponse;
    const { product } = JSON.parse(response.body) as { product: Product };

    expect(product.id).toBe('92f26fbb-dacd-44c5-8490-2fc8c09b5941');
    expect(product.count).toBe(11);
    expect(product.description).toBe('Alfa Romeo Racing Orlen');
    expect(product.price).toBe(132);
    expect(product.title).toBe('Alfa Romeo Poster');
  });

  test('lambda returns 404 error on incorrect id', async () => {
    const event = {
      pathParameters: {
        id: '6cb93017-f811-4019-be44-f3fc3502e7d0',
      },
    };

    const response = (await main(event, null, null)) as FormatJSONResponse;

    expect(response.statusCode).toBe(404);
  });

  test('lambda returns error on invalid id', async () => {
    const event = {
      pathParameters: {
        id: 'invalid id',
      },
    };

    const response = (await main(event, null, null)) as FormatJSONResponse;

    expect(response.statusCode).toBe(500);
  });
});
