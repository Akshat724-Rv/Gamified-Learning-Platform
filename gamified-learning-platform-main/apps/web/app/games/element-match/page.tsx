"use client"

import { useState, useEffect } from "react"
import { Atom, ArrowLeft, Trophy, RotateCcw, CheckCircle, Timer } from "lucide-react"
import Link from "next/link"

interface Element {
    name: string
    symbol: string
    color: string
}

interface Card {
    id: string
    content: string
    type: "name" | "symbol"
    element: Element
    isFlipped: boolean
    isMatched: boolean
}

const ELEMENTS: Element[] = [
    { name: "Hydrogen", symbol: "H", color: "bg-red-100 text-red-800" },
    { name: "Helium", symbol: "He", color: "bg-blue-100 text-blue-800" },
    { name: "Carbon", symbol: "C", color: "bg-gray-100 text-gray-800" },
    { name: "Nitrogen", symbol: "N", color: "bg-indigo-100 text-indigo-800" },
    { name: "Oxygen", symbol: "O", color: "bg-green-100 text-green-800" },
    { name: "Sodium", symbol: "Na", color: "bg-yellow-100 text-yellow-800" },
    { name: "Iron", symbol: "Fe", color: "bg-orange-100 text-orange-800" },
    { name: "Gold", symbol: "Au", color: "bg-amber-100 text-amber-800" },
]

