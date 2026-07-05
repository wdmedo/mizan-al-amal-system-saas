import { supabase } from '@/integrations/supabase/client';

let cachedOrganizationId: string | null = null;

export const resetOrganizationCache = () => {
  cachedOrganizationId = null;
};

export const getOrganizationId = async (): Promise<string> => {
  if (cachedOrganizationId) {
    return cachedOrganizationId;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error('No authenticated user available.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (error) {
    throw error;
  }

  if (!data?.organization_id) {
    throw new Error('Organization ID is missing from the current user profile.');
  }

  cachedOrganizationId = data.organization_id;
  return cachedOrganizationId;
};

export const queryOrg = async <T = unknown>(table: string) => {
  const organizationId = await getOrganizationId();
  return supabase.from<T>(table).eq('organization_id', organizationId);
};

export const createOrgQuery = queryOrg;

export const orgInsert = <T = unknown, R = unknown>(table: string, rows: T[]) => {
  // Return a thenable object so callers can either `await orgInsert(...)`
  // or chain `.select()` / `.single()` before awaiting.
  const makeInsert = async (selectArg?: string | null, single = false) => {
    const organizationId = await getOrganizationId();
    const rowsWithOrg = rows.map(row => ({ ...row, organization_id: organizationId }));
    const builder = supabase.from<R>(table).insert(rowsWithOrg);

    if (selectArg !== undefined) {
      return builder.select(selectArg);
    }

    if (single) {
      return builder.select().single();
    }

    // default: return inserted rows
    return builder.select();
  };

  const api: {
    select: (columns?: string) => Promise<unknown>;
    single: () => Promise<unknown>;
    then: (onFulfilled?: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) => Promise<unknown>;
  } = {
    select: (columns?: string) => makeInsert(columns ?? undefined),
    single: () => makeInsert(undefined, true),
    then: (onFulfilled?: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) => {
      return makeInsert().then(onFulfilled, onRejected);
    }
  };

  return api;
};
