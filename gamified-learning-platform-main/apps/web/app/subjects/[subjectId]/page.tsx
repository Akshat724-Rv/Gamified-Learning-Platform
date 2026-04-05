"use client"

import { useState, useEffect } from "react"
// apne required imports yahan add kar lo (ChevronRight, BookOpen etc.)

// Next.js 15 ke liye updated type
interface PageProps {
    params: Promise<{
        chapterId: string
    }>
}

export default function ChapterPage({ params }: PageProps) {
    const [chapterData, setChapterData] = useState<any>(null)  // apna actual type daal sakte ho
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadChapter = async () => {
            try {
                const { chapterId } = await params   // ← yeh line zaroori hai
                
                // yahan apna API call daal do
                // const response = await api.get(`/chapters/${chapterId}`)
                // setChapterData(response.data)

                setLoading(false)
            } catch (err) {
                console.error(err)
                setError("Failed to load chapter")
                setLoading(false)
            }
        }

        loadChapter()
    }, [params])

    if (loading) {
        return <div className="p-8">Loading chapter...</div>
    }

    if (error) {
        return <div className="p-8 text-red-600">{error}</div>
    }

    return (
        <div>
            <h1>Chapter Page</h1>
            {/* apna pura UI yahan daal do */}
            <p>Chapter ID: { /* await kiya hua chapterId yahan use kar sakte ho */ }</p>
        </div>
    )
}