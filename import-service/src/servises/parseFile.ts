import csv from 'csv-parser';
import { S3, SQS } from 'aws-sdk';
import { Callback, S3EventRecord } from 'aws-lambda';

const { BUCKET, UPLOADED_FOLDER, PARSED_FOLDER } = process.env;

export class ParseFileService {
  constructor(private s3: S3, private callback: Callback<void>) {}

  async parse({ s3: { object } }: S3EventRecord) {
    const { key } = object;
    console.log('FILE PARSE PROCESS START');

    try {
      await this.parseFile(key);
      await this.moveToParsed(key, key.replace(UPLOADED_FOLDER, PARSED_FOLDER));

      console.log('FILE PARSE PROCESS FINISH');
    } catch (e) {
      console.error('FILE PARSE PROCESS ERROR: ', e);
      throw e;
    }
  }

  private async parseFile(key: string) {
    const params = {
      Bucket: BUCKET,
      Key: decodeURIComponent(key),
    };

    try {
      console.log(
        `CREATE READ STREAM FOR FILE IN ${BUCKET} BUCKET WITH KEY: ${key}`
      );

      const fileReadStream = this.s3.getObject(params).createReadStream();

      console.log('FILE PARSE START');

      return new Promise<void>((resolve, reject) =>
        fileReadStream
          .pipe(csv())
          .on('data', (chunk) => {
            console.log(`RECEIVE DATA PART: ${JSON.stringify(chunk)}`);
          })
          .on('error', (e) => {
            console.log('FILE PARSE ERROR: ', e);
            reject(e);
          })
          .on('end', () => {
            console.log('FILE PARSE FINISH');
            resolve();
          })
      );
    } catch (e) {
      console.log('FILE PARSE ERROR: ', e);
      throw e;
    }
  }

  private async moveToParsed(source: string, target: string): Promise<void> {
    console.log(`MOVE FILE FROM ${source} TO ${target} IN ${BUCKET} BUCKET`);
    const copyParams = {
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${source}`,
      Key: target,
    };
    const deleteParams = {
      Bucket: BUCKET,
      Key: decodeURIComponent(source),
    };

    try {
      console.log(`COPY FILE TO ${target}`);
      await this.s3.copyObject(copyParams).promise();

      console.log(`DELETE FILE FROM ${source}`);
      await this.s3.deleteObject(deleteParams).promise();

      console.info('MOVE FILE ENDED');
    } catch (e) {
      console.log('ERROR WHILE MOVING: ', e);
      throw e;
    }
  }

  private async sendToSQS(chunk: unknown): Promise<void> {
    const sqs = new SQS();

    sqs.sendMessage();
  }
}
