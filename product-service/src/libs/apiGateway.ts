import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export interface FormatJSONResponse {
  headers: Headers;
  statusCode: ResponseCodes;
  body: string;
}

type ResponseCodes = 200 | 404 | 500;

type Headers = {
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Credentials': boolean;
};

export const formatJSONResponse = (
  statusCode: ResponseCodes,
  response: Record<string, unknown>
): FormatJSONResponse => ({
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  statusCode,
  body: JSON.stringify(response),
});
