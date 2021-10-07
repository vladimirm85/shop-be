import 'source-map-support/register';
import { middyfy } from '@libs/lambda';
import { CatalogBatchProcessService } from 'src/services/catalogBatch';
import { SQSHandler } from 'aws-lambda';
import API from 'src/dbApi';

const catalogBatchProcess: SQSHandler = async (event) => {
  console.log('CATALOG BATCH PROCESS LAMBDA LAUNCHED WITH EVENT: ', event);

  try {
    const { Records } = event;

    const CatalogBatchService = new CatalogBatchProcessService(API);

    await Promise.all(
      Records.map((record) => CatalogBatchService.handleRecord(record))
    );

    console.log('CATALOG BATCH PROCESS LAMBDA FINISHED');
  } catch (e) {
    console.log('DATABASE ERROR: ', e);
  }
};

export const main = middyfy(catalogBatchProcess);
