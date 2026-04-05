import fetch from 'node-fetch';
import { GEMINI_API_KEY } from '../config/envVariables';

if (!GEMINI_API_KEY) {
    console.warn('[Gemini] GEMINI_API_KEY is not set. AI calls will fail until configured.');
}
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY || 'MISSING_KEY'}`;

// This is the blueprint for the 3-level mission data we want from the AI.
const MISSION_RESPONSE_SCHEMA = {
    type: "OBJECT",
    properties: {
        lessonTitle: { type: "STRING" },
        learningObjectives: { type: "ARRAY", items: { type: "STRING" } },
        lessonContent: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: { header: { type: "STRING" }, text: { type: "STRING" } },
                required: ["header", "text"]
            }
        },
        quizQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    questionText: { type: "STRING" },
                    options: { type: "ARRAY", items: { type: "STRING" } },
                    correctAnswerIndex: { type: "NUMBER" }
                },
                required: ["questionText", "options", "correctAnswerIndex"]
            }
        },
        gameIdea: {
            type: "OBJECT",
            properties: {
                title: { type: "STRING" },
                description: { type: "STRING" },
                rules: { type: "ARRAY", items: { type: "STRING" } }
            },
            required: ["title", "description", "rules"]
        }
    },
    required: ["lessonTitle", "learningObjectives", "lessonContent", "quizQuestions", "gameIdea"]
};

// --- Main AI Functions ---

/**
 * Generates a complete 3-level mission (Learn, Quiz, Game) for a given topic and grade.
 */
export const generateMissionFromTopic = async ({ topic, gradeLevel }: { topic: string; gradeLevel: number }) => {
    const systemPrompt = `
        You are an expert curriculum designer for Indian schools. Your task is to create a complete, three-level learning mission.
        The language must be simple and engaging for a student in grade ${gradeLevel} in Jabalpur, Madhya Pradesh.
        You will generate three parts:
        1. A simple lesson (lessonContent).
        2. A 4-option multiple-choice quiz with real, factual questions based on the lesson (quizQuestions).
        3. A creative, practical, and simple game idea (gameIdea) that reinforces the lesson's concept.
        The output MUST be a valid JSON object that adheres to the provided schema. Do NOT output placeholder text.
    `;
    const userPrompt = `Generate a learning mission on the topic: "${topic}".`;

    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: MISSION_RESPONSE_SCHEMA,
        },
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gemini API failed with status ${response.status}: ${errorBody}`);
        }

        const result = await response.json() as any;
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('Empty AI response');
        const jsonString = String(text).replace(/```json\n?|\n?```/g, '');
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error calling Gemini API for mission generation:", error);
        // Resilient fallback to keep UX flowing
        return {
            lessonTitle: `${topic} Basics`,
            learningObjectives: [
                `Understand fundamentals of ${topic}`,
                `Apply ${topic} in simple problems`,
            ],
            lessonContent: [
                { header: `Intro to ${topic}`, text: `Simple explanation for grade ${gradeLevel}.` },
                { header: `Examples`, text: `2-3 examples demonstrating ${topic}.` }
            ],
            quizQuestions: Array.from({ length: 5 }, (_, i) => ({
                questionText: `Q${i + 1}. A basic question about ${topic}?`,
                options: [
                    `Option A about ${topic}`,
                    `Option B about ${topic}`,
                    `Option C about ${topic}`,
                    `Option D about ${topic}`,
                ],
                correctAnswerIndex: i % 4
            })),
            gameIdea: {
                title: `${topic} Hunt`,
                description: `Find 3 real-life examples of ${topic}.`,
                rules: ["Work in pairs", "Explain each example", "Earn points for correctness"]
            }
        };
    }
};

/**
 * Generates a list of academic subjects for a given grade in India.
 */
export const generateSubjectsForGrade = async (gradeLevel: number): Promise<string[]> => {
    const systemPrompt = `You are an academic curriculum expert for India. Your task is to list the core academic subjects for a specific grade.`;
    const userPrompt = `List the main academic subjects for a student in Grade ${gradeLevel} in India, following a standard CBSE curriculum. Return the result as a simple JSON array of strings. Example: ["Mathematics", "Science"]`;

    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Gemini API failed to generate subjects.');

        const result = await response.json() as any;
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('Empty AI response');
        const jsonString = String(text).replace(/```json\n?|\n?```/g, '');
        // The result might be a stringified array, so we parse it.
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error calling Gemini API for subject generation:", error);
        // Fallback to a default list if AI fails
        return ["Mathematics", "Science", "Social Science", "English", "Hindi"];
    }
};

/**
 * Generates a list of chapter titles for a subject and grade.
 */
export const generateChaptersForSubject = async (gradeLevel: number, subjectName: string): Promise<Array<{ title: string; order: number }>> => {
    const systemPrompt = `You are an academic curriculum expert for India. Your task is to provide a clean list of chapter titles for a subject and grade.`;
    const userPrompt = `Provide 8 to 12 concise chapter titles for subject "${subjectName}" for Grade ${gradeLevel} (CBSE-like). Return only a JSON array of strings.`;

    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Gemini API failed to generate chapters.');

        const result = await response.json() as any;
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('Empty AI response');
        const jsonString = String(text).replace(/```json\n?|\n?```/g, '');
        const titles: string[] = JSON.parse(jsonString);
        return titles.slice(0, 12).map((title, idx) => ({ title, order: idx + 1 }));
    } catch (error) {
        console.error("Error calling Gemini API for chapter generation:", error);
        // Fallback minimal chapters
        const fallback = [
            `${subjectName} Fundamentals`,
            `${subjectName} Applications`,
            `${subjectName} Practice`
        ];
        return fallback.map((t, i) => ({ title: t, order: i + 1 }));
    }
};

