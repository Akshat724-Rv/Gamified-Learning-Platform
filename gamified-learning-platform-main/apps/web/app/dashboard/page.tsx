"use client"
import { useEffect, useState } from "react"
import { api, getSession } from "@/app/components/api"
import Link from "next/link"
import { Trophy, Zap, BookOpen, Target, Star, TrendingUp, Award, Users, LogOut, Sparkles } from "lucide-react"

type Subject = { id: string; name: string }
type Mission = { id: string; title: string; description?: string }

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userStatus, setUserStatus] = useState<{ level: number; xp: number; displayName?: string } | null>(null)

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/auth/user/logout")
      window.location.href = "/signin"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const [subjectsRes, missionsRes, session] = await Promise.all([
          api.get("/api/v1/content/me/subjects"),
          api.get("/api/v1/content/missions"),
          getSession(),
        ])
        setSubjects(subjectsRes.data)
        setMissions(missionsRes.data)
        const user = session?.message?.user
        if (!user?.grade) {
          window.location.href = "/onboarding"
          return
        }
        setUserStatus({
          level: user.level ?? 1,
          xp: user.xp ?? 0,
          displayName: user.displayName || user.name || "Student",
        })
      } catch (e: any) {
        setError(e?.message || "Failed to load")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const getProgressToNextLevel = (xp: number) => {
    const xpPerLevel = 1000
    const currentLevelXp = xp % xpPerLevel
    const progress = (currentLevelXp / xpPerLevel) * 100
    return { progress, currentLevelXp, xpPerLevel }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100dvh-64px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100dvh-64px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {userStatus?.displayName}!
            </h1>
            <p className="text-gray-600 mt-1">Ready to continue your learning adventure?</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 active:scale-95 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {userStatus && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 font-medium">Current Level</div>
                  <div className="text-3xl font-bold">{userStatus.level}</div>
                </div>
                <Trophy className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 font-medium">Total XP</div>
                  <div className="text-3xl font-bold">{userStatus.xp.toLocaleString()}</div>
                </div>
                <Zap className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 font-medium">Subjects</div>
                  <div className="text-3xl font-bold">{subjects.length}</div>
                </div>
                <BookOpen className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 font-medium">Missions</div>
                  <div className="text-3xl font-bold">{missions.length}</div>
                </div>
                <Target className="w-10 h-10 opacity-80" />
              </div>
            </div>
          </div>
        )}

        {userStatus && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Progress to Level {userStatus.level + 1}</h3>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium text-gray-600">
                  {getProgressToNextLevel(userStatus.xp).currentLevelXp} /{" "}
                  {getProgressToNextLevel(userStatus.xp).xpPerLevel} XP
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressToNextLevel(userStatus.xp).progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  Your Subjects
                </h2>
                <div className="text-sm text-gray-500">{subjects.length} subjects available</div>
              </div>

              {subjects.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/20">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No subjects yet</h3>
                  <p className="text-gray-500">Your personalized subjects will appear here once generated.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <Link
                      key={subject.id}
                      href={`/subjects/${subject.id}`}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/20"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-indigo-600 group-hover:text-purple-600 transition-colors">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-gray-600 text-sm">Explore chapters and complete missions to earn XP</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  Recent Missions
                </h2>
                <div className="text-sm text-gray-500">{missions.length} missions completed</div>
              </div>

              {missions.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/20">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No missions yet</h3>
                  <p className="text-gray-500 mb-4">Start exploring subjects to unlock exciting missions!</p>
                  <Link
                    href="/subjects"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    Explore Subjects
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {missions.map((mission) => (
                    <Link
                      key={mission.id}
                      href={`/missions/${mission.id}`}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/20"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-purple-600 group-hover:text-pink-600 transition-colors">
                          <Award className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-600 transition-colors">
                        {mission.title}
                      </h3>
                      {mission.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{mission.description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-pink-600" />
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link
                  href="/community"
                  className="group bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8" />
                    <div className="text-right">
                      <div className="text-sm opacity-90">Join the</div>
                      <div className="font-bold">Community</div>
                    </div>
                  </div>
                  <p className="text-sm opacity-90">Ask questions, help others, and learn together with your peers</p>
                </Link>

                <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Trophy className="w-8 h-8" />
                    <div className="text-right">
                      <div className="text-sm opacity-90">Your</div>
                      <div className="font-bold">Achievements</div>
                    </div>
                  </div>
                  <p className="text-sm opacity-90">Coming soon! Track your badges, streaks, and accomplishments</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
