import * as userFactory from './userFactory';
import UserWalletDetail from '../../domain/entities/UserWalletDetail';

interface Callback<T> {
  run: () => Promise<T>;
}

export enum FactoryType {
  USER = 'User'
}

export interface Factories {
  [FactoryType.USER]: Callback<UserWalletDetail>;
}

const factories: Factories = { [FactoryType.USER]: userFactory };

export default factories;
