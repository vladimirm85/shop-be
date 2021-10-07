import { handlerPath } from '@libs/handlerResolver';
import type { AWS } from '@serverless/typescript';

export const importFileParser: AWS['functions'][string] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: '${self:provider.environment.BUCKET}',
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [
          {
            prefix: '${self:provider.environment.UPLOADED_FOLDER}/',
          },
        ],
      },
    },
  ],
};
