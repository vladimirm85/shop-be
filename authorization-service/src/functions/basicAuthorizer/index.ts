import { handlerPath } from '@libs/handlerResolver';
import type { AWS } from '@serverless/typescript';

export const basicAuthorizer: AWS['functions'][string] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
};
