import React, { ReactNode } from 'react';
import { 
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  // Explicitly import the types
  WalletConfig,
  WalletInstance
} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

interface ThirdwebProviderWrapperProps {
  children: ReactNode;
}

const ThirdwebProviderWrapper: React.FC<ThirdwebProviderWrapperProps> = ({ children }) => {
  const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID || "";
  
  return (
    <ThirdwebProvider 
      activeChain={Sepolia}
      clientId={clientId}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect()
      ]}
    >
      {children}
    </ThirdwebProvider>
  );
};

export default ThirdwebProviderWrapper;