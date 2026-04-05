"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle, XCircle, MapPin, Trophy, Star } from "lucide-react"
import Link from "next/link"

interface Question {
    id: string
    question: string
    correctState: string
    hint: string
    category: "capital" | "landmark" | "geography"
}

interface GameState {
    currentQuestion: Question | null
    score: number
    questionNumber: number
    totalQuestions: number
    selectedState: string | null
    showResult: boolean
    isCorrect: boolean
    gameComplete: boolean
}

export default function BharatExplorerGame() {
    const [gameState, setGameState] = useState<GameState>({
        currentQuestion: null,
        score: 0,
        questionNumber: 0,
        totalQuestions: 10,
        selectedState: null,
        showResult: false,
        isCorrect: false,
        gameComplete: false,
    })

    const [hoveredState, setHoveredState] = useState<string | null>(null)
    const [showHint, setShowHint] = useState(false)

    const questions: Question[] = [
        {
            id: "1",
            question: "Which state is home to the Gir Forest National Park?",
            correctState: "gujarat",
            hint: "This western state is known for its business-friendly environment and is the birthplace of Mahatma Gandhi.",
            category: "landmark",
        },
        {
            id: "2",
            question: "Which state has Thiruvananthapuram as its capital?",
            correctState: "kerala",
            hint: "This southern state is famous for its backwaters and spices.",
            category: "capital",
        },
        {
            id: "3",
            question: "Which state is known as the 'Land of Five Rivers'?",
            correctState: "punjab",
            hint: "This northern state is famous for its agriculture and Sikh culture.",
            category: "geography",
        },
        {
            id: "4",
            question: "Which state houses the famous Konark Sun Temple?",
            correctState: "odisha",
            hint: "This eastern state is known for its classical dance form Odissi.",
            category: "landmark",
        },
        {
            id: "5",
            question: "Which state has Gandhinagar as its capital?",
            correctState: "gujarat",
            hint: "This state is also home to the Statue of Unity.",
            category: "capital",
        },
        {
            id: "6",
            question: "Which state is famous for the Valley of Flowers?",
            correctState: "uttarakhand",
            hint: "This Himalayan state was carved out from Uttar Pradesh in 2000.",
            category: "landmark",
        },
        {
            id: "7",
            question: "Which state has the highest literacy rate in India?",
            correctState: "kerala",
            hint: "This state is also known as 'God's Own Country'.",
            category: "geography",
        },
        {
            id: "8",
            question: "Which state is home to the Kaziranga National Park?",
            correctState: "assam",
            hint: "This northeastern state is famous for its tea gardens and one-horned rhinoceros.",
            category: "landmark",
        },
        {
            id: "9",
            question: "Which state has Bhopal as its capital?",
            correctState: "madhya-pradesh",
            hint: "This central state is known as the 'Heart of India'.",
            category: "capital",
        },
        {
            id: "10",
            question: "Which state is the largest by area in India?",
            correctState: "rajasthan",
            hint: "This desert state is famous for its palaces and forts.",
            category: "geography",
        },
    ]

    const stateColors = {
        default: "#E5E7EB",
        hover: "#DBEAFE",
        selected: "#3B82F6",
        correct: "#10B981",
        incorrect: "#EF4444",
    }

    useEffect(() => {
        startNewGame()
    }, [])

    const startNewGame = () => {
        const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5)
        setGameState({
            currentQuestion: shuffledQuestions[0],
            score: 0,
            questionNumber: 1,
            totalQuestions: Math.min(10, shuffledQuestions.length),
            selectedState: null,
            showResult: false,
            isCorrect: false,
            gameComplete: false,
        })
        setShowHint(false)
    }

    const handleStateClick = (stateId: string) => {
        if (gameState.showResult || !gameState.currentQuestion) return

        setGameState((prev) => ({ ...prev, selectedState: stateId }))

        const isCorrect = stateId === gameState.currentQuestion.correctState

        setTimeout(() => {
            setGameState((prev) => ({
                ...prev,
                showResult: true,
                isCorrect,
                score: isCorrect ? prev.score + 10 : prev.score,
            }))
        }, 500)
    }

    const nextQuestion = () => {
        if (gameState.questionNumber >= gameState.totalQuestions) {
            setGameState((prev) => ({ ...prev, gameComplete: true }))
            return
        }

        const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5)
        const nextQ = shuffledQuestions.find((q) => q.id !== gameState.currentQuestion?.id) || shuffledQuestions[0]

        setGameState((prev) => ({
            ...prev,
            currentQuestion: nextQ,
            questionNumber: prev.questionNumber + 1,
            selectedState: null,
            showResult: false,
            isCorrect: false,
        }))
        setShowHint(false)
    }

    const getStateColor = (stateId: string) => {
        if (!gameState.showResult) {
            if (gameState.selectedState === stateId) return stateColors.selected
            if (hoveredState === stateId) return stateColors.hover
            return stateColors.default
        }

        if (stateId === gameState.currentQuestion?.correctState) return stateColors.correct
        if (stateId === gameState.selectedState && !gameState.isCorrect) return stateColors.incorrect
        return stateColors.default
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/games" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Games</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold">{gameState.score} XP</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                                Question: {gameState.questionNumber}/{gameState.totalQuestions}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Game Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl mb-4">
                        <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Bharat Explorer</h1>
                    <p className="text-lg text-gray-600">Explore India's geography, capitals, and landmarks!</p>
                </div>

                {!gameState.gameComplete ? (
                    <>
                        {/* Current Question */}
                        {gameState.currentQuestion && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Question {gameState.questionNumber}</h2>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${gameState.currentQuestion.category === "capital"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : gameState.currentQuestion.category === "landmark"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-purple-100 text-purple-700"
                                                }`}
                                        >
                                            {gameState.currentQuestion.category.charAt(0).toUpperCase() +
                                                gameState.currentQuestion.category.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-lg text-gray-700 mb-4">{gameState.currentQuestion.question}</p>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setShowHint(!showHint)}
                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                                    >
                                        <Star className="w-4 h-4" />
                                        {showHint ? "Hide Hint" : "Show Hint"}
                                    </button>
                                </div>

                                {showHint && (
                                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Hint:</strong> {gameState.currentQuestion.hint}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* India Map */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Click on the correct state!</h3>

                            <div className="flex justify-center">
                                <svg width="600" height="400" viewBox="0 0 600 400" className="max-w-full h-auto border rounded-lg">
                                    {/* Simplified India Map - Major States */}

                                    {/* Rajasthan */}
                                    <path
                                        d="M 100 150 L 180 150 L 180 220 L 100 220 Z"
                                        fill={getStateColor("rajasthan")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("rajasthan")}
                                        onMouseEnter={() => setHoveredState("rajasthan")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="140"
                                        y="185"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        Rajasthan
                                    </text>

                                    {/* Gujarat */}
                                    <path
                                        d="M 80 220 L 150 220 L 150 280 L 80 280 Z"
                                        fill={getStateColor("gujarat")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("gujarat")}
                                        onMouseEnter={() => setHoveredState("gujarat")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="115"
                                        y="250"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        Gujarat
                                    </text>

                                    {/* Maharashtra */}
                                    <path
                                        d="M 150 240 L 220 240 L 220 300 L 150 300 Z"
                                        fill={getStateColor("maharashtra")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("maharashtra")}
                                        onMouseEnter={() => setHoveredState("maharashtra")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="185"
                                        y="270"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        Maharashtra
                                    </text>

                                    {/* Madhya Pradesh */}
                                    <path
                                        d="M 180 180 L 280 180 L 280 240 L 180 240 Z"
                                        fill={getStateColor("madhya-pradesh")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("madhya-pradesh")}
                                        onMouseEnter={() => setHoveredState("madhya-pradesh")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="230"
                                        y="210"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        MP
                                    </text>

                                    {/* Uttar Pradesh */}
                                    <path
                                        d="M 250 120 L 380 120 L 380 180 L 250 180 Z"
                                        fill={getStateColor("uttar-pradesh")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("uttar-pradesh")}
                                        onMouseEnter={() => setHoveredState("uttar-pradesh")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="315"
                                        y="150"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        UP
                                    </text>

                                    {/* Punjab */}
                                    <path
                                        d="M 200 80 L 260 80 L 260 120 L 200 120 Z"
                                        fill={getStateColor("punjab")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("punjab")}
                                        onMouseEnter={() => setHoveredState("punjab")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="230"
                                        y="100"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        Punjab
                                    </text>

                                    {/* Uttarakhand */}
                                    <path
                                        d="M 280 80 L 330 80 L 330 120 L 280 120 Z"
                                        fill={getStateColor("uttarakhand")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("uttarakhand")}
                                        onMouseEnter={() => setHoveredState("uttarakhand")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="305"
                                        y="100"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        UK
                                    </text>

                                    {/* West Bengal */}
                                    <path
                                        d="M 420 140 L 480 140 L 480 200 L 420 200 Z"
                                        fill={getStateColor("west-bengal")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("west-bengal")}
                                        onMouseEnter={() => setHoveredState("west-bengal")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="450"
                                        y="170"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        WB
                                    </text>

                                    {/* Odisha */}
                                    <path
                                        d="M 380 200 L 440 200 L 440 260 L 380 260 Z"
                                        fill={getStateColor("odisha")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("odisha")}
                                        onMouseEnter={() => setHoveredState("odisha")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="410"
                                        y="230"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        Odisha
                                    </text>

                                    {/* Assam */}
                                    <path
                                        d="M 480 120 L 540 120 L 540 160 L 480 160 Z"
                                        fill={getStateColor("assam")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("assam")}
                                        onMouseEnter={() => setHoveredState("assam")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="510"
                                        y="140"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        Assam
                                    </text>

                                    {/* Karnataka */}
                                    <path
                                        d="M 200 300 L 270 300 L 270 360 L 200 360 Z"
                                        fill={getStateColor("karnataka")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("karnataka")}
                                        onMouseEnter={() => setHoveredState("karnataka")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="235"
                                        y="330"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        Karnataka
                                    </text>

                                    {/* Kerala */}
                                    <path
                                        d="M 170 340 L 200 340 L 200 380 L 170 380 Z"
                                        fill={getStateColor("kerala")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("kerala")}
                                        onMouseEnter={() => setHoveredState("kerala")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="185"
                                        y="360"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        Kerala
                                    </text>

                                    {/* Tamil Nadu */}
                                    <path
                                        d="M 270 320 L 340 320 L 340 380 L 270 380 Z"
                                        fill={getStateColor("tamil-nadu")}
                                        stroke="#374151"
                                        strokeWidth="1"
                                        className="cursor-pointer transition-all duration-200 hover:stroke-2"
                                        onClick={() => handleStateClick("tamil-nadu")}
                                        onMouseEnter={() => setHoveredState("tamil-nadu")}
                                        onMouseLeave={() => setHoveredState(null)}
                                    />
                                    <text
                                        x="305"
                                        y="350"
                                        textAnchor="middle"
                                        className="text-xs font-medium fill-gray-700 pointer-events-none"
                                    >
                                        Tamil Nadu
                                    </text>
                                </svg>
                            </div>
                        </div>

                        {/* Result Display */}
                        {gameState.showResult && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                                {gameState.isCorrect ? (
                                    <>
                                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-green-600 mb-2">Correct!</h3>
                                        <p className="text-gray-600 mb-4">Great job! You earned 10 XP.</p>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-red-600 mb-2">Not quite right!</h3>
                                        <p className="text-gray-600 mb-4">The correct answer was highlighted in green. Keep exploring!</p>
                                    </>
                                )}

                                <button
                                    onClick={nextQuestion}
                                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    {gameState.questionNumber >= gameState.totalQuestions ? "Finish Game" : "Next Question"}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Game Complete */
                    <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                        <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Complete!</h2>
                        <p className="text-xl text-gray-600 mb-2">Final Score: {gameState.score} XP</p>
                        <p className="text-lg text-gray-500 mb-8">
                            You got {gameState.score / 10} out of {gameState.totalQuestions} questions correct!
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={startNewGame}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                Play Again
                            </button>
                            <Link
                                href="/games"
                                className="w-full sm:w-auto px-8 py-4 border-2 border-indigo-500 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all duration-300 hover:scale-105"
                            >
                                Back to Games
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
