import { createReactQueryHooks } from '@trpc/react';
import { AppRouter } from './../../server/index';

export const trpc = createReactQueryHooks<AppRouter>();
