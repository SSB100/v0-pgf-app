-- Populate mock community data for testing
-- Creates groups, mock users, profiles, and sample messages

-- Insert journey type groups
INSERT INTO community_groups (id, journey_type, name, description)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'gambling', 'Gambling Recovery Support', 'A safe space for those recovering from gambling addiction'),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'alcohol', 'Alcohol Recovery Support', 'Support group for those on the journey to sobriety'),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'substances', 'Substance Recovery Support', 'Community for those overcoming substance use'),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'gaming', 'Gaming Recovery Support', 'Support for managing gaming habits'),
  ('550e8400-e29b-41d4-a716-446655440005'::uuid, 'mental_health', 'Mental Health Support', 'Connect on mental wellbeing and growth'),
  ('550e8400-e29b-41d4-a716-446655440006'::uuid, 'personal_growth', 'Personal Growth', 'Support for personal development and wellbeing')
ON CONFLICT (journey_type) DO NOTHING;

-- Create mock users (non-existent for testing purposes)
INSERT INTO users (id, email, password_hash, full_name, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'mock1@test.com', 'hash1', 'Mock User 1', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'mock2@test.com', 'hash2', 'Mock User 2', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'mock3@test.com', 'hash3', 'Mock User 3', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444'::uuid, 'mock4@test.com', 'hash4', 'Mock User 4', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555'::uuid, 'mock5@test.com', 'hash5', 'Mock User 5', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666'::uuid, 'mock6@test.com', 'hash6', 'Mock User 6', NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777'::uuid, 'mock7@test.com', 'hash7', 'Mock User 7', NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888'::uuid, 'mock8@test.com', 'hash8', 'Mock User 8', NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999'::uuid, 'mock9@test.com', 'hash9', 'Mock User 9', NOW(), NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'mock10@test.com', 'hash10', 'Mock User 10', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create community profiles for mock users
INSERT INTO community_profiles (id, user_id, alias_name, created_at, updated_at)
VALUES
  ('b0000000-0000-0000-0000-000000000001'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Phoenix Rising', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000002'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'Hope Keeper', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000003'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'Strong Heart', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000004'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'New Dawn', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000005'::uuid, '55555555-5555-5555-5555-555555555555'::uuid, 'Brave Soul', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000006'::uuid, '66666666-6666-6666-6666-666666666666'::uuid, 'Light Seeker', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000007'::uuid, '77777777-7777-7777-7777-777777777777'::uuid, 'Free Spirit', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000008'::uuid, '88888888-8888-8888-8888-888888888888'::uuid, 'Steady Ground', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000009'::uuid, '99999999-9999-9999-9999-999999999999'::uuid, 'Warrior Path', NOW(), NOW()),
  ('b0000000-0000-0000-0000-000000000010'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Clear Mind', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create group memberships for gambling group
INSERT INTO group_memberships (id, user_id, group_id, community_profile_id, joined_at, last_active_at)
VALUES
  ('c0000000-0000-0000-0000-000000000001'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, NOW() - INTERVAL '30 days', NOW() - INTERVAL '2 hours'),
  ('c0000000-0000-0000-0000-000000000002'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'b0000000-0000-0000-0000-000000000002'::uuid, NOW() - INTERVAL '20 days', NOW() - INTERVAL '1 hour'),
  ('c0000000-0000-0000-0000-000000000003'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, NOW() - INTERVAL '15 days', NOW()),
  ('c0000000-0000-0000-0000-000000000004'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'b0000000-0000-0000-0000-000000000004'::uuid, NOW() - INTERVAL '10 days', NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- Create group memberships for alcohol group
INSERT INTO group_memberships (id, user_id, group_id, community_profile_id, joined_at, last_active_at)
VALUES
  ('c0000000-0000-0000-0000-000000000005'::uuid, '55555555-5555-5555-5555-555555555555'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, NOW() - INTERVAL '45 days', NOW() - INTERVAL '3 hours'),
  ('c0000000-0000-0000-0000-000000000006'::uuid, '66666666-6666-6666-6666-666666666666'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'b0000000-0000-0000-0000-000000000006'::uuid, NOW() - INTERVAL '25 days', NOW() - INTERVAL '5 minutes'),
  ('c0000000-0000-0000-0000-000000000007'::uuid, '77777777-7777-7777-7777-777777777777'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

-- Create sample messages for gambling group
INSERT INTO community_messages (id, group_id, user_id, community_profile_id, content, created_at, updated_at)
VALUES
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Just completed my 30-day milestone! Feeling really proud of this progress. Thank you all for the support.', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'b0000000-0000-0000-0000-000000000002'::uuid, '@Phoenix Rising That''s amazing! 30 days is a huge achievement. Your strength inspires me to keep going.', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, 'Struggling a bit today. Had a moment where I almost relapsed but reached out to my support person instead. Feeling better now.', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, '@Strong Heart That''s exactly what we should be doing! Reaching out is a sign of strength, not weakness. You''re doing great.', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'b0000000-0000-0000-0000-000000000004'::uuid, 'Day 10 here. It''s getting easier but still some tough moments. Using the skills from the modules really helps.', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'b0000000-0000-0000-0000-000000000002'::uuid, '@New Dawn Keep it up! The first 2 weeks were hardest for me, but it does get easier. You''re on the right path!', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid, 'Remember, every single day is a victory. We''re all here for each other. This community means everything to me.', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid, '@Phoenix Rising Your message just lifted me up. Thank you for being here. 💙', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'b0000000-0000-0000-0000-000000000004'::uuid, 'Just did my daily check-in and it feels good to track my progress. Anyone else using the modules?', NOW() - INTERVAL '2 minutes', NOW() - INTERVAL '2 minutes');

-- Create sample messages for alcohol group
INSERT INTO community_messages (id, group_id, user_id, community_profile_id, content, created_at, updated_at)
VALUES
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002'::uuid, '55555555-5555-5555-5555-555555555555'::uuid, 'b0000000-0000-0000-0000-000000000005'::uuid, 'Hit 45 days alcohol free today! Never thought I could do this. Thank you for believing in me.', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002'::uuid, '66666666-6666-6666-6666-666666666666'::uuid, 'b0000000-0000-0000-0000-000000000006'::uuid, 'Congratulations! 45 days is incredible. Your dedication is inspiring all of us.', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002'::uuid, '77777777-7777-7777-7777-777777777777'::uuid, 'b0000000-0000-0000-0000-000000000007'::uuid, 'Day 5 for me. Feeling hopeful about this journey. So grateful to have found this community.', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour');

-- Insert update to user_profiles for growth levels (for visual representation)
UPDATE user_profiles 
SET tree_growth_level = CASE 
  WHEN user_id = '11111111-1111-1111-1111-111111111111'::uuid THEN 8
  WHEN user_id = '22222222-2222-2222-2222-222222222222'::uuid THEN 6
  WHEN user_id = '33333333-3333-3333-3333-333333333333'::uuid THEN 5
  WHEN user_id = '44444444-4444-4444-4444-444444444444'::uuid THEN 3
  WHEN user_id = '55555555-5555-5555-5555-555555555555'::uuid THEN 9
  WHEN user_id = '66666666-6666-6666-6666-666666666666'::uuid THEN 7
  WHEN user_id = '77777777-7777-7777-7777-777777777777'::uuid THEN 2
  ELSE 1
END
WHERE user_id IN (
  '11111111-1111-1111-1111-111111111111'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  '44444444-4444-4444-4444-444444444444'::uuid,
  '55555555-5555-5555-5555-555555555555'::uuid,
  '66666666-6666-6666-6666-666666666666'::uuid,
  '77777777-7777-7777-7777-777777777777'::uuid
);
