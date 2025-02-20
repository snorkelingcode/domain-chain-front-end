import { useState, useCallback, useEffect } from 'react';
import { ethers, BrowserProvider, Contract, JsonRpcSigner } from 'ethers';
import axios from 'axios';
import contractAddresses from '../config/contract-addresses';
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

  const initializeContract = useCallback(async (signerInstance: JsonRpcSigner) => {
    try {
      if (!contractAddresses.escrow) {
        throw new Error('Escrow contract address not found');
      }

      // Initialize contract
      const escrowContract = new ethers.Contract(
        contractAddresses.escrow,
        DomainEscrowABI,
        signerInstance
      );

      setContract(escrowContract);
      return escrowContract;
    } catch (error) {
      console.error('Contract initialization failed:', error);
      throw error;
    }
  }, []);

  const handleAccountsChanged = useCallback(async (accounts: string[]) => {
    if (accounts.length > 0) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      setAccount(accounts[0]);
      setProvider(provider);
      setSigner(signer);
      await initializeContract(signer);
    } else {
      setAccount(null);
      setSigner(null);
      setContract(null);
      setProvider(null);
    }
  }, [initializeContract]);

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

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
      console.log('Connected to chain:', network.chainId.toString());

      // Initialize contract
      await initializeContract(signer);

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);

      return { signer, account: accounts[0] };
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setError(error.message || 'Failed to connect wallet');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [initializeContract]);

  const initiateInstantTransfer = useCallback(async (params: TransferParams) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized or wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Get instant transfer proof from backend
      const { data: verificationData } = await axios.post(
        `${BACKEND_URL}/api/escrow/verify`,
        {
          domainName: params.domainName,
          seller: params.seller,
          buyer: params.buyer
        }
      );

      // Prepare transfer parameters
      const transaction = {
        tokenId: verificationData.tokenId,
        seller: params.seller,
        buyer: params.buyer,
        price: ethers.parseEther(params.price),
        timestamp: Math.floor(Date.now() / 1000)
      };

      // Get seller signature
      const message = ethers.solidityPacked(
        ['uint256', 'address', 'address', 'uint256', 'uint256'],
        [transaction.tokenId, transaction.seller, transaction.buyer, transaction.price, transaction.timestamp]
      );
      const messageHash = ethers.keccak256(message);
      const signature = await signer.signMessage(ethers.getBytes(messageHash));

      // Execute instant transfer
      const tx = await contract.instantDomainTransfer(
        transaction,
        signature,
        "0x", // Buyer signature will be added by buyer
        { value: ethers.parseEther(params.price) }
      );

      const receipt = await tx.wait();
      
      // Notify backend of transfer initiation
      await axios.post(`${BACKEND_URL}/api/escrow/initiated`, {
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

  // Check for existing connection on mount
  useEffect(() => {
    if (window.ethereum) {
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch((err: Error) => console.error("Failed to get accounts", err));

      // Setup event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

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