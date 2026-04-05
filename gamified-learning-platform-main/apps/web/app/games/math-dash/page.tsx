"use client"

import { useState, useEffect, useCallback } from "react"
import { Calculator, ArrowLeft, Trophy, Star, Play, Pause, RotateCcw, Zap, Target } from "lucide-react"
import Link from "next/link"

interface Question {
    question: string
    correctAnswer: number
    options: number[]
}

type GameState = "ready" | "playing" | "paused" | "finished"

export default function MathDashPage() {
    const [gameState, setGameState] = useState<GameState>("ready")
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
    const [score, setScore] = useState(0)
    const [questionsAnswered, setQuestionsAnswered] = useState(0)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    const [timeLeft, setTimeLeft] = useState(60)
    const [streak, setStreak] = useState(0)
    const [maxStreak, setMaxStreak] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [answerFeedback, setAnswerFeedback] = useState<"correct" | "incorrect" | null>(null)

    // Generate random math question
    const generateQuestion = useCallback((): Question => {
        const operations = ["+", "-", "×", "÷"]
        const operation = operations[Math.floor(Math.random() * operations.length)]

        let num1: number, num2: number, correctAnswer: number, question: string

        switch (operation) {
            case "+":
                num1 = Math.floor(Math.random() * 50) + 1
                num2 = Math.floor(Math.random() * 50) + 1
                correctAnswer = num1 + num2
                question = `${num1} + ${num2}`
                break
            case "-":
                num1 = Math.floor(Math.random() * 50) + 20
                num2 = Math.floor(Math.random() * (num1 - 1)) + 1
                correctAnswer = num1 - num2
                question = `${num1} - ${num2}`
                break
            case "×":
                num1 = Math.floor(Math.random() * 12) + 1
                num2 = Math.floor(Math.random() * 12) + 1
                correctAnswer = num1 * num2
                question = `${num1} × ${num2}`
                break
            case "÷":
                num2 = Math.floor(Math.random() * 10) + 2
                correctAnswer = Math.floor(Math.random() * 15) + 1
                num1 = num2 * correctAnswer
                question = `${num1} ÷ ${num2}`
                break
            default:
                num1 = 1
                num2 = 1
                correctAnswer = 2
                question = "1 + 1"
        }

        // Generate wrong options
        const options = [correctAnswer]
        while (options.length < 4) {
            let wrongAnswer: number
            if (operation === "÷") {
                wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5
            } else {
                wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10
            }

            if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
                options.push(wrongAnswer)
            }
        }

        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[options[i], options[j]] = [options[j], options[i]]
        }

        return { question, correctAnswer, options }
    }, [])

    // Start game
    const startGame = () => {
        setGameState("playing")
        setScore(0)
        setQuestionsAnswered(0)
        setCorrectAnswers(0)
        setTimeLeft(60)
        setStreak(0)
        setMaxStreak(0)
        setCurrentQuestion(generateQuestion())
        setSelectedAnswer(null)
        setAnswerFeedback(null)
    }

    // Handle answer selection
    const handleAnswerSelect = (answer: number) => {
        if (gameState !== "playing" || selectedAnswer !== null) return

        setSelectedAnswer(answer)
        setQuestionsAnswered((prev) => prev + 1)

        const isCorrect = answer === currentQuestion?.correctAnswer
        setAnswerFeedback(isCorrect ? "correct" : "incorrect")

        if (isCorrect) {
            setCorrectAnswers((prev) => prev + 1)
            setStreak((prev) => {
                const newStreak = prev + 1
                setMaxStreak((current) => Math.max(current, newStreak))
                return newStreak
            })

            // Calculate score with streak bonus
            const basePoints = 10
            const streakBonus = Math.min(streak * 2, 20)
            const timeBonus = timeLeft > 45 ? 5 : timeLeft > 30 ? 3 : 1
            setScore((prev) => prev + basePoints + streakBonus + timeBonus)
        } else {
            setStreak(0)
        }

        // Move to next question after feedback
        setTimeout(() => {
            setCurrentQuestion(generateQuestion())
            setSelectedAnswer(null)
            setAnswerFeedback(null)
        }, 1000)
    }

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout

        if (gameState === "playing" && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setGameState("finished")
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [gameState, timeLeft])

    // Pause/Resume game
    const togglePause = () => {
        setGameState((prev) => (prev === "playing" ? "paused" : "playing"))
    }

    const getAccuracy = () => {
        return questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0
    }

    const getAnswerButtonClass = (option: number) => {
        if (selectedAnswer === null) {
            return "bg-white border-2 border-gray-300 text-gray-800 hover:border-primary hover:bg-primary/5 active:scale-95"
        }

        if (option === currentQuestion?.correctAnswer) {
            return "bg-green-500 border-2 border-green-600 text-white"
        }

        if (option === selectedAnswer && option !== currentQuestion?.correctAnswer) {
            return "bg-red-500 border-2 border-red-600 text-white"
        }

        return "bg-gray-200 border-2 border-gray-300 text-gray-500"
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/games"
                                className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold">Ganit Runner</h1>
                                <p className="text-green-100">Math Speed Challenge</p>
                            </div>
                        </div>

                        {gameState === "playing" && (
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Trophy className="w-4 h-4" />
                                    <span>{score} XP</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Zap className="w-4 h-4" />
                                    <span>{streak} Streak</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Game Ready State */}
                {gameState === "ready" && (
                    <div className="text-center">
                        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6">
                                <Calculator className="w-10 h-10 text-white" />
                            </div>

                            <h2 className="text-3xl font-bold text-card-foreground mb-4">Ready to Race?</h2>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Solve as many math problems as you can in 60 seconds! Build streaks for bonus points and show off your
                                mental math skills.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <h3 className="font-semibold text-card-foreground">Goal</h3>
                                    <p className="text-sm text-muted-foreground">Answer correctly for points</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                    <h3 className="font-semibold text-card-foreground">Streaks</h3>
                                    <p className="text-sm text-muted-foreground">Consecutive correct answers</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                    <h3 className="font-semibold text-card-foreground">Bonus</h3>
                                    <p className="text-sm text-muted-foreground">Speed and accuracy rewards</p>
                                </div>
                            </div>

                            <button
                                onClick={startGame}
                                className="flex items-center gap-2 mx-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95 font-bold text-lg"
                            >
                                <Play className="w-6 h-6" />
                                Start Game
                            </button>
                        </div>
                    </div>
                )}

                {/* Game Playing State */}
                {(gameState === "playing" || gameState === "paused") && currentQuestion && (
                    <div>
                        {/* Game Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-card rounded-xl p-4 text-center shadow-sm border border-border">
                                <p className="text-3xl font-bold text-primary">{timeLeft}</p>
                                <p className="text-sm text-muted-foreground">Seconds Left</p>
                            </div>
                            <div className="bg-card rounded-xl p-4 text-center shadow-sm border border-border">
                                <p className="text-3xl font-bold text-secondary">{score}</p>
                                <p className="text-sm text-muted-foreground">Score</p>
                            </div>
                            <div className="bg-card rounded-xl p-4 text-center shadow-sm border border-border">
                                <p className="text-3xl font-bold text-chart-4">{streak}</p>
                                <p className="text-sm text-muted-foreground">Current Streak</p>
                            </div>
                            <div className="bg-card rounded-xl p-4 text-center shadow-sm border border-border">
                                <p className="text-3xl font-bold text-chart-5">{getAccuracy()}%</p>
                                <p className="text-sm text-muted-foreground">Accuracy</p>
                            </div>
                        </div>

                        {/* Pause Overlay */}
                        {gameState === "paused" && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-card rounded-2xl p-8 text-center shadow-xl">
                                    <Pause className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-card-foreground mb-4">Game Paused</h3>
                                    <button
                                        onClick={togglePause}
                                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-semibold"
                                    >
                                        Resume Game
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Question Area */}
                        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                            <div className="text-center mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-sm text-muted-foreground">Question {questionsAnswered + 1}</div>
                                    <button
                                        onClick={togglePause}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Pause className="w-4 h-4" />
                                        Pause
                                    </button>
                                </div>

                                <h2 className="text-5xl md:text-6xl font-bold text-card-foreground mb-2">
                                    {currentQuestion.question} = ?
                                </h2>

                                {/* Answer Feedback */}
                                {answerFeedback && (
                                    <div
                                        className={`mt-4 p-3 rounded-xl ${answerFeedback === "correct" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        <p className="font-semibold">
                                            {answerFeedback === "correct" ? "Correct! +" : "Incorrect!"}
                                            {answerFeedback === "correct" && (
                                                <span>{10 + Math.min(streak * 2, 20) + (timeLeft > 45 ? 5 : timeLeft > 30 ? 3 : 1)} XP</span>
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Answer Options */}
                            <div className="grid grid-cols-2 gap-4">
                                {currentQuestion.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(option)}
                                        disabled={selectedAnswer !== null}
                                        className={`p-6 rounded-2xl font-bold text-2xl transition-all duration-200 ${getAnswerButtonClass(option)}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            {/* Streak Indicator */}
                            {streak > 0 && (
                                <div className="mt-6 text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
                                        <Zap className="w-4 h-4" />
                                        <span className="font-semibold">
                                            {streak} Streak! +{Math.min(streak * 2, 20)} bonus XP
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Game Finished State */}
                {gameState === "finished" && (
                    <div className="text-center">
                        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6">
                                <Trophy className="w-10 h-10 text-white" />
                            </div>

                            <h2 className="text-3xl font-bold text-card-foreground mb-4">Time's Up!</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Great job! Here's how you performed in this math dash.
                            </p>

                            {/* Final Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-3xl font-bold text-primary">{score}</p>
                                    <p className="text-sm text-muted-foreground">Final Score</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-3xl font-bold text-secondary">{questionsAnswered}</p>
                                    <p className="text-sm text-muted-foreground">Questions Answered</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-3xl font-bold text-chart-4">{maxStreak}</p>
                                    <p className="text-sm text-muted-foreground">Best Streak</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-3xl font-bold text-chart-5">{getAccuracy()}%</p>
                                    <p className="text-sm text-muted-foreground">Accuracy</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={startGame}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-semibold"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Play Again
                                </button>
                                <Link
                                    href="/games"
                                    className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-colors font-semibold"
                                >
                                    <Star className="w-4 h-4" />
                                    More Games
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
