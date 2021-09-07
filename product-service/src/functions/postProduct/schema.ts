export default {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    price: { type: 'integer', minimum: 0 },
    count: { type: 'integer', minimum: 0 },
  },
  required: ['title', 'description', 'count', 'price'],
  additionalProperties: false,
} as const;
