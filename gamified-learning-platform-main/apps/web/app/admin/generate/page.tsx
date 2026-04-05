"use client";

import { useEffect, useState } from 'react';
import { api } from '@/app/components/api';

export default function GenerateMissionPage() {
    const [topic, setTopic] = useState('');
    const [gradeLevel, setGradeLevel] = useState('7');
    const [numQuestions, setNumQuestions] = useState('7');
    const [subjectId, setSubjectId] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
    const [chapters, setChapters] = useState<Array<{ id: string; title: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/api/v1/content/subjects');
                setSubjects(data);
            } catch (e: any) {
                console.error(e);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!subjectId) { setChapters([]); setChapterId(''); return; }
            try {
                const { data } = await api.get(`/api/v1/content/subjects/${subjectId}/chapters`);
                setChapters(data);
            } catch (e: any) {
                console.error(e);
            }
        })();
    }, [subjectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const { data } = await api.post('/api/v1/content/generate-mission', {
                topic,
                gradeLevel: parseInt(gradeLevel, 10),
                numQuestions: parseInt(numQuestions, 10),
                subjectId: subjectId || undefined,
                chapterId: chapterId || undefined,
            });
            setResult(data);
            // Clear form on success
            setTopic('');
            setGradeLevel('7');
            setNumQuestions('7');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Content Generator</h1>
                <p className="text-gray-600 mb-6">Create a new learning mission powered by Gemini.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subject</label>
                            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">Unassigned</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chapter</label>
                            <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" disabled={!subjectId}>
                                <option value="">Unassigned</option>
                                {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Mission Topic</label>
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Photosynthesis"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700">Grade Level</label>
                        <select
                            id="gradeLevel"
                            value={gradeLevel}
                            onChange={(e) => setGradeLevel(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {Array.from({ length: 7 }, (_, i) => 6 + i).map(grade => (
                                <option key={grade} value={grade}>{`Grade ${grade}`}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700">Number of Quiz Questions</label>
                        <input id="numQuestions" type="number" min={5} max={10} value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {loading ? 'Generating...' : 'Generate Mission'}
                        </button>
                    </div>
                </form>

                {result && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                        <h3 className="text-lg font-semibold text-green-800">Success!</h3>
                        <p className="text-green-700 mt-1">Mission "{result.data.title}" created with ID: {result.missionId}</p>
                        <a className="inline-block mt-3 text-indigo-700 hover:underline" href={`/missions/${result.missionId}`}>Go to mission</a>
                    </div>
                )}

                {error && (
                     <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <h3 className="text-lg font-semibold text-red-800">Error</h3>
                        <p className="text-red-700 mt-1">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
