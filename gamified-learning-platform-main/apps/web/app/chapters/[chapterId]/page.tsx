"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Zap, ArrowLeft, Target, Trophy, Star } from "lucide-react"
import { api } from "@/app/components/api"

// Define types for our data
interface Mission {
    id: string
    title: string
    type: "lesson_quiz" // Or other types in the future
}

interface PageParams {
    params: {
        chapterId: string
    }
}

export default function ChapterPage({ params }: PageParams) {
    const { chapterId } = params
    const [missions, setMissions] = useState<Mission[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!chapterId) return

        const fetchMissions = async () => {
            try {
                const { data } = await api.get(`/api/v1/content/chapters/${chapterId}/missions`)
                setMissions(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMissions()
    }, [chapterId])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-6 bg-gray-200 rounded-xl w-32"></div>
                        <div className="h-32 bg-gray-200 rounded-2xl"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
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
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Missions
                                </h1>
                                <p className="text-gray-600 mt-1">Complete missions to earn XP and unlock achievements</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-xs">1</span>
                                </div>
                                <span>Learn concepts</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-600 font-bold text-xs">2</span>
                                </div>
                                <span>Take quiz</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                                    <span className="text-pink-600 font-bold text-xs">3</span>
                                </div>
                                <span>Play challenge</span>
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
                        {missions.length > 0 ? (
                            missions.map((mission, index) => (
                                <a href={`/missions/${mission.id}`} key={mission.id} className="block group">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 group-hover:border-purple-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Zap className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                                        <span className="text-xs font-bold text-yellow-800">{index + 1}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                                        {mission.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-sm text-gray-600">Mission {index + 1}</span>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                            <span className="text-sm text-gray-600">+100 XP</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full">
                                                    <Trophy className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm font-medium text-purple-700">Start Mission</span>
                                                </div>
                                                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/20">
                                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No missions yet!</h3>
                                <p className="text-gray-500 mb-6">
                                    Missions for this chapter will be generated soon. Check back later for exciting learning adventures!
                                </p>
                                <a
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 active:scale-95"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Dashboard
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
