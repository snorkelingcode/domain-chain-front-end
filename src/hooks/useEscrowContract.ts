import { useState, useCallback, useEffect } from 'react';
import { ethers, BrowserProvider, Contract, JsonRpcSigner } from 'ethers';
import axios from 'axios';
import contractAddresses from '../config/contract-addresses';

// Import ABI
import DomainEscrowABI from '../abi/DomainEscrow.json';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface TransferParams {
  domainName: string;
  price: string;
  buyer: string;
  seller: string;
}

interface CreateEscrowParams {
  domainName: string;
  price: string;
  duration: number;
}

interface TransferConfirmationParams {
  escrowId: string;
  transferCode: string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useEscrowContract = () => {
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<Contract | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
    }
  }, []);

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      // Add event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch((err: Error) => console.error("Failed to get accounts", err));

      // Cleanup
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask.');
    }

    setLoading(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Get the connected chain ID
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      console.log('Connected to chain:', chainId);

      // Initialize contract
      const escrowContract = new ethers.Contract(
        contractAddresses.escrow,
        DomainEscrowABI,
        signer
      );

      setProvider(provider);
      setContract(escrowContract);
      setSigner(signer);
      setAccount(accounts[0]);

      return { signer, contract: escrowContract, account: accounts[0] };
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setError(error.message || 'Failed to connect wallet');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const initiateInstantTransfer = useCallback(async (params: TransferParams) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized or wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Get instant transfer proof from backend
      const { data: verificationData } = await axios.post(
        `${BACKEND_URL}/verify-domain`,
        {
          domainName: params.domainName,
          seller: params.seller,
          buyer: params.buyer
        }
      );

      // 2. Prepare transfer parameters
      const transaction = {
        tokenId: verificationData.tokenId,
        seller: params.seller,
        buyer: params.buyer,
        price: ethers.parseEther(params.price),
        timestamp: Math.floor(Date.now() / 1000)
      };

      // 3. Get seller signature
      const message = ethers.solidityPacked(
        ['uint256', 'address', 'address', 'uint256', 'uint256'],
        [transaction.tokenId, transaction.seller, transaction.buyer, transaction.price, transaction.timestamp]
      );
      const messageHash = ethers.keccak256(message);
      const signature = await signer.signMessage(ethers.getBytes(messageHash));

      // 4. Execute instant transfer
      const tx = await contract.instantDomainTransfer(
        transaction,
        signature,
        "0x", // Buyer signature will be added by buyer
        { value: ethers.parseEther(params.price) }
      );

      const receipt = await tx.wait();
      
      // 5. Notify backend of transfer initiation
      await axios.post(`${BACKEND_URL}/transfer-initiated`, {
        transactionHash: receipt.hash,
        domainName: params.domainName,
        seller: params.seller,
        buyer: params.buyer
      });

      return receipt;
    } catch (error: any) {
      console.error('Transfer failed:', error);
      setError(error.message || 'Transfer failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, signer]);

  const createEscrow = useCallback(async (params: CreateEscrowParams) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized or wallet not connected');
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log('Creating escrow with params:', params);
      
      const tx = await contract.createEscrow(
        params.domainName,
        ethers.parseEther(params.price),
        params.duration,
        { from: await signer.getAddress() }
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      return receipt;
    } catch (error: any) {
      console.error('Escrow creation failed:', error);
      setError(error.message || 'Failed to create escrow');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, signer]);

  const confirmTransfer = useCallback(async (params: TransferConfirmationParams) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized or wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.confirmTransfer(
        params.escrowId,
        params.transferCode
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (error: any) {
      console.error('Transfer confirmation failed:', error);
      setError(error.message || 'Failed to confirm transfer');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, signer]);

  const releaseFunds = useCallback(async (escrowId: string) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized or wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.releaseFunds(escrowId);
      const receipt = await tx.wait();
      return receipt;
    } catch (error: any) {
      console.error('Fund release failed:', error);
      setError(error.message || 'Failed to release funds');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, signer]);

  return {
    connectWallet,
    initiateInstantTransfer,
    createEscrow,
    confirmTransfer,
    releaseFunds,
    loading,
    error,
    contract,
    provider,
    signer,
    account,
    isConnected: !!account
  };
};

export default useEscrowContract;