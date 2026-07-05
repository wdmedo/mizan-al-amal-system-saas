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

export const queryOrg = async <T = any>(table: string) => {
  const organizationId = await getOrganizationId();
  return supabase.from<T>(table).eq('organization_id', organizationId);
};

export const createOrgQuery = queryOrg;

export const orgInsert = async <T = any, R = any>(table: string, rows: T[]) => {
  const organizationId = await getOrganizationId();
  const rowsWithOrg = rows.map(row => ({ ...row, organization_id: organizationId }));
  return supabase.from<R>(table).insert(rowsWithOrg);
};
