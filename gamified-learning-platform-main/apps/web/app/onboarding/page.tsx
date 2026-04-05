"use client";

import { useEffect, useState } from "react";
import { api, getSession } from "@/app/components/api";

type Subject = { id: string; name: string };

export default function OnboardingPage() {
  const [grade, setGrade] = useState<string>("8");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefillDone, setPrefillDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        const user = session?.message?.user;
        if (user?.grade) {
          // Already onboarded
          window.location.href = "/dashboard";
          return;
        }
      } catch {}
      setPrefillDone(true);
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { grade: Number(grade) };
      await api.post("/api/v1/auth/user/onboarding", payload);
      window.location.href = "/dashboard";
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (!prefillDone) return null;

  return (
    <main className="min-h-[calc(100dvh-64px)] grid place-items-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold">Tell us about you</h1>
        <p className="text-sm text-gray-600 mt-1">We will personalize your subjects.</p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Grade/Class</label>
            <select className="w-full border rounded p-3" value={grade} onChange={(e) => setGrade(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => String(i + 1)).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <button disabled={loading} className="mt-4 w-full bg-indigo-600 text-white rounded p-3 font-semibold disabled:opacity-60">
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </main>
  );
}


