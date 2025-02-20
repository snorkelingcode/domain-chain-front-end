import { useState, useCallback } from 'react';
import { 
  ethers, 
  BrowserProvider, 
  Contract, 
  parseEther,
  ContractTransactionResponse
} from 'ethers';

// Explicitly define the window.ethereum type
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useEscrowContract = () => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<any | null>(null);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider and signer
        const web3Provider = new BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        
        // Set state
        setProvider(web3Provider);
        setSigner(web3Signer);

        // Initialize contract (replace with your actual contract address and ABI)
        const contractAddress = '0xac5440197b758b85adadb27deb93b33429823433b59ab1a1a0771626fa2ee4';
        const contractABI = [
          // Add your contract ABI here
          "function createEscrow(string memory domain, uint256 price, uint256 duration)",
          "function confirmDomainTransfer(uint256 escrowId)",
          "function releaseFunds(uint256 escrowId)"
        ];

        const escrowContract = new Contract(
          contractAddress, 
          contractABI, 
          web3Signer
        );

        setContract(escrowContract);

        return {
          provider: web3Provider,
          signer: web3Signer,
          contract: escrowContract
        };
      } catch (error) {
        console.error('Wallet connection failed:', error);
        throw error;
      }
    } else {
      throw new Error('Ethereum wallet not found');
    }
  }, []);

  const createEscrow = useCallback(async (
    domain: string, 
    price: string, 
    duration: number
  ) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    try {
      // Convert price to wei (assuming price is in ETH)
      const priceInWei = parseEther(price);
      
      // Call contract method
      const tx: ContractTransactionResponse = await contract.createEscrow(domain, priceInWei, duration);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return receipt;
    } catch (error) {
      console.error('Escrow creation failed:', error);
      throw error;
    }
  }, [contract]);

  const confirmDomainTransfer = useCallback(async (escrowId: string) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx: ContractTransactionResponse = await contract.confirmDomainTransfer(escrowId);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Domain transfer confirmation failed:', error);
      throw error;
    }
  }, [contract]);

  const releaseFunds = useCallback(async (escrowId: string) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx: ContractTransactionResponse = await contract.releaseFunds(escrowId);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Fund release failed:', error);
      throw error;
    }
  }, [contract]);

  return {
    connectWallet,
    createEscrow,
    confirmDomainTransfer,
    releaseFunds,
    contract,
    provider,
    signer
  };
};