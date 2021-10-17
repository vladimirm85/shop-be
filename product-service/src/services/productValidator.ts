import { ProductData } from 'src/models';

export class ProductValidator {
  constructor(private obj: unknown) {}

  validate = () => {
    console.log('isObject');
    if (!this.isObject(this.obj)) return false;

    console.log('isCorrectNumberOfProps');
    if (!this.isCorrectNumberOfProps(this.obj as object)) return false;

    console.log('isProduct');
    if (!this.isProduct(this.obj as object)) return false;

    console.log('isValidProduct');
    if (!this.isValidProduct(this.obj as ProductData)) return false;

    return true;
  };

  private validKeysArray = ['count', 'description', 'price', 'title'];

  private isObject = (obj: unknown): obj is object =>
    typeof obj === 'object' && !Array.isArray(obj) && obj !== null;

  private isCorrectNumberOfProps = (obj: object) =>
    Object.keys(obj).length === this.validKeysArray.length;

  private isProduct = (obj: object) => {
    const keysArray = Object.keys(obj).sort();

    return JSON.stringify(this.validKeysArray) === JSON.stringify(keysArray);
  };

  private isValidProduct = ({
    count,
    description,
    price,
    title,
  }: ProductData) => {
    if (!this.isValidCount(+count)) return false;

    if (!this.isValidNumber(+price)) return false;

    if (!this.isValidString(description)) return false;

    return this.isValidString(title);
  };

  private isValidCount = (count: any) =>
    this.isValidNumber(count) && Number.isInteger(count) && count > 0;

  private isValidNumber = (price: any) =>
    price && this.isNumber(price) && price > 0;

  private isValidString = (value: any) => value && this.isString(value);

  private isString = (value: any): value is string => typeof value === 'string';

  private isNumber = (value: any): value is number => typeof value === 'number';
}
