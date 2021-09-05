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

    expect(product.id).toBe('59f5d715-ea70-4123-a78c-0380eec93ede');
    expect(product.count).toBe(4);
    expect(product.description).toBe('Mercedes-AMG Petronas F1 Team');
    expect(product.price).toBe(200);
    expect(product.title).toBe('Mercedes Poster');
  });

  test('lambda returns error on incorrect id', async () => {
    const event = {
      pathParameters: {
        id: 'incorrect id',
      },
    };

    const response = (await main(event, null, null)) as FormatJSONResponse;

    expect(response.statusCode).toBe(404);
  });
});
