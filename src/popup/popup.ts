import { PhantomProvider, Transaction } from '../types/phantom';
import { connectWallet, disconnectWallet, getProvider, getBalance, getTransactionHistory } from '../utils/wallet';

class PopupManager {
    private provider: PhantomProvider | null = null;
    private connected: boolean = false;
    private transactions: Transaction[] = [];
    private currentSortBy: string = 'date';
    private currentFilter: string = 'all';

    constructor() {
        this.initializeEventListeners();
        this.checkConnection();
        console.log('PopupManager initialized with default sort:', this.currentSortBy, 'and filter:', this.currentFilter);
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
        document.getElementById('sortBy')?.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            console.log('Sort option changed from', this.currentSortBy, 'to:', target.value);
            this.currentSortBy = target.value;
            this.renderTransactions();
        });
        document.getElementById('filterType')?.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            console.log('Filter option changed from', this.currentFilter, 'to:', target.value);
            this.currentFilter = target.value;
            this.renderTransactions();
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
                        await this.updateWalletInfo(provider.publicKey.toString());
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
                await this.updateWalletInfo(publicKey);
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

    private async updateWalletInfo(publicKey: string): Promise<void> {
        try {
            const walletAddress = document.getElementById('walletAddress');
            const balanceElement = document.getElementById('walletBalance');

            if (walletAddress) {
                walletAddress.textContent = `Address: ${this.shortenAddress(publicKey)}`;
            }

            if (this.provider && balanceElement) {
                const balance = await getBalance(this.provider);
                balanceElement.textContent = `Balance: ${balance.toFixed(4)} SOL`;
                await this.updateTransactionHistory();
            }
        } catch (error) {
            console.error('Error updating wallet info:', error);
            this.showError('Failed to fetch wallet information');
        }
    }

    private async updateTransactionHistory(): Promise<void> {
        try {
            if (!this.provider) {
                console.log('No provider available for transaction history update');
                return;
            }

            console.log('Fetching transaction history...');
            this.transactions = await getTransactionHistory(this.provider);
            console.log('Fetched transactions:', this.transactions);
            this.renderTransactions();
        } catch (error) {
            console.error('Error updating transaction history:', error);
            this.showError('Failed to fetch transaction history');
        }
    }

    private filterTransactions(transactions: Transaction[]): Transaction[] {
        console.log('Starting filtering with type:', this.currentFilter);
        console.log('Initial transaction count:', transactions.length);

        if (this.currentFilter === 'all') {
            console.log('Returning all transactions');
            return transactions;
        }

        const filtered = transactions.filter(tx => {
            switch (this.currentFilter) {
                case 'transfer':
                    return tx.type === 'transfer';
                case 'swap':
                    return tx.type === 'swap';
                case 'other':
                    return !['transfer', 'swap'].includes(tx.type);
                default:
                    return true;
            }
        });

        console.log('Filtered transaction count:', filtered.length);
        console.log('Filtered transactions:', filtered);
        return filtered;
    }

    private sortTransactions(transactions: Transaction[]): Transaction[] {
        console.log('Starting sorting by:', this.currentSortBy);
        console.log('Pre-sort first transaction:', transactions[0]);

        const sorted = [...transactions].sort((a, b) => {
            if (this.currentSortBy === 'date') {
                return (b.blockTime || 0) - (a.blockTime || 0);
            } else if (this.currentSortBy === 'amount') {
                return (b.amount || 0) - (a.amount || 0);
            }
            return 0;
        });

        console.log('Post-sort first transaction:', sorted[0]);
        console.log('Sorted transactions:', sorted);
        return sorted;
    }

    private renderTransactions(): void {
        const transactionsList = document.getElementById('transactionsList');
        if (!transactionsList) return;

        const filteredTransactions = this.filterTransactions(this.transactions);
        console.log('Filtered transactions:', filteredTransactions);
        const sortedTransactions = this.sortTransactions(filteredTransactions);
        console.log('Sorted transactions:', sortedTransactions);

        transactionsList.innerHTML = '';
        sortedTransactions.forEach(tx => {
            const txElement = document.createElement('div');
            txElement.className = 'transaction-item';

            const time = tx.blockTime 
                ? new Date(tx.blockTime * 1000).toLocaleString()
                : 'Pending';

            txElement.innerHTML = `
                <div class="transaction-signature">${this.shortenAddress(tx.signature)}</div>
                <div class="transaction-amount">${tx.amount ? `${tx.amount} SOL` : ''}</div>
                <div class="transaction-time">${time}</div>
                <div class="transaction-type">${tx.type || 'Unknown'}</div>
            `;

            transactionsList.appendChild(txElement);
        });
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