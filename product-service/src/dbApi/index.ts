import { Client, ClientConfig } from 'pg';
import { DbApiInterface } from 'src/dbApi/apiInterface';
import { Product, ProductData } from 'src/models';
import { bdConfig } from 'src/dbApi/bdConfig';

class DbApi implements DbApiInterface {
  constructor(private readonly bdConfig: ClientConfig) {
    this.bdConfig = bdConfig;
  }

  private async getClient() {
    const client = new Client(this.bdConfig);
    await client.connect();
    return client;
  }

  async getOne(id: string) {
    const client = await this.getClient();
    try {
      const data = await client.query<Product>(
        'SELECT ' +
          'id, title, description, price, count ' +
          'FROM product ' +
          'LEFT JOIN stock ' +
          'ON product_id = id ' +
          'WHERE id = $1',
        [id]
      );

      return data.rows[0];
    } catch (e) {
      throw new Error(e);
    } finally {
      await client.end();
    }
  }

  async get() {
    const client = await this.getClient();
    try {
      const { rows } = await client.query<Product>(
        'SELECT ' +
          'id, title, description, price, count ' +
          'FROM product ' +
          'LEFT JOIN stock ' +
          'ON product_id = id'
      );

      return rows;
    } catch (e) {
      throw new Error(e);
    } finally {
      await client.end();
    }
  }

  async postOne({ title, description, price, count }: ProductData) {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');

      const { rows: pIdArr } = await client.query<{ product_id: string }>(
        'WITH product as (' +
          'INSERT INTO product (title, description, price) VALUES ' +
          '($1, $2, $3) ' +
          'RETURNING id' +
          ') ' +
          'INSERT INTO stock (product_id, count) VALUES ' +
          '((SELECT product.id FROM product), $4) ' +
          'RETURNING product_id',
        [title, description, price, count]
      );

      const { rows: products } = await client.query<Product>(
        'SELECT id, title, description, price, count ' +
          'FROM product ' +
          'LEFT JOIN stock ' +
          'ON id = product_id ' +
          'WHERE id = $1',
        [pIdArr[0].product_id]
      );

      await client.query('COMMIT');

      return products[0];
    } catch (e) {
      console.log('ROLLBACK');
      await client.query('ROLLBACK');

      throw new Error(e);
    } finally {
      await client.end();
    }
  }
}

export default new DbApi(bdConfig);
