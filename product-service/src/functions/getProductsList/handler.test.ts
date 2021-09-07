import { main } from './handler';
import { FormatJSONResponse } from '@libs/apiGateway';

describe('getProductsList lambda test', () => {
  test('lambda returns success response', async () => {
    const response = (await main({}, null, null)) as FormatJSONResponse;

    expect(response.statusCode).toBe(200);
  });
  test('lambda response data is exists', async () => {
    const response = (await main({}, null, null)) as FormatJSONResponse;
    const { products } = JSON.parse(response.body);

    expect(Array.isArray(products)).toBe(true);
  });
  test('lambda response data is array', async () => {
    const response = (await main({}, null, null)) as FormatJSONResponse;
    const { products } = JSON.parse(response.body);

    expect(products).toBeTruthy();
  });
  test('lambda response data is array of products', async () => {
    const response = (await main({}, null, null)) as FormatJSONResponse;
    const { products } = JSON.parse(response.body);

    for (let i = 0; i < products.length; i += 1) {
      expect(products[i]).toHaveProperty('id');
      expect(products[i]).toHaveProperty('title');
      expect(products[i]).toHaveProperty('price');
      expect(products[i]).toHaveProperty('count');
      expect(products[i]).toHaveProperty('description');
    }
  });
});
