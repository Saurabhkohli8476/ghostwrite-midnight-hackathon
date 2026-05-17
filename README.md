GhostWrite
Privacy-preserving proof-of-authorship with AI fingerprinting and Midnight blockchain receipts.
Built for the Midnight × MLH Hackathon 2026.
https://nextjs.org
https://typescriptlang.org
https://supabase.com
https://groq.com
https://ghostwrite-midnight-hackathon.vercel.app
Live Demo: https://ghostwrite-midnight-hackathon.vercel.app
The Problem
Content theft is rampant. Ghostwriters, researchers, and journalists have their work paraphrased and claimed by others — and have no way to prove they wrote it first without exposing the original text.
Existing tools like Turnitin or Copyscape require you to submit your original writing, destroying any expectation of privacy.
The Solution
GhostWrite lets you:
Write or generate a document using AI
Seal it — a cryptographic hash is stored on the Midnight Preprod blockchain, timestamping your authorship forever
Prove derivation — if someone paraphrases your work, paste their text + your receipt hash and our AI fingerprinting engine computes a similarity score without ever seeing your original
Your content stays private. Only the proof is public.
How It Works
Authorship Fingerprinting (The Core Innovation)
When you secure a document, GhostWrite silently:
Sends your text to Groq's Llama-3.3-70B model
Extracts a semantic fingerprint: topics, entities, tone, vocabulary richness, sentence cadence, transition frequency
Stores the fingerprint in Supabase, linked to your Midnight receipt hash
When someone checks authorship:
Their suspicious text is fingerprinted the same way
A weighted similarity algorithm compares the two fingerprints (no original text is ever used)
Returns a similarity score with reasoning
Scoring weights: Topics (50%) · Style (20%) · Tone (15%) · Entities (15%)
Architecture
plain
Copy
User → Next.js App → Groq LLM (fingerprint extraction)
                   → Midnight Blockchain (hash receipt)
                   → Supabase (fingerprint + document storage)
plain
Copy
Verifier → /api/authorship → Supabase (fetch stored fingerprint)
                           → Groq LLM (extract suspicious text fingerprint)
                           → semanticCompare() → similarity score
Features
Table
Feature	Description
🤖 AI Drafting	Generate cover letters and professional documents via Llama-3.3-70B
⛓️ Midnight Receipts	Cryptographic hash sealed on Midnight Preprod Network
🔍 Authorship Check	Semantic fingerprint comparison — original stays private
📋 Public Verification	Anyone can verify a receipt hash
📄 PDF Export	Download formatted PDFs of secured documents
🔐 Auth	Supabase OAuth — email/password or magic link
Quick Start
Prerequisites
Node.js 18+
A Supabase project
A Groq API key (free)
1. Clone and install
bash
Copy
git clone https://github.com/Saurabhkohli8476/ghostwrite-midnight-hackathon.git
cd ghostwrite-midnight-hackathon
npm install
2. Set up environment variables
Create .env.local in the project root:
env
Copy
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq (free at console.groq.com)
GROQ_API_KEY=your_groq_api_key
3. Set up Supabase database
Run this SQL in your Supabase SQL Editor:
sql
Copy
-- Documents table
create table cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  job_title text,
  company text,
  job_description text,
  user_experience text,
  generated_letter text,
  midnight_hash text,
  midnight_tx text,
  is_secured boolean default false,
  secured_at timestamptz,
  created_at timestamptz default now()
);

-- Fingerprints table
create table document_fingerprints (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references cover_letters(id) on delete cascade,
  fingerprint jsonb not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table cover_letters enable row level security;
alter table document_fingerprints enable row level security;

create policy "Users manage own documents" on cover_letters
  for all using (auth.uid() = user_id);

create policy "Users manage own fingerprints" on document_fingerprints
  for all using (
    auth.uid() = (select user_id from cover_letters where id = document_id)
  );
4. Run
bash
Copy
npm run dev
# Open http://localhost:3000
Demo Flow (for judges)
Sign up with any email
Go to New Document → paste a job description → skip to Step 3
Paste any text as your "draft" → click Seal on Midnight
Wait for success toast → go to Archive → copy the document hash
Go to Verify → Check Authorship
Paste a paraphrased version of your text + the hash → click Analyze
See the similarity score and reasoning
Tech Stack
Table
Layer	Technology
Framework	Next.js 15 App Router
Language	TypeScript
Styling	Tailwind CSS + Custom CSS variables
AI Model	Groq llama-3.3-70b-versatile
Blockchain	Midnight Preprod Network
Database	Supabase PostgreSQL
Auth	Supabase Auth
Deployment	Vercel
Team
Saurabh Kohli — Full Stack Developer
Robin Rajratn — Full Stack Developer
Deepika Kohli — Full Stack Developer
Built at the Midnight × MLH Hackathon 2026.
