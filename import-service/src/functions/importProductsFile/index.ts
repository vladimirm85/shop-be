import { handlerPath } from '@libs/handlerResolver';
import type { AWS } from '@serverless/typescript';

export const importProductsFile: AWS['functions'][string] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        authorizer: {
          name: 'basicAuthorizer',
          arn: {
            'Fn::ImportValue': 'AuthorizerARN',
          },
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
      },
    },
  ],
};
