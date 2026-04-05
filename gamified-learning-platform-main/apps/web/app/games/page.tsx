"use client"

import { useState } from "react"
import {
    Gamepad2,
    BookOpen,
    Zap,
    Atom,
    Calculator,
    Trophy,
    Star,
    Play,
    ArrowRight,
    Dna,
    Target,
    MapPin,
    Scale,
    Users,
} from "lucide-react"
import Link from "next/link"

export default function GamesPage() {
    const [hoveredGame, setHoveredGame] = useState<string | null>(null)

    const games = [
        {
            id: "word-scramble",
            title: "Shabd Khoj",
            subtitle: "Word Scramble",
            description: "Unscramble science and English vocabulary words to boost your spelling skills!",
            icon: BookOpen,
            color: "from-blue-500 to-cyan-500",
            difficulty: "Easy",
            subject: "English/Science",
            estimatedTime: "5-10 min",
            href: "/games/word-scramble",
        },
        {
            id: "circuit-builder",
            title: "Circuit Master",
            subtitle: "Physics Puzzle",
            description: "Build complete electrical circuits by dragging components to the right places!",
            icon: Zap,
            color: "from-yellow-500 to-orange-500",
            difficulty: "Medium",
            subject: "Physics",
            estimatedTime: "10-15 min",
            href: "/games/circuit-builder",
        },
        {
            id: "element-match",
            title: "Tattva Match",
            subtitle: "Element Memory",
            description: "Match chemical elements with their symbols in this fun memory challenge!",
            icon: Atom,
            color: "from-purple-500 to-pink-500",
            difficulty: "Medium",
            subject: "Chemistry",
            estimatedTime: "8-12 min",
            href: "/games/element-match",
        },
        {
            id: "math-dash",
            title: "Ganit Runner",
            subtitle: "Math Dash",
            description: "Solve arithmetic problems as fast as you can in this exciting speed challenge!",
            icon: Calculator,
            color: "from-green-500 to-emerald-500",
            difficulty: "Hard",
            subject: "Mathematics",
            estimatedTime: "3-5 min",
            href: "/games/math-dash",
        },
        {
            id: "process-pioneer",
            title: "Process Pioneer",
            subtitle: "Biology Sequencing",
            description: "Arrange biological process steps in the correct order to master life sciences!",
            icon: Dna,
            color: "from-teal-500 to-green-500",
            difficulty: "Medium",
            subject: "Biology",
            estimatedTime: "8-12 min",
            href: "/games/process-pioneer",
        },
        {
            id: "gravity-archer",
            title: "Gravity Archer",
            subtitle: "Projectile Physics",
            description: "Master angles and velocity by launching projectiles to hit targets!",
            icon: Target,
            color: "from-red-500 to-orange-500",
            difficulty: "Hard",
            subject: "Physics",
            estimatedTime: "10-15 min",
            href: "/games/gravity-archer",
        },
        {
            id: "bharat-explorer",
            title: "Bharat Explorer",
            subtitle: "Geography Quiz",
            description: "Explore India's states, capitals, and landmarks in this interactive map game!",
            icon: MapPin,
            color: "from-indigo-500 to-blue-500",
            difficulty: "Medium",
            subject: "Geography",
            estimatedTime: "6-10 min",
            href: "/games/bharat-explorer",
        },
        {
            id: "equation-balance",
            title: "Equation Balance",
            subtitle: "Chemistry Balance",
            description: "Balance chemical equations by finding the right coefficients for each compound!",
            icon: Scale,
            color: "from-violet-500 to-purple-500",
            difficulty: "Hard",
            subject: "Chemistry",
            estimatedTime: "12-18 min",
            href: "/games/equation-balance",
        },
        {
            id: "virtual-lab",
            title: "Virtual Lab Explorer",
            subtitle: "2D Adventure",
            description: "Explore a virtual science lab and discover fascinating facts at every station!",
            icon: Users,
            color: "from-pink-500 to-rose-500",
            difficulty: "Easy",
            subject: "General Science",
            estimatedTime: "15-20 min",
            href: "/games/virtual-lab",
        },
    ]

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "bg-green-100 text-green-700"
            case "Medium":
                return "bg-yellow-100 text-yellow-700"
            case "Hard":
                return "bg-red-100 text-red-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary via-green-600 to-secondary text-white overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
                    <div className="absolute top-32 right-16 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-300"></div>
                    <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-700"></div>
                    <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-bounce delay-500"></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 animate-pulse">
                            <Gamepad2 className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-balance mb-4">
                            Games Arcade
                        </h1>

                        <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto text-balance leading-relaxed mb-8">
                            Learn through play! Master STEM concepts with fun, interactive games designed just for you.
                        </p>

                        <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-80">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4" />
                                <span>9 Fun Games</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                <span>Earn XP & Badges</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Play className="w-4 h-4" />
                                <span>Play Anywhere</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Games Grid */}
            <section className="py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Choose Your Adventure</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                            Each game is designed to make learning fun while building your knowledge in different subjects.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {games.map((game) => {
                            const IconComponent = game.icon
                            return (
                                <Link
                                    key={game.id}
                                    href={game.href}
                                    className="group block"
                                    onMouseEnter={() => setHoveredGame(game.id)}
                                    onMouseLeave={() => setHoveredGame(null)}
                                >
                                    <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border group-hover:border-primary/20">
                                        {/* Game Icon & Header */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div
                                                className={`w-16 h-16 bg-gradient-to-r ${game.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                            >
                                                <IconComponent className="w-8 h-8 text-white" />
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(game.difficulty)}`}
                                                >
                                                    {game.difficulty}
                                                </span>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <span>{game.estimatedTime}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Game Info */}
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-bold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                                                {game.title}
                                            </h3>
                                            <p className="text-sm font-medium text-muted-foreground mb-3">
                                                {game.subtitle} • {game.subject}
                                            </p>
                                            <p className="text-card-foreground leading-relaxed">{game.description}</p>
                                        </div>

                                        {/* Play Button */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Trophy className="w-4 h-4" />
                                                <span>Earn 50-100 XP</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                                                <span>Play Now</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>

                                        {/* Hover Effect Overlay */}
                                        {hoveredGame === game.id && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl pointer-events-none"></div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to Level Up?</h2>
                    <p className="text-lg text-muted-foreground mb-8 text-balance">
                        Complete games to earn XP, unlock achievements, and climb the leaderboard!
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground font-bold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <Trophy className="w-5 h-5" />
                            View Dashboard
                        </Link>
                        <Link
                            href="/community"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border-2 border-primary text-primary font-bold px-8 py-4 hover:bg-primary/10 transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <Star className="w-5 h-5" />
                            Join Community
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
