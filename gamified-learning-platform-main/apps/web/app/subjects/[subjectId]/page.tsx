"use client"

import { useState, useEffect } from "react"
import { ChevronRight, BookOpen, ArrowLeft, Zap, Trophy } from "lucide-react"
import { api } from "@/app/components/api"

// Define types for our data
interface Chapter {
    id: string
    title: string
    order: number
}

interface PageParams {
    params: {
        subjectId: string
    }
}

export default function SubjectPage({ params }: PageParams) {
    const { subjectId } = params
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!subjectId) return

        fetchChapters()
    }, [subjectId])

    const fetchChapters = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await api.get(`/subjects/${subjectId}/chapters`)
            
            if (response.data?.chapters) {
                setChapters(response.data.chapters)
            } else if (Array.isArray(response.data)) {
                setChapters(response.data)
            } else {
                setChapters([])
            }
        } catch (err: any) {
            console.error("Failed to fetch chapters:", err)
            setError("Failed to load chapters. Please try again.")
            setChapters([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-6 bg-gray-200 rounded-xl w-32"></div>
                        <div className="h-10 bg-gray-200 rounded-xl w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded-xl w-2/3"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded-2xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <a
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </a>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-white/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Chapters
                                </h1>
                                <p className="text-gray-600 mt-1">Choose a chapter to explore missions and start learning</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <span>{chapters.length} chapters available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-500" />
                                <span>Earn XP by completing missions</span>
                            </div>
                        </div>
                    </div>
                </header>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
                        <p className="text-red-600 font-medium">Error: {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="space-y-4">
                        {chapters.length === 0 ? (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/20">
                                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No chapters available</h3>
                                <p className="text-gray-500">Chapters for this subject will appear here once they&apos;re generated.</p>
                            </div>
                        ) : (
                            chapters.map((chapter, index) => (
                                <a href={`/chapters/${chapter.id}`} key={chapter.id} className="block group">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 group-hover:border-indigo-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {chapter.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">Chapter {index + 1} • Click to explore missions</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                                                    <Zap className="w-4 h-4" />
                                                    <span>Missions inside</span>
                                                </div>
                                                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}