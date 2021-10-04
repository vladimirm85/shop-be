import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import CatalogBatchService from 'src/services/catalogBatch';
import { SQSHandler } from 'aws-lambda';

const catalogBatchProcess: SQSHandler = async (event) => {
  console.log('CATALOG BATCH PROCESS LAMBDA LAUNCHED WITH EVENT: ', event);

  try {
    const { Records } = event;

    await Promise.all(
      Records.map((record) => CatalogBatchService.handleRecord(record))
    );

    console.log('CATALOG BATCH PROCESS LAMBDA FINISHED');
  } catch (e) {
    console.log('DATABASE ERROR: ', e);
  }
};

export const main = middyfy(catalogBatchProcess);
