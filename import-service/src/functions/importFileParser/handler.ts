import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
import { ParseFileService } from 'src/servises/parseFile';
import { S3EventRecord } from 'aws-lambda';
import { S3Handler } from 'aws-lambda';

const { REGION } = process.env;

const importFileParser: S3Handler = async (event) => {
  console.log('IMPORT FILE PARSER LAMBDA LAUNCHED WITH EVENT: ', event);

  try {
    const { Records: RecordsPromise } = event;

    const records = await Promise.all<S3EventRecord>(RecordsPromise);

    const s3 = new S3({ region: REGION });
    const parseFileService = new ParseFileService(s3);

    await Promise.all(records.map((record) => parseFileService.parse(record)));

    console.log('IMPORT FILE PARSER LAMBDA FINISHED: SUCCESSFULLY PARSED');
  } catch (e) {
    console.log('DATABASE ERROR: ', e);
  }
};

export const main = middyfy(importFileParser);
