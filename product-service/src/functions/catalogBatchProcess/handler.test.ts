import { ProductValidator } from 'src/services/productValidator';
import { Product, ProductData } from 'src/models';
import { CatalogBatchProcessService } from 'src/services/catalogBatch';
import { DbApiInterface } from 'src/dbApi/apiInterface';
const event = require('./mockedEvent.json');
const validProduct = require('./mockedValidProduct.json');
const invalidProduct = require('./mockedInvalidProduct.json');

class MockedDbApi implements DbApiInterface {
  constructor() {}

  get(): Promise<Product[]> {
    return Promise.resolve([]);
  }

  getOne(id: string): Promise<Product> {
    console.log(id);
    return Promise.resolve(undefined);
  }

  postOne(productData: ProductData): Promise<Product> {
    return Promise.resolve({
      ...productData,
      id: '6eed2b80-61aa-4499-8617-0c69b854caef',
    });
  }
}

describe('importProductsFile lambda test', () => {
  const dbApi = new MockedDbApi();
  const catalogBatchService = new CatalogBatchProcessService(dbApi);

  test('Product validator returns true on valid product', async () => {
    const validator = new ProductValidator(validProduct);

    expect(validator.validate()).toBe(true);
  });

  test('Product validator returns false on valid product', async () => {
    const validator = new ProductValidator(invalidProduct);

    expect(validator.validate()).toBe(false);
  });

  test('catalogBatchProcess should create new products', async () => {
    const mockedDbApi = jest.spyOn(MockedDbApi.prototype, 'postOne');

    const { Records } = event;

    await Promise.all(
      Records.map((record) => {
        catalogBatchService.handleRecord(record);
      })
    );

    expect(mockedDbApi).toHaveBeenCalledTimes(2);
  });

  test('catalogBatchProcess should send message to SNS', async () => {
    const catalogBatchProcessSpy = jest.spyOn(
      CatalogBatchProcessService.prototype as any,
      'sendSNSMessage'
    );

    const { Records } = event;

    await Promise.all(
      Records.map((record) => {
        catalogBatchService.handleRecord(record);
      })
    );

    expect(catalogBatchProcessSpy).toHaveBeenCalledTimes(2);
  });
});
