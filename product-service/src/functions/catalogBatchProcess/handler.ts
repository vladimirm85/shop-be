import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import { SNS } from 'aws-sdk';
import { SQSHandler } from 'aws-lambda';

const { REGION } = process.env;

const catalogBatchProcess: SQSHandler = async (event) => {
  console.log('CATALOG BATCH PROCESS LAMBDA LAUNCHED WITH EVENT: ', event);

  try {
    const sns = new SNS({ region: REGION });
    const { Records } = event;
  } catch (e) {
    console.log('DATABASE ERROR: ', e);
  }
};

export const main = middyfy(catalogBatchProcess);
