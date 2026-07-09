# CivicAI Supabase Schema

Run `schema.sql` in the Supabase SQL editor or through the Supabase CLI to create the CivicAI database structure.

## Tables
- `users` - app profile records linked to `auth.users`
- `departments` - municipal routing configuration
- `complaints` - citizen reports with AI analysis and status fields
- `activity_logs` - audit trail for complaint actions

## Environment variables
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SCHEMA` defaulting to `public`

## Notes
- The backend repository layer uses the service-role key for server-side access.
- The schema seeds the standard CivicAI departments so routing works immediately after deploy.
