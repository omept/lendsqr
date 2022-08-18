/**
 * WalletDetail Interface.
 */
interface WalletDetail {
  id?: number;
  userId: number;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
}

export default WalletDetail;
