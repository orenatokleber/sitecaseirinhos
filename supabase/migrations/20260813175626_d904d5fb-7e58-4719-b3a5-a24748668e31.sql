DELETE FROM public.campaign_events WHERE participation_id = 'f6be5199-4032-44ec-8e5c-41f1b66aac1a';
DELETE FROM public.campaign_rewards WHERE participation_id = 'f6be5199-4032-44ec-8e5c-41f1b66aac1a';
UPDATE public.campaign_prizes SET stock_used = GREATEST(stock_used - 1, 0) WHERE id = 'fedc94a0-b6f8-44c8-86e0-7aa69c643e02';
DELETE FROM public.campaign_participations WHERE id = 'f6be5199-4032-44ec-8e5c-41f1b66aac1a';