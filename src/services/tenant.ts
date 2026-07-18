import { supabase } from '@/integrations/supabase/client';

let cachedOrganizationId: string | null = null;

export const resetOrganizationCache = () => {
  cachedOrganizationId = null;
};

export const getOrganizationId = async (): Promise<string | null> => {
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

  const profileResult = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (!profileResult.error && profileResult.data?.organization_id) {
    cachedOrganizationId = profileResult.data.organization_id;
    return cachedOrganizationId;
  }

  const userOrgResult = await supabase
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!userOrgResult.error && userOrgResult.data?.organization_id) {
    cachedOrganizationId = userOrgResult.data.organization_id;
    return cachedOrganizationId;
  }

  return null;
};

export const queryOrg = async <T = unknown>(table: string) => {
  const organizationId = await getOrganizationId();
  if (organizationId) {
    return supabase.from<T>(table).eq('organization_id', organizationId);
  }
  return supabase.from<T>(table);
};

export const createOrgQuery = queryOrg;

export const orgInsert = <T = unknown, R = unknown>(table: string, rows: T[]) => {
  let selectArg: string | undefined;
  let single = false;

  const execute = async () => {
    const organizationId = await getOrganizationId();
    const rowsWithOrg = organizationId
      ? rows.map(row => ({ ...row, organization_id: organizationId }))
      : rows;
    const builder = supabase.from<R>(table).insert(rowsWithOrg);

    if (selectArg !== undefined) {
      builder.select(selectArg);
    } else {
      builder.select();
    }

    const result = single ? await builder.single() : await builder;

    if (
      organizationId &&
      result.error &&
      result.error.code === '42703' &&
      /organization_id/.test(result.error.message)
    ) {
      const retryBuilder = supabase.from<R>(table).insert(rows);
      if (selectArg !== undefined) {
        retryBuilder.select(selectArg);
      } else {
        retryBuilder.select();
      }
      return single ? retryBuilder.single() : retryBuilder;
    }

    return result;
  };

  const api = {
    select(columns?: string) {
      selectArg = columns;
      return api;
    },
    single() {
      single = true;
      return execute();
    },
    then(onFulfilled?: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) {
      return execute().then(onFulfilled, onRejected);
    }
  };

  return api;
};
