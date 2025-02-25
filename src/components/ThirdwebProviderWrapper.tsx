import React, { ReactNode } from 'react';
import { 
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  rainbowWallet,
  trustWallet,
  zerionWallet,
  phantomWallet,
  // Explicitly import the types
} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

interface ThirdwebProviderWrapperProps {
  children: ReactNode;
}

// Define a custom theme to match your application's styling
const customTheme = {
  colors: {
    accentText: "#2563eb", // Blue-600 for primary accents
    accentButtonBg: "#2563eb", // Blue-600 for buttons
    primaryButtonBg: "#2563eb", // Blue-600 for primary buttons
    primaryButtonText: "#ffffff",
    secondaryButtonBg: "#f9fafb", // Gray-50
    secondaryButtonText: "#374151", // Gray-700
    primaryText: "#111827", // Gray-900
    secondaryText: "#4b5563", // Gray-600
    connectedButtonBg: "#2563eb", // Blue-600 for connected state
    connectedButtonText: "#ffffff"
  },
  radii: {
    // Rounded corners to match your UI
    default: "0.5rem", // 8px rounded corners
    button: "0.5rem",
    modal: "0.75rem", // 12px for modal corners
  }
};

const ThirdwebProviderWrapper: React.FC<ThirdwebProviderWrapperProps> = ({ children }) => {
  const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID || "";
  
  return (
    <ThirdwebProvider 
      activeChain={Sepolia}
      clientId={clientId}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        rainbowWallet(),
        trustWallet(),
        zerionWallet(),
        phantomWallet()
      ]}
    >
      {children}
    </ThirdwebProvider>
  );
};

export default ThirdwebProviderWrapper;