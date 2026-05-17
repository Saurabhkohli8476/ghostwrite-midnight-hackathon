import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fetch from 'node-fetch';

const URL = 'https://ghostwrite-midnight-hackathon.vercel.app';
//const URL = 'http://localhost:3000'; // fallback if needed

async function run() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const email = `test_verify_${Date.now()}@gmail.com`;
    console.log("Signing up:", email);
    const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password: 'password123' });
    if (authErr) throw authErr;

    const token = authData.session.access_token;
    console.log("Logged in. Token acquired.");

    const originalText = "The future of decentralized identity lies not in exposing more data, but in proving truths without revelation. Midnight enables this paradigm shift by allowing selective disclosure of credentials. Users can verify their age, qualifications, or permissions without revealing the underlying personal information. This is privacy by design — not as an afterthought, but as the foundation.";

    console.log("Saving document...");
    const res1 = await fetch(`${URL}/api/letters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ 
        jobTitle: "Original Manifesto", 
        company: "Midnight", 
        jobDescription: "Decentralized Identity", 
        userExperience: originalText, 
        generatedLetter: originalText 
      })
    });
    if (!res1.ok) {
        console.error(await res1.text());
        throw new Error("Failed saving doc");
    }
    const letter = await res1.json();
    console.log("Document saved:", letter.id);

    console.log("Generating fingerprint...");
    const res2 = await fetch(`${URL}/api/fingerprint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text: originalText, documentId: letter.id })
    });
    if (!res2.ok) {
        console.error(await res2.text());
        throw new Error("Failed generating fingerprint");
    }
    const fp = await res2.json();
    console.log("Fingerprint stored successfully.");

    console.log("Securing document...");
    const res3 = await fetch(`${URL}/api/secure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ documentId: letter.id })
    });
    if (!res3.ok) {
        console.error(await res3.text());
        throw new Error("Failed securing");
    }
    const secureData = await res3.json();

    console.log("===============================");
    console.log("SUCCESS!");
    console.log("HASH:", secureData.hash);
    console.log("===============================");

  } catch (err) {
    console.error(err);
  }
}

run();
