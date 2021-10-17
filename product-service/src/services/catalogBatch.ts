import { DbApiInterface } from 'src/dbApi/apiInterface';
import { SNS } from 'aws-sdk';
import { SQSRecord } from 'aws-lambda';
import { ProductValidator } from 'src/services/productValidator';
import { Product } from 'src/models';

const { REGION, CREATE_PRODUCT_TOPIC } = process.env;

export class CatalogBatchProcessService {
  constructor(private dbApi: DbApiInterface) {}

  private getSNSClient() {
    return new SNS({ region: REGION });
  }

  public async handleRecord(record: SQSRecord): Promise<void> {
    console.log(
      `PRODUCT HANDLING STARTED WITH DATA: ${JSON.stringify(record)}`
    );
    try {
      const { body: productCandidate } =
        typeof record === 'string' ? JSON.parse(record) : record;

      const product =
        typeof productCandidate === 'string'
          ? JSON.parse(productCandidate)
          : productCandidate;

      console.log('PRODUCT VALIDATION STARTED, PRODUCT: ', product);
      const isValidProduct = this.validateProduct(product);
      if (!isValidProduct) {
        console.log('PRODUCT NOT VALID');
        throw new Error('PRODUCT NO VALID');
      }
      console.log('PRODUCT IS VALID');

      console.log('CREATING NEW PRODUCT');
      const createdProduct = await this.dbApi.postOne(product);
      console.log(`PRODUCT CREATED: ${JSON.stringify(createdProduct)}`);

      await this.sendSNSMessage(createdProduct);
    } catch (e) {
      console.log(`PRODUCT HANDLING FAILED: `, e);
    }
  }

  private validateProduct(obj: unknown) {
    const validator = new ProductValidator(obj);

    return validator.validate();
  }

  private async sendSNSMessage(product: Product): Promise<void> {
    try {
      console.log('SENDING MESSAGE TO SNS');
      await this.getSNSClient()
        .publish({
          Subject: 'Created new product in DB',
          Message: JSON.stringify(product),
          TopicArn: CREATE_PRODUCT_TOPIC,
          MessageAttributes: {
            price: {
              DataType: 'Number',
              StringValue: `${product.price}`,
            },
          },
        })
        .promise();
      console.log('MESSAGE SENT');
    } catch (e) {
      console.log(`FAILED TO SEND MESSAGE: ${JSON.stringify(e)}`);
    }
  }
}
