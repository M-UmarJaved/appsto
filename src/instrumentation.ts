export async function register() {
  if (process.env.NODE_ENV === 'production') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('../sentry.server.config');
    }
    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('../sentry.edge.config');
    }
  }
}

export const onRequestError = async (err: any, request: any, context: any) => {
  if (process.env.NODE_ENV === 'production') {
    const Sentry = await import('@sentry/nextjs');
    return Sentry.captureRequestError(err, request, context);
  }
};
