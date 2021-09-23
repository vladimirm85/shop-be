import { S3 } from 'aws-sdk';

const { BUCKET, UPLOADED_FOLDER } = process.env;

const params = {
  Bucket: BUCKET,
  ContentType: 'text/csv',
};

export class ImportFileService {
  constructor(private s3: S3) {}

  async getSignedUrlPromise(fileName: string) {
    try {
      return await this.s3.getSignedUrlPromise('putObject', {
        ...params,
        Key: `${UPLOADED_FOLDER}/${fileName}`,
      });
    } catch (e) {
      console.log('SIGNE URL ERROR: ', e);
      throw e;
    }
  }
}
