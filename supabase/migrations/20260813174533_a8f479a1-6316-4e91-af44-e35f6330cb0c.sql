REVOKE EXECUTE ON FUNCTION public.select_prize_atomically(uuid, text, text, text, text, text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.select_prize_atomically(uuid, text, text, text, text, text, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.select_prize_atomically(uuid, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.select_prize_atomically(uuid, text, text, text, text, text, text) TO service_role;