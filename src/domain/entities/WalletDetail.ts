/**
 * WalletDetail Interface.
 */
interface WalletDetail {
  id?: number;
  useId: number;
  balance: number;
  currencyName: string;
  currencyCode: string;
  createdAt: string;
  updatedAt: string;
}

export default WalletDetail;
