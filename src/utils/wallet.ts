import { PhantomProvider, Transaction } from '../types/phantom';

export const getProvider = async (): Promise<PhantomProvider | null> => {
    try {
        console.log('Checking for Phantom provider...');
        if ('solana' in window && window.solana?.isPhantom) {
            console.log('Phantom provider found in window');
            return window.solana;
        }

        console.log('Phantom not found, opening install page');
        window.open('https://phantom.app/', '_blank');
        return null;
    } catch (error) {
        console.error('Error getting Phantom provider:', error);
        return null;
    }
};

export const connectWallet = async (): Promise<string | null> => {
    try {
        console.log('Attempting to connect wallet...');
        const provider = await getProvider();
        if (!provider) {
            console.error('Phantom wallet not found');
            throw new Error('Phantom wallet not found');
        }

        console.log('Connecting to Phantom wallet...');
        const response = await provider.connect();
        const publicKey = response.publicKey.toString();
        console.log('Connected successfully:', publicKey);
        return publicKey;
    } catch (error) {
        console.error('Error connecting wallet:', error);
        throw error;
    }
};

export const getBalance = async (provider: PhantomProvider): Promise<number> => {
    try {
        const response = await provider.request({
            method: 'getBalance',
            params: {
                commitment: 'processed'
            }
        });
        // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
        return response.value / 1000000000;
    } catch (error) {
        console.error('Error getting balance:', error);
        throw error;
    }
};

export const getTransactionHistory = async (provider: PhantomProvider): Promise<Transaction[]> => {
    try {
        const response = await provider.request({
            method: 'getTransactions',
            params: {
                limit: 10,
                commitment: 'confirmed'
            }
        });

        return response.map((tx: any) => ({
            signature: tx.signature,
            blockTime: tx.blockTime,
            confirmationStatus: tx.confirmationStatus,
            amount: tx.amount,
            type: tx.type
        }));
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        throw error;
    }
};

export const disconnectWallet = async (): Promise<void> => {
    try {
        console.log('Attempting to disconnect wallet...');
        const provider = await getProvider();
        if (!provider) {
            console.error('Phantom wallet not found');
            throw new Error('Phantom wallet not found');
        }

        console.log('Disconnecting from Phantom wallet...');
        await provider.disconnect();
        console.log('Disconnected successfully');
    } catch (error) {
        console.error('Error disconnecting wallet:', error);
        throw error;
    }
};