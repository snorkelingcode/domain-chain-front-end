// src/hooks/useEscrowContract.ts
import { useState, useCallback } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import axios from 'axios';

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
  const [signer, setSigner] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('No wallet found');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = import.meta.env.VITE_ESCROW_CONTRACT_ADDRESS;

      const escrowContract = new Contract(
        contractAddress,
        [
          'function instantDomainTransfer(tuple(uint256 tokenId, address seller, address buyer, uint256 price, uint256 timestamp) transaction, bytes sellerSignature, bytes buyerSignature) external payable',
          'function completeInstantTransfer(bytes32 transferId, bytes memory verificationProof) external',
          'function createEscrow(string memory domainName, uint256 price, uint256 duration) external',
          'function confirmTransfer(bytes32 escrowId, bytes memory transferCode) external',
          'function releaseFunds(bytes32 escrowId) external'
        ],
        signer
      );

      setProvider(provider);
      setContract(escrowContract);
      setSigner(signer);
      setAccount(accounts[0]);

      return { signer, contract: escrowContract, account: accounts[0] };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }, []);

  const initiateInstantTransfer = useCallback(async (params: TransferParams) => {
    if (!contract || !signer) throw new Error('Contract not initialized');
    setLoading(true);

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
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract, signer]);

  const createEscrow = useCallback(async (params: CreateEscrowParams) => {
    if (!contract) throw new Error('Contract not initialized');
    setLoading(true);

    try {
      const tx = await contract.createEscrow(
        params.domainName,
        ethers.parseEther(params.price),
        params.duration
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Escrow creation failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const confirmTransfer = useCallback(async (params: TransferConfirmationParams) => {
    if (!contract) throw new Error('Contract not initialized');
    setLoading(true);

    try {
      const tx = await contract.confirmTransfer(
        params.escrowId,
        params.transferCode
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Transfer confirmation failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const releaseFunds = useCallback(async (escrowId: string) => {
    if (!contract) throw new Error('Contract not initialized');
    setLoading(true);

    try {
      const tx = await contract.releaseFunds(escrowId);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Fund release failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  return {
    connectWallet,
    initiateInstantTransfer,
    createEscrow,
    confirmTransfer,
    releaseFunds,
    loading,
    contract,
    provider,
    signer,
    account
  };
};

export default useEscrowContract;