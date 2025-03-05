import { PhantomProvider } from '../types/phantom';
import { connectWallet, disconnectWallet, getProvider } from '../utils/wallet';

class PopupManager {
    private provider: PhantomProvider | null = null;
    private connected: boolean = false;

    constructor() {
        this.initializeEventListeners();
        this.checkConnection();
        console.log('PopupManager initialized');
    }

    private initializeEventListeners(): void {
        document.getElementById('connectButton')?.addEventListener('click', () => {
            console.log('Connect button clicked');
            this.handleConnect();
        });
        document.getElementById('disconnectButton')?.addEventListener('click', () => {
            console.log('Disconnect button clicked');
            this.handleDisconnect();
        });
    }

    private async checkConnection(): Promise<void> {
        try {
            console.log('Checking wallet connection...');
            const provider = await getProvider();
            if (provider) {
                console.log('Provider found, checking connection...');
                this.provider = provider;
                if (provider.isConnected) {
                    console.log('Wallet is already connected');
                    this.updateConnectionStatus(true);
                    if (provider.publicKey) {
                        this.updateWalletInfo(provider.publicKey.toString());
                    }
                }
            } else {
                console.log('No provider found during initial check');
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
            this.showError('Failed to check wallet connection');
        }
    }

    private async handleConnect(): Promise<void> {
        try {
            const publicKey = await connectWallet();
            if (publicKey) {
                this.updateConnectionStatus(true);
                this.updateWalletInfo(publicKey);
            }
        } catch (error) {
            console.error('Error in handleConnect:', error);
            this.showError('Failed to connect wallet');
        }
    }

    private async handleDisconnect(): Promise<void> {
        try {
            await disconnectWallet();
            this.updateConnectionStatus(false);
        } catch (error) {
            console.error('Error in handleDisconnect:', error);
            this.showError('Failed to disconnect wallet');
        }
    }

    private updateConnectionStatus(connected: boolean): void {
        this.connected = connected;
        const statusIcon = document.getElementById('statusIcon');
        const statusText = document.getElementById('statusText');
        const connectButton = document.getElementById('connectButton');
        const disconnectButton = document.getElementById('disconnectButton');
        const walletInfo = document.getElementById('walletInfo');

        if (statusIcon) {
            statusIcon.className = `status-icon ${connected ? 'connected' : ''}`;
        }
        if (statusText) {
            statusText.textContent = connected ? 'Connected' : 'Not Connected';
        }
        if (connectButton) {
            connectButton.style.display = connected ? 'none' : 'block';
        }
        if (disconnectButton) {
            disconnectButton.style.display = connected ? 'block' : 'none';
        }
        if (walletInfo) {
            walletInfo.style.display = connected ? 'block' : 'none';
        }
    }

    private updateWalletInfo(publicKey: string): void {
        const walletAddress = document.getElementById('walletAddress');
        if (walletAddress) {
            walletAddress.textContent = `Address: ${this.shortenAddress(publicKey)}`;
        }
    }

    private shortenAddress(address: string): string {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }

    private showError(message: string): void {
        console.error('Showing error:', message);
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 3000);
        }
    }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing PopupManager');
    new PopupManager();
});