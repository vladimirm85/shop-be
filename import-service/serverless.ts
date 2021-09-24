import type { AWS } from '@serverless/typescript';
import { importProductsFile, importFileParser } from 'src/functions';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  variablesResolutionMode: '20210326',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      REGION: '${self:provider.region}',
      BUCKET: '${env:BUCKET}',
      UPLOADED_FOLDER: '${env:UPLOADED_FOLDER}',
      PARSED_FOLDER: '${env:PARSED_FOLDER}',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: ['arn:aws:s3:::${self:provider.environment.BUCKET}'],
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: ['arn:aws:s3:::${self:provider.environment.BUCKET}/*'],
      },
    ],
  },
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
