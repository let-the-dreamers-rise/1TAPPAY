/**
 * Transaction Error Handling Utility
 * 
 * Provides user-friendly error messages for common transaction errors.
 */

export interface TransactionError {
  code: string;
  message: string;
  userMessage: string;
}

/**
 * Parse transaction error and return user-friendly message
 * 
 * @param error - Error object from transaction
 * @returns User-friendly error message
 */
export function parseTransactionError(error: any): string {
  // User rejected transaction
  if (error.code === 4001 || error.message?.includes('User rejected')) {
    return 'Transaction cancelled. You rejected the transaction in your wallet.';
  }

  // Insufficient funds
  if (
    error.code === -32000 ||
    error.message?.includes('insufficient funds') ||
    error.message?.includes('insufficient balance')
  ) {
    return 'Insufficient balance. You don\'t have enough funds to complete this transaction.';
  }

  // Gas estimation failed
  if (
    error.message?.includes('gas required exceeds') ||
    error.message?.includes('out of gas')
  ) {
    return 'Transaction would fail. Please check the amount and try again.';
  }

  // Network error
  if (
    error.message?.includes('network') ||
    error.message?.includes('connection') ||
    error.code === 'NETWORK_ERROR'
  ) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Transaction timeout
  if (
    error.message?.includes('timeout') ||
    error.code === 'TIMEOUT'
  ) {
    return 'Transaction timeout. The transaction is taking longer than expected. Please check your wallet.';
  }

  // Nonce too low (transaction already processed)
  if (error.message?.includes('nonce too low')) {
    return 'Transaction already processed. Please refresh the page.';
  }

  // Replacement transaction underpriced
  if (error.message?.includes('replacement transaction underpriced')) {
    return 'Transaction replacement failed. Please wait for the current transaction to complete.';
  }

  // Wrong network
  if (
    error.message?.includes('chain') ||
    error.message?.includes('network')
  ) {
    return 'Wrong network. Please switch to Etherlink Testnet in your wallet.';
  }

  // Generic error
  return error.message || 'Transaction failed. Please try again.';
}

/**
 * Check if error is a user rejection
 * 
 * @param error - Error object
 * @returns true if user rejected, false otherwise
 */
export function isUserRejection(error: any): boolean {
  return error.code === 4001 || error.message?.includes('User rejected');
}

/**
 * Check if error is insufficient funds
 * 
 * @param error - Error object
 * @returns true if insufficient funds, false otherwise
 */
export function isInsufficientFunds(error: any): boolean {
  return (
    error.code === -32000 ||
    error.message?.includes('insufficient funds') ||
    error.message?.includes('insufficient balance')
  );
}

/**
 * Check if error is a network error
 * 
 * @param error - Error object
 * @returns true if network error, false otherwise
 */
export function isNetworkError(error: any): boolean {
  return (
    error.message?.includes('network') ||
    error.message?.includes('connection') ||
    error.code === 'NETWORK_ERROR'
  );
}

/**
 * Get error severity level
 * 
 * @param error - Error object
 * @returns Severity level: 'info', 'warning', or 'error'
 */
export function getErrorSeverity(error: any): 'info' | 'warning' | 'error' {
  if (isUserRejection(error)) {
    return 'info';
  }

  if (isInsufficientFunds(error)) {
    return 'warning';
  }

  return 'error';
}

/**
 * Get suggested action for error
 * 
 * @param error - Error object
 * @returns Suggested action message
 */
export function getSuggestedAction(error: any): string {
  if (isUserRejection(error)) {
    return 'Click the pay button again to retry the transaction.';
  }

  if (isInsufficientFunds(error)) {
    return 'Add funds to your wallet or try a smaller amount.';
  }

  if (isNetworkError(error)) {
    return 'Check your internet connection and try again.';
  }

  return 'Please try again or contact support if the issue persists.';
}
