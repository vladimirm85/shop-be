import type { AWS } from '@serverless/typescript';
import {
  getProductsById,
  getProductsList,
  postProduct,
  catalogBatchProcess,
} from 'src/functions';

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
      EMAIL_PRIMARY: '${env:EMAIL_PRIMARY}',
      EMAIL_SECONDARY: '${env:EMAIL_SECONDARY}',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: {
          Ref: 'CreateProductTopic',
        },
      },
    ],
  },
  functions: {
    getProductsList,
    getProductsById,
    postProduct,
    catalogBatchProcess,
  },
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
      NewProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:EMAIL_PRIMARY}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'CreateProductTopic',
          },
          FilterPolicy: {
            price: [
              {
                numeric: ['<=', 100],
              },
            ],
          },
        },
      },
      NewExpensiveProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:EMAIL_SECONDARY}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'CreateProductTopic',
          },
          FilterPolicy: {
            price: [
              {
                numeric: ['>', 100],
              },
            ],
          },
        },
      },
    },
    Outputs: {
      CatalogItemsQueueURL: {
        Value: {
          Ref: 'CatalogItemsQueue',
        },
        Export: {
          Name: 'CatalogItemsQueueURL',
        },
      },
      CatalogItemsQueueArn: {
        Value: {
          'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'],
        },
        Export: {
          Name: 'CatalogItemsQueueArn',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
