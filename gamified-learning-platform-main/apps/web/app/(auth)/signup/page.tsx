"use client"
import { useState } from "react"
import type React from "react"

import axios from "axios"
import { User, Mail, Lock, Sparkles, BookOpen, Trophy } from "lucide-react"

export default function SignupPage() {
    const [form, setForm] = useState({ email: "", password: "", displayName: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/user/signup`, form, {
                withCredentials: true,
            })
            window.location.href = "/signin"
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong"
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-[calc(100dvh-64px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-pulse delay-500"></div>
            </div>

            <div className="relative max-w-md mx-auto">
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Join EduManthan
                    </h1>
                    <p className="text-gray-600 mt-2 text-balance">
                        Start your gamified learning journey and unlock your potential
                    </p>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20"
                >
                    <div className="space-y-5">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                placeholder="Display name"
                                value={form.displayName}
                                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                type="email"
                                placeholder="Email address"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                type="password"
                                placeholder="Create password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                        className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:shadow-md active:scale-95"
                    >
                        <img src="/google.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </a>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-3 px-4 font-semibold disabled:opacity-60 hover:shadow-lg transition-all duration-200 active:scale-95 disabled:active:scale-100"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Creating account...
                            </div>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    <p className="text-sm mt-6 text-center text-gray-600">
                        Already have an account?{" "}
                        <a className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors" href="/signin">
                            Sign in
                        </a>
                    </p>
                </form>

                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <BookOpen className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 font-medium">Interactive Lessons</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 font-medium">Earn XP & Badges</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <Sparkles className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 font-medium">Fun Challenges</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
