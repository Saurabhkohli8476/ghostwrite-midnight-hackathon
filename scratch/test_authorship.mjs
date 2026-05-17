import fetch from 'node-fetch';

async function testAuthorship() {
  const url = 'https://ghostwrite-midnight-hackathon.vercel.app/api/authorship';
  const claimedHash = '1f223de6fb407ca5c9ec8f899fc4fd272aa780850dc80e2273bb180d19775643';
  const suspiciousText = "The future of decentralized identity doesn't involve exposing more data. Instead, it focuses on proving truths without full revelation. Midnight makes this possible through selective credential disclosure. People can verify their age, qualifications, or permissions without showing underlying personal details. Privacy is built in from the start, not added later.";

  console.log("Testing authorship verification...");
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claimedHash, suspiciousText })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}

testAuthorship();
