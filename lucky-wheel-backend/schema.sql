-- Create the "users" table
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,                    -- Auto-incrementing Integer ID
    name VARCHAR(255) NOT NULL,               -- Student Name
    blacklisted BOOLEAN DEFAULT FALSE,        -- Blacklist Status (true/false)
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Created Timestamp
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()  -- Updated Timestamp
);

-- Optional: Create an index on 'blacklisted' for faster queries
CREATE INDEX IF NOT EXISTS idx_users_blacklisted ON public.users(blacklisted);
