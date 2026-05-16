'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WizardProgress from '@/components/forms/WizardProgress';
import JobDescriptionStep from '@/components/forms/JobDescriptionStep';
import ExperienceStep from '@/components/forms/ExperienceStep';
import GenerateStep from '@/components/forms/GenerateStep';
import AuthGuard from '@/components/ui/AuthGuard';
import { useToast } from '@/components/ui/ToastProvider';
import { useGenerate } from '@/hooks/useGenerate';
import { useSecure } from '@/hooks/useSecure';

type Step = 1 | 2 | 3;

export default function CreatePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>(1);
  const [jobDescription, setJobDescription] = useState('');
  const [userExperience, setUserExperience] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');

  const { generate, loading: isGenerating, error: generateError, data: generateData } = useGenerate();
  const { secure, loading: isSecuring, error: secureError, result: secureResult } = useSecure();

  useEffect(() => {
    if (generateData && !isGenerating) {
      setUserExperience(generateData.letter); // Fill textarea with refined text
      setGeneratedLetter(generateData.letter); // Keep sync
      setJobTitle(generateData.jobTitle);
      setCompany(generateData.company || '');
      toast('Draft generated', 'success');
    }
  }, [generateData, isGenerating, toast]);

  useEffect(() => {
    if (generateError) toast('Failed to generate. Please try again.', 'error');
  }, [generateError, toast]);

  useEffect(() => {
    if (secureResult) {
      toast('Receipt sealed on Midnight 🎉', 'success');
      setTimeout(() => router.push('/dashboard'), 1800);
    }
  }, [secureResult, toast, router]);

  useEffect(() => {
    if (secureError) toast('Failed to seal document.', 'error');
  }, [secureError, toast]);

  const handleSecure = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();

      const fallbackTitle = jobDescription.split('\n')[0].substring(0, 50).trim() || 'Untitled Document';
      const finalJobTitle = jobTitle || fallbackTitle;

      const saveRes = await fetch('/api/letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ jobTitle: finalJobTitle, company, jobDescription, userExperience, generatedLetter }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || 'Failed to save document');

      // Silently generate and store semantic fingerprint
      await fetch('/api/fingerprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ text: generatedLetter, documentId: saveData.id })
      });

      secure(generatedLetter, saveData.id);
    } catch (err: any) {
      toast(err.message || 'Failed to initiate seal', 'error');
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 lg:px-8">

          {/* Page title */}
          <div className="mb-10 animate-fade-in-up">
            <h1
              className="text-4xl font-normal"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}
            >
              New Document
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
              Compose, generate, and seal a cryptographic receipt.
            </p>
          </div>

          <div className="h-px mb-10" style={{ backgroundColor: 'var(--border)' }} />

          <WizardProgress currentStep={step} />

          <div className="mt-10">
            {step === 1 && (
              <JobDescriptionStep
                value={jobDescription}
                onChange={setJobDescription}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <ExperienceStep
                value={userExperience}
                onChange={setUserExperience}
                onRegenerate={() => generate(jobDescription, userExperience)}
                onNext={() => {
                  setGeneratedLetter(userExperience);
                  setStep(3);
                }}
                onBack={() => setStep(1)}
                isGenerating={isGenerating}
              />
            )}

            {step === 3 && (
              <GenerateStep
                letter={generatedLetter}
                onChange={setGeneratedLetter}
                jobTitle={jobTitle}
                company={company}
                onBack={() => setStep(2)}
                onSecure={handleSecure}
                isSecuring={isSecuring}
              />
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
