export const createUserFriendlyError = (error: unknown): string => {
  if (error instanceof Error) {
    // Handle specific error cases
    if (error.message.includes('403')) {
      return 'YouTube API access denied. Please check your API key configuration.';
    }
    if (error.message.includes('429')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    if (error.message.includes('quotaExceeded')) {
      return 'YouTube API quota exceeded. Please try again later.';
    }
    if (error.message.includes('keyInvalid')) {
      return 'Invalid YouTube API key. Please check your configuration.';
    }
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your internet connection and try again.';
    }

    // Return the error message for other cases
    return error.message;
  }

  // Handle unknown error types
  return 'An unexpected error occurred. Please try again.';
};
