interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  defaultWalletBal?: number;
}

export default TokenResponse;
