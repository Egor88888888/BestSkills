# BarterHours

A marketplace platform where services are exchanged using hours as currency.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Netlify

## Prerequisites

- Node.js 18+
- pnpm
- Supabase account
- Netlify account

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/barterhours.git
   cd barterhours
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the `apps/web` directory:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://db.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=supabaseKey123abc
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Create a new Supabase project
2. Run the initial migration:
   ```bash
   cd packages/db
   supabase db push
   ```

## Edge Functions

The following Edge Functions are included:

- `lock_hours`: Locks hours for a deal
- `add_hours`: Adds hours to a user's balance
- `cleanup_unverified`: Removes unverified accounts (runs every 15 minutes)

To deploy Edge Functions:
```bash
cd packages/functions
supabase functions deploy lock_hours
supabase functions deploy add_hours
supabase functions deploy cleanup_unverified
```

## Deployment

1. Push your code to a GitHub repository
2. Connect your repository to Netlify
3. Set the following environment variables in Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Set the build command to `pnpm run build:web`
5. Deploy!

## Project Structure

```
barterhours/
├── apps/
│   └── web/                 # Next.js frontend
├── packages/
│   ├── db/                  # Database migrations
│   └── functions/           # Supabase Edge Functions
└── scripts/                 # Seed scripts
```

## Features

- Email + SMS authentication
- User profiles with hours balance
- Services marketplace
- Task posting and management
- Escrow system for deals
- Reviews and ratings
- Dispute resolution
- Admin dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 