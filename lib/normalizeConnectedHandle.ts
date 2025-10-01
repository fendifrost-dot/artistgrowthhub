export const normalizeConnectedHandle = (input: string): string => {
  if (!input) {
    return '';
  }

  const trimmed = input.trim();

  if (trimmed.startsWith('EAA')) {
    return 'Access Token Connected';
  }

  if (!trimmed.includes('://')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const segments = parsed.pathname.split('/').filter(Boolean);

    if (segments.length > 0) {
      return segments[segments.length - 1];
    }

    return parsed.hostname.replace(/^www\./, '');
  } catch (error) {
    console.warn('Unable to parse connection handle URL, falling back to raw input.', error);
    return trimmed;
  }
};
