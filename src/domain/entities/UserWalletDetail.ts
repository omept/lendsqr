import CurrencyDetail from './CurrencyDetail';
import UserDetail from './UserDetail';
import WalletDetail from './WalletDetail';

/**
 * UserDetail Interface.
 */
interface UserWalletDetail {
  user?: UserDetail;
  wallet?: WalletDetail;
  currency?: CurrencyDetail;
}

export default UserWalletDetail;
