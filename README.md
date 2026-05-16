# GhostWrite

> **Privacy-first proof-of-creation tool with Midnight blockchain receipts**
> Built for the Midnight × MLH Hackathon 2026

![GhostWrite Demo](https://via.placeholder.com/1200x630.png?text=GhostWrite+Preview)

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38BDF8)
![Supabase](https://img.shields.io/badge/Supabase-DB%20%26%20Auth-3ECF8E)
![OpenAI](https://img.shields.io/badge/Groq-Llama_3-412991)

## Overview

Writers, researchers, and creators fear plagiarism and idea theft when sharing their work. They have no definitive proof that they created a document first. 

**GhostWrite** solves this by letting users generate, edit, and secure high-quality drafts via AI, creating a cryptographic proof (receipt) of the document onto the Midnight blockchain. This proves authorship and existence at a specific time, without exposing the actual content of the creation.

### Features
- 🚀 **AI Drafting Assistance**: Generates contextual drafts using Llama-3 (via Groq).
- 🔐 **Privacy Receipts**: Hashes the document on the client and stores the proof on the Midnight Preprod Network.
- 📝 **Public Verification**: Anyone can verify the hash independently.
- 📄 **PDF Export**: Generate perfectly formatted PDFs of your secured documents.
- 🛡️ **End-to-End Auth**: Powered by Supabase OAuth.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local

# 3. Run development server
npm run dev
```

## Architecture

- **Frontend**: Next.js App Router, Tailwind CSS, Lucide Icons
- **Backend APIs**: Next.js Serverless Functions (`/api/generate`, `/api/secure`, `/api/letters`, `/api/verify`)
- **Database & Auth**: Supabase PostgreSQL + Row Level Security (RLS)
- **Blockchain**: Simulated Midnight Service with client-side Web Crypto API hashing
- **PDF Generation**: jsPDF

## Team

- **Saurabh** - Full Stack Developer

*This project was built during the Midnight × MLH Hackathon 2026.*
