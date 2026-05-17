import fetch from 'node-fetch';

async function testAuthorship() {
  const url = 'http://localhost:3000/api/authorship';
  const claimedHash = '1f223de6fb407ca5c9ec8f899fc4fd272aa780850dc80e2273bb180d19775643';
  
  const tests = [
    "The future of decentralized identity doesn't involve exposing more data. Instead, it focuses on proving truths without full revelation. Midnight makes this possible through selective credential disclosure. People can verify their age, qualifications, or permissions without showing underlying personal details. Privacy is built in from the start, not added later.",
    "Decentralized identity's evolution won't come from sharing more information. It's about verifying facts while keeping data private. Midnight achieves this via selective disclosure of credentials. Individuals can prove qualifications and permissions without exposing personal details. Privacy is foundational, not an add-on.",
    "Blockchain privacy solutions are transforming how we handle digital identity. New protocols allow users to share only necessary information while maintaining confidentiality. This approach protects sensitive data from unauthorized access. The technology ensures that verification happens without compromising personal privacy. It's a major advancement in data protection.",
    "The Renaissance period marked a profound transformation in European art and culture. Beginning in Florence during the 14th century, this movement emphasized humanism, classical learning, and artistic innovation. Figures like Leonardo da Vinci and Michelangelo revolutionized painting and sculpture. The invention of linear perspective allowed artists to create more realistic spatial representations."
  ];

  for (let i = 0; i < tests.length; i++) {
    console.log(`\nTesting Test ${i+1}...`);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimedHash, suspiciousText: tests[i] })
    });
    const text = await res.json();
    console.log(`Score: ${text.authorshipMatch?.similarityScore}% | Confidence: ${text.authorshipMatch?.confidence}`);
  }
}

testAuthorship();
