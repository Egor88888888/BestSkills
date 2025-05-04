# Post-Deploy Checklist

## Database Setup
- [ ] Create a new Supabase project
- [ ] Run initial migration: `cd packages/db && supabase db push`
- [ ] Run seed script: `cd scripts && ts-node seed.ts`
- [ ] Verify RLS policies are working correctly

## Edge Functions
- [ ] Deploy Edge Functions:
  ```bash
  cd packages/functions
  supabase functions deploy lock_hours
  supabase functions deploy add_hours
  supabase functions deploy cleanup_unverified
  ```
- [ ] Set up cron schedule for cleanup_unverified (every 15 minutes)
- [ ] Test each Edge Function with sample data

## Authentication
- [ ] Configure email provider in Supabase Auth
- [ ] Configure SMS provider for phone verification
- [ ] Test email verification flow
- [ ] Test phone verification flow
- [ ] Verify RLS policies for authenticated users

## Frontend
- [ ] Update environment variables in Netlify
- [ ] Verify all pages load correctly
- [ ] Test responsive design on mobile devices
- [ ] Verify dark mode functionality
- [ ] Test form validations
- [ ] Check error handling and toast notifications

## Features
- [ ] Test service creation and editing
- [ ] Test task creation and management
- [ ] Verify deal creation and escrow system
- [ ] Test hour locking and unlocking
- [ ] Verify transaction history
- [ ] Test review system
- [ ] Verify dispute resolution flow

## Security
- [ ] Verify all API routes are protected
- [ ] Check CORS settings
- [ ] Verify rate limiting is in place
- [ ] Test admin access controls
- [ ] Verify user data isolation

## Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify image optimization
- [ ] Test loading states and Suspense boundaries

## Monitoring
- [ ] Set up error tracking
- [ ] Configure logging
- [ ] Set up performance monitoring
- [ ] Create uptime monitoring

## Documentation
- [ ] Update README with deployment details
- [ ] Document API endpoints
- [ ] Create user documentation
- [ ] Document admin procedures

## Backup
- [ ] Set up database backups
- [ ] Configure backup retention policy
- [ ] Test backup restoration
- [ ] Document backup procedures 