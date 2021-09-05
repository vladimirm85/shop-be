import { Client, ClientConfig } from 'pg';
import { DbApiInterface } from 'src/dbApi/apiInterface';
import { Product } from 'src/db';
import { bdConfig } from 'src/dbApi/bdConfig';

class DbApi implements DbApiInterface {
  constructor(bdConfig: ClientConfig) {
    this.bdConfig = bdConfig;
  }

  bdConfig: ClientConfig;

  async getClient() {
    const client = new Client(this.bdConfig);
    await client.connect();
    return client;
  }

  async getOne(id: string) {
    const client = await this.getClient();
    try {
      const data = await client.query<Product>(
        'select ' +
          'id, title, description, price, count ' +
          'from product ' +
          'left join stock ' +
          'on product_id = id ' +
          'where id = $1',
        [id]
      );

      await client.end();

      return data.rows[0];
    } catch (e) {
      await client.end();

      throw new Error(e);
    }
  }

  async get() {
    const client = await this.getClient();
    try {
      const { rows } = await client.query<Product>(
        'select ' +
          'id, title, description, price, count ' +
          'from product ' +
          'left join stock ' +
          'on product_id = id'
      );

      await client.end();

      return rows;
    } catch (e) {
      await client.end();

      throw new Error(e);
    }
  }
}

export default new DbApi(bdConfig);
