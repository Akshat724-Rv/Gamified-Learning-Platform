"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/app/components/api"
import {
  BookOpen,
  Target,
  Gamepad2,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  Zap,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"

interface QuizQuestion {
  question: string
  options: string[]
  answerIndex: number
}
interface GameIdea {
  title?: string
  materials?: string[]
  steps?: string[]
}
interface MissionData {
  id?: string
  title: string
  description?: string
  lessonContent?: string
  quizQuestions?: QuizQuestion[]
  gameIdea?: GameIdea | null
}

type ParamsShape = { missionId: string } | Promise<{ missionId: string }>
interface PageParams {
  params: ParamsShape
}

export default function MissionPage({ params }: PageParams) {
  const [missionId, setMissionId] = useState<string>("")
  const [mission, setMission] = useState<MissionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [view, setView] = useState<"lesson" | "quiz" | "level3" | "results">("lesson")
  const [score, setScore] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const maybePromise: any = params as any
        const resolved = typeof maybePromise?.then === "function" ? await maybePromise : params
        if (!cancelled) setMissionId((resolved as { missionId?: string })?.missionId ?? "")
      } catch (e) {
        if (!cancelled) setError("Failed to resolve route params")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [params])

  useEffect(() => {
    if (!missionId) return
    const fetchMission = async () => {
      try {
        setLoading(true)
        const { data } = await api.get(`/api/v1/content/missions/${missionId}`)
        setMission(data)
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to load mission")
      } finally {
        setLoading(false)
      }
    }
    fetchMission()
  }, [missionId])

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }))
  }

  const handleSubmitQuiz = () => {
    const questions = mission?.quizQuestions || []
    let s = 0
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answerIndex) s += 1
    })
    setScore(s)
    setView("level3")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded-xl w-32"></div>
            <div className="bg-white/80 rounded-2xl p-8 space-y-4">
              <div className="h-8 bg-gray-200 rounded-xl w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded-xl w-2/3"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Mission</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-600">Mission not found.</div>
        </div>
      </div>
    )
  }

  const questions = mission.quizQuestions || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Mission</span>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 sm:p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{mission.title}</h1>
                {mission.description && <p className="opacity-90 text-lg">{mission.description}</p>}
              </div>
              <div className="ml-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  {view === "lesson" && <BookOpen className="w-8 h-8" />}
                  {view === "quiz" && <Target className="w-8 h-8" />}
                  {(view === "level3" || view === "results") && <Trophy className="w-8 h-8" />}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${view === "lesson" ? "bg-white/20" : "bg-white/10"}`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">Learn</span>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${view === "quiz" ? "bg-white/20" : "bg-white/10"}`}
              >
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Quiz</span>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${view === "level3" || view === "results" ? "bg-white/20" : "bg-white/10"}`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="text-sm font-medium">Challenge</span>
              </div>
            </div>
          </header>

          <div className="p-6 sm:p-8">
            {view === "lesson" && (
              <div className="space-y-6">
                {mission.lessonContent && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Lesson Content</h2>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {mission.lessonContent}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setView("quiz")}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  {questions.length > 0 ? (
                    <>
                      <Target className="w-5 h-5" />
                      Start Quiz Challenge
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      Continue to Challenge
                    </>
                  )}
                </button>
              </div>
            )}

            {view === "quiz" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Quiz Challenge</h2>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No quiz available for this mission.</p>
                    <button
                      onClick={() => setView("level3")}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 active:scale-95"
                    >
                      Continue to Challenge
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((q, qi) => (
                      <div
                        key={qi}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {qi + 1}
                          </div>
                          <div className="font-semibold text-gray-900 flex-1">{q.question}</div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 ml-11">
                          {q.options.map((opt, oi) => (
                            <button
                              key={oi}
                              onClick={() => handleAnswerSelect(qi, oi)}
                              className={`text-left border-2 rounded-xl p-4 transition-all duration-200 ${
                                selectedAnswers[qi] === oi
                                  ? "border-purple-500 bg-purple-100 text-purple-800"
                                  : "border-gray-200 hover:border-purple-300 hover:bg-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 ${
                                    selectedAnswers[qi] === oi ? "border-purple-500 bg-purple-500" : "border-gray-300"
                                  }`}
                                >
                                  {selectedAnswers[qi] === oi && <CheckCircle className="w-5 h-5 text-white" />}
                                </div>
                                <span>{opt}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleSubmitQuiz}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all duration-300 active:scale-95"
                    >
                      <Trophy className="w-5 h-5" />
                      Submit Quiz & Continue
                    </button>
                  </div>
                )}
              </div>
            )}

            {view === "level3" && (
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Mission Complete!</h2>

                  {questions.length > 0 && (
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="text-lg font-semibold">
                          Quiz Score: {score}/{questions.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                        <span className="text-lg font-semibold">+{score * 20} XP</span>
                      </div>
                    </div>
                  )}
                </div>

                {mission.gameIdea ? (
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 border border-green-200 text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Gamepad2 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Practical Challenge</h3>
                    </div>

                    {mission.gameIdea.title && (
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">{mission.gameIdea.title}</h4>
                    )}

                    {Array.isArray(mission.gameIdea.materials) && mission.gameIdea.materials.length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-semibold text-gray-800 mb-2">Materials Needed:</h5>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {mission.gameIdea.materials.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(mission.gameIdea.steps) && mission.gameIdea.steps.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">Steps:</h5>
                        <ol className="list-decimal list-inside text-gray-700 space-y-2">
                          {mission.gameIdea.steps.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                    <Gamepad2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Challenge Coming Soon!</h3>
                    <p className="text-gray-600">
                      Practical challenges for this mission are being prepared. Great job completing the lesson and
                      quiz!
                    </p>
                  </div>
                )}

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 py-4 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  <Trophy className="w-5 h-5" />
                  Return to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
