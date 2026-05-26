
-- has_role is referenced by RLS policies which evaluate under the caller's role.
-- Restore EXECUTE so policy checks work for both anonymous and authenticated users.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated;
