import { APIGatewayAuthorizerResult } from 'aws-lambda';

export const generatePolicy = (
  principalId,
  Resource,
  Effect
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect,
          Resource,
        },
      ],
    },
  };
};
