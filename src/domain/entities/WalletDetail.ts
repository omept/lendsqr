/**
 * WalletDetail Interface.
 */
interface WalletDetail {
  id?: number;
  useId: number;
  balance: string;
  currencyName: string;
  currencyCode: string;
  createdAt: string;
  updatedAt: string;
}

export default WalletDetail;
