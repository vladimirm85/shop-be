import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
import { ImportFileService } from 'src/servises';

const { REGION } = process.env;

const importProductsFile = async (event) => {
  console.log('IMPORT PRODUCTS FILE LAMBDA LAUNCHED WITH EVENT: ', event);

  try {
    const { name } = event.queryStringParameters;

    const s3 = new S3({ region: REGION });

    const importFileService = new ImportFileService(s3);

    const signedUrl = await importFileService.getSignedUrlPromise(name);

    return formatJSONResponse(200, { signedUrl });
  } catch (e) {
    console.log('DATABASE ERROR: ', e);
    return formatJSONResponse(500, { message: e.message });
  }
};

export const main = middyfy(importProductsFile);
