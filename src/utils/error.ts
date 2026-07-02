const collectMessages = (value: unknown): string[] => {
  if (!value) {
    return [];
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectMessages(item));
  }

  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    const priorityKeys = [
      'message',
      'error',
      'details',
      'detail',
      'description',
      'title',
      'reason',
    ];

    const messages = priorityKeys.flatMap((key) =>
      collectMessages(objectValue[key]),
    );

    if (messages.length > 0) {
      return messages;
    }

    return Object.values(objectValue).flatMap((item) => collectMessages(item));
  }

  return [];
};

const extractErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong.',
) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  const messages = collectMessages(error);

  return messages[0] || fallback;
};

export { extractErrorMessage };
