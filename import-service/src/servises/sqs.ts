import { SQS } from 'aws-sdk';

const { REGION, CATALOG_ITEMS_QUEUE_URL } = process.env;

export class SQSService {
  constructor(private message: string) {}

  private getSQSClient() {
    return new SQS({ region: REGION });
  }

  public async sendMessage(): Promise<void> {
    console.log(`SENDING MESSAGE TO SQS, MESSAGE: ${this.message}`);
    try {
      const res = await this.getSQSClient()
        .sendMessage({
          QueueUrl: CATALOG_ITEMS_QUEUE_URL,
          MessageBody: this.message,
        })
        .promise();
      console.log(`MESSAGE SENT WITH RESPONSE: ${JSON.stringify(res)}`);
    } catch (e) {
      console.log(`FAILED TO SEND MESSAGE: ${JSON.stringify(e)}`);
    }
  }
}