export default function ElementMatchPage() {
    const [cards, setCards] = useState<Card[]>([])
    const [flippedCards, setFlippedCards] = useState<string[]>([])
    const [matchedPairs, setMatchedPairs] = useState(0)
    const [moves, setMoves] = useState(0)
    const [gameComplete, setGameComplete] = useState(false)
    const [score, setScore] = useState(0)
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [gameStarted, setGameStarted] = useState(false)

    // Initialize game
    const initializeGame = () => {
        const gameCards: Card[] = []

        ELEMENTS.forEach((element, index) => {
            // Add name card
            gameCards.push({
                id: `name-${index}`,
                content: element.name,
                type: "name",
                element,
                isFlipped: false,
                isMatched: false,
            })

            // Add symbol card
            gameCards.push({
                id: `symbol-${index}`,
                content: element.symbol,
                type: "symbol",
                element,
                isFlipped: false,
                isMatched: false,
            })
        })

        // Shuffle cards
        for (let i = gameCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]]
        }

        setCards(gameCards)
        setFlippedCards([])
        setMatchedPairs(0)
        setMoves(0)
        setGameComplete(false)
        setScore(0)
        setTimeElapsed(0)
        setGameStarted(false)
    }

    // Handle card click
    const handleCardClick = (cardId: string) => {
        if (!gameStarted) {
            setGameStarted(true)
        }

        const card = cards.find((c) => c.id === cardId)
        if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
            return
        }

        const newFlippedCards = [...flippedCards, cardId]
        setFlippedCards(newFlippedCards)

        // Update card state
        setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))

        // Check for match when 2 cards are flipped
        if (newFlippedCards.length === 2) {
            setMoves((prev) => prev + 1)

            const [firstCardId, secondCardId] = newFlippedCards
            const firstCard = cards.find((c) => c.id === firstCardId)
            const secondCard = cards.find((c) => c.id === secondCardId)

            if (firstCard && secondCard && firstCard.element.name === secondCard.element.name) {
                // Match found
                setTimeout(() => {
                    setCards((prev) =>
                        prev.map((c) => (c.id === firstCardId || c.id === secondCardId ? { ...c, isMatched: true } : c)),
                    )
                    setMatchedPairs((prev) => prev + 1)
                    setScore((prev) => prev + 10)
                    setFlippedCards([])
                }, 1000)
            } else {
                // No match - flip cards back
                setTimeout(() => {
                    setCards((prev) =>
                        prev.map((c) => (c.id === firstCardId || c.id === secondCardId ? { ...c, isFlipped: false } : c)),
                    )
                    setFlippedCards([])
                }, 1500)
            }
        }
    }

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout

        if (gameStarted && !gameComplete) {
            interval = setInterval(() => {
                setTimeElapsed((prev) => prev + 1)
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [gameStarted, gameComplete])

    // Check game completion
    useEffect(() => {
        if (matchedPairs === ELEMENTS.length && !gameComplete) {
            setGameComplete(true)
            setGameStarted(false)

            // Bonus points for speed and efficiency
            const timeBonus = Math.max(0, 300 - timeElapsed) // Bonus for completing under 5 minutes
            const moveBonus = Math.max(0, (ELEMENTS.length * 2 - moves) * 2) // Bonus for fewer moves
            setScore((prev) => prev + timeBonus + moveBonus)
        }
    }, [matchedPairs, timeElapsed, moves, gameComplete])

    // Initialize game on mount
    useEffect(() => {
        initializeGame()
    }, [])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/games"
                                className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold">Tattva Match</h1>
                                <p className="text-purple-100">Element Memory Challenge</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Trophy className="w-4 h-4" />
                                <span>{score} XP</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Timer className="w-4 h-4" />
                                <span>{formatTime(timeElapsed)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Area */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Success Message */}
                {gameComplete && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div className="flex-1">
                            <p className="font-semibold text-green-800">Excellent! You matched all elements!</p>
                            <p className="text-sm text-green-600">
                                Completed in {formatTime(timeElapsed)} with {moves} moves • +{score} XP earned!
                            </p>
                        </div>
                    </div>
                )}

                {/* Game Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-card rounded-xl p-4 text-center shadow-sm border border-border">
                        <p className="text-2xl font-bold text-primary">
                            {matchedPairs}/{ELEMENTS.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Pairs Found</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 text-center shadow-sm border border-border">
                        <p className="text-2xl font-bold text-secondary">{moves}</p>
                        <p className="text-sm text-muted-foreground">Moves</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 text-center shadow-sm border border-border">
                        <p className="text-2xl font-bold text-chart-4">{formatTime(timeElapsed)}</p>
                        <p className="text-sm text-muted-foreground">Time</p>
                    </div>
                    <div className="bg-card rounded-xl p-4 text-center shadow-sm border border-border">
                        <p className="text-2xl font-bold text-chart-5">{score}</p>
                        <p className="text-sm text-muted-foreground">Score</p>
                    </div>
                </div>

                {/* Game Instructions */}
                <div className="bg-card rounded-2xl p-6 mb-8 shadow-lg border border-border">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Atom className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-card-foreground">How to Play</h2>
                            <p className="text-muted-foreground">Match element names with their chemical symbols</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-xs">
                                1
                            </div>
                            <span>Click cards to flip them over</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center font-bold text-xs">
                                2
                            </div>
                            <span>Find matching element pairs</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold text-xs">
                                3
                            </div>
                            <span>Match all pairs to win!</span>
                        </div>
                    </div>
                </div>

                {/* Game Board */}
                <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                onClick={() => handleCardClick(card.id)}
                                className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${card.isMatched
                                        ? `${card.element.color} border-2 border-green-400`
                                        : card.isFlipped
                                            ? `${card.element.color} border-2 border-primary`
                                            : "bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border-2 border-gray-300"
                                    }`}
                            >
                                <div className="w-full h-full flex items-center justify-center p-2">
                                    {card.isFlipped || card.isMatched ? (
                                        <div className="text-center">
                                            <div className="font-bold text-lg md:text-xl mb-1">
                                                {card.type === "symbol" ? card.content : ""}
                                            </div>
                                            <div className="text-xs md:text-sm font-medium">{card.type === "name" ? card.content : ""}</div>
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 bg-white/50 rounded-full flex items-center justify-center">
                                            <Atom className="w-4 h-4 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Game Controls */}
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={initializeGame}
                            className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-colors font-semibold"
                        >
                            <RotateCcw className="w-4 h-4" />
                            New Game
                        </button>
                    </div>
                </div>

                {/* Element Reference */}
                <div className="mt-8 bg-card rounded-2xl p-6 shadow-lg border border-border">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">Element Reference</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {ELEMENTS.map((element) => (
                            <div key={element.name} className={`p-3 rounded-lg ${element.color}`}>
                                <div className="font-bold text-lg">{element.symbol}</div>
                                <div className="text-sm">{element.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
