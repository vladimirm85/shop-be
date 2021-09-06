import type { AWS } from '@serverless/typescript';
import { getProductsById, getProductsList, postProduct } from 'src/functions';

const { PG_HOST, PG_PORT, PG_DB_NAME, PG_USER, PG_PASSWORD } = process.env;

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
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
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST,
      PG_PORT,
      PG_DB_NAME,
      PG_USER,
      PG_PASSWORD,
    },
    lambdaHashingVersion: '20201221',
    httpApi: {
      cors: true,
    },
  },
  useDotenv: true,
  // import the function via paths
  functions: { getProductsList, getProductsById, postProduct },
};

module.exports = serverlessConfiguration;
