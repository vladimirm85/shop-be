import type { AWS } from '@serverless/typescript';
import { getProductsById, getProductsList, postProduct } from 'src/functions';

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
      PG_HOST: '${env:PG_HOST}',
      PG_PORT: '${env:PG_PORT}',
      PG_DB_NAME: '${env:PG_DB_NAME}',
      PG_USER: '${env:PG_USER}',
      PG_PASSWORD: '${env:PG_PASSWORD}',
      CREATE_PRODUCT_TOPIC: {
        Ref: 'CreateProductTopic',
      },
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { getProductsList, getProductsById, postProduct },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'CatalogItemsQueue',
        },
      },
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'CreateProductTopic',
        },
      },
    },
    Outputs: {
      CatalogItemsQueueURL: {
        Value: {
          Ref: 'CatalogItemsQueue',
        },
        Export: {
          Name: 'CatalogItemsQueue',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
