/**
 *  WalletTransferPayload Interface.
 */

interface WalletTransferPayload {
  recipientWalletId: number;
  walletId: number;
  amount: number;
}

export default WalletTransferPayload;
