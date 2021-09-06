import { Client, ClientConfig } from 'pg';
import { DbApiInterface, ProductData } from 'src/dbApi/apiInterface';
import { Product } from 'src/db';
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

      const { rows } = await client.query<Product>(
        'WITH product as (' +
          'INSERT INTO product (title, description, price) VALUES ' +
          '($1, $2, $3) ' +
          'RETURNING id' +
          ') ' +
          'INSERT INTO stock (product_id, count) VALUES ' +
          '((SELECT product.id FROM product), $4)',
        [title, description, price, count]
      );

      await client.query('COMMIT');

      return rows[0];
    } catch (e) {
      await client.query('ROLLBACK');

      throw new Error(e);
    } finally {
      await client.end();
    }
  }
}

export default new DbApi(bdConfig);
