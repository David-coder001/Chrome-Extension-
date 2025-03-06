import { PhantomProvider } from '../types/phantom';

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request.type);

    if (request.type === 'GET_TRANSACTIONS') {
        console.log('Processing transaction history request');
    }

    // Keep the message channel open for async responses
    return true;
});