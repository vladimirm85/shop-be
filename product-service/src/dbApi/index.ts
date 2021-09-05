import { Client, ClientConfig } from 'pg';
import { DbApiInterface } from 'src/dbApi/apiInterface';
import { Product } from 'src/db';
import { bdConfig } from 'src/dbApi/bdConfig';

class DbApi implements DbApiInterface {
  constructor(bdConfig: ClientConfig) {
    this.client = new Client(bdConfig);
  }

  client: Client;

  async getOne(id: string) {
    try {
      await this.client.connect();

      const data = await this.client.query<Product>(
        'select ' +
          'id, title, description, price, count ' +
          'from product ' +
          'left join stock ' +
          'on product_id = id ' +
          'where id = $1',
        [id]
      );

      await this.client.end();

      return data.rows[0];
    } catch (e) {
      await this.client.end();

      throw new Error(e);
    }
  }

  async get() {
    try {
      await this.client.connect();

      const { rows } = await this.client.query<Product>(
        'select ' +
          'id, title, description, price, count ' +
          'from product ' +
          'left join stock ' +
          'on product_id = id'
      );

      await this.client.end();

      return rows;
    } catch (e) {
      await this.client.end();

      throw new Error(e);
    }
  }
}

export default new DbApi(bdConfig);
