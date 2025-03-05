import { PhantomProvider } from '../types/phantom';

export const getProvider = async (): Promise<PhantomProvider | null> => {
    try {
        console.log('Checking for Phantom provider...');
        // Check if Phantom is already available in window
        if ('solana' in window && window.solana?.isPhantom) {
            console.log('Phantom provider found in window');
            return window.solana;
        }

        // If not found, prompt to install Phantom
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