export interface PhantomProvider {
    isPhantom?: boolean;
    publicKey?: { toString(): string } | null;
    isConnected?: boolean;
    signTransaction: (transaction: any) => Promise<any>;
    signAllTransactions: (transactions: any[]) => Promise<any[]>;
    signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
    connect: () => Promise<{ publicKey: { toString(): string } }>;
    disconnect: () => Promise<void>;
}

declare global {
    interface Window {
        solana?: PhantomProvider;
    }
}
