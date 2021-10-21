import { handlerPath } from '@libs/handlerResolver';
import type { AWS } from '@serverless/typescript';

export const catalogBatchProcess: AWS['functions'][string] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'],
        },
      },
    },
  ],
};
