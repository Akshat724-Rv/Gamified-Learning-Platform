"use client"

import { useState, useEffect } from "react"
import { BookOpen, Lightbulb, RotateCcw, Trophy, Star, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

const VOCABULARY_WORDS = [
    { word: "PHOTOSYNTHESIS", hint: "Process plants use to make food from sunlight" },
    { word: "GRAVITY", hint: "Force that pulls objects toward Earth" },
    { word: "MOLECULE", hint: "Smallest unit of a chemical compound" },
    { word: "ECOSYSTEM", hint: "Community of living and non-living things" },
    { word: "ELECTRICITY", hint: "Form of energy from moving electrons" },
    { word: "ATMOSPHERE", hint: "Layer of gases surrounding Earth" },
    { word: "CHROMOSOME", hint: "Structure containing genetic information" },
    { word: "VELOCITY", hint: "Speed with direction" },
    { word: "CATALYST", hint: "Substance that speeds up chemical reactions" },
    { word: "METAMORPHOSIS", hint: "Complete change in form during development" },
    { word: "PRECIPITATION", hint: "Water falling from clouds as rain or snow" },
    { word: "BIODIVERSITY", hint: "Variety of life in an ecosystem" },
    { word: "MAGNETISM", hint: "Force of attraction or repulsion" },
    { word: "RESPIRATION", hint: "Process of breathing and gas exchange" },
    { word: "EVOLUTION", hint: "Change in species over time" },
]

export default function WordScramblePage() {
    const [currentWord, setCurrentWord] = useState(VOCABULARY_WORDS[0])
    const [scrambledLetters, setScrambledLetters] = useState<string[]>([])
    const [userAnswer, setUserAnswer] = useState("")
    const [showHint, setShowHint] = useState(false)
    const [gameState, setGameState] = useState<"playing" | "correct" | "incorrect">("playing")
    const [score, setScore] = useState(0)
    const [wordsCompleted, setWordsCompleted] = useState(0)
    const [attempts, setAttempts] = useState(0)

    // Scramble the letters of a word
    const scrambleWord = (word: string) => {
        const letters = word.split("")
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[letters[i], letters[j]] = [letters[j], letters[i]]
        }
        return letters
    }

    // Initialize game with a random word
    const initializeGame = () => {
        const randomWord = VOCABULARY_WORDS[Math.floor(Math.random() * VOCABULARY_WORDS.length)]
        setCurrentWord(randomWord)
        setScrambledLetters(scrambleWord(randomWord.word))
        setUserAnswer("")
        setShowHint(false)
        setGameState("playing")
    }

    // Check if the answer is correct
    const checkAnswer = () => {
        setAttempts((prev) => prev + 1)

        if (userAnswer.toUpperCase() === currentWord.word) {
            setGameState("correct")
            setScore((prev) => prev + 10)
            setWordsCompleted((prev) => prev + 1)

            // Auto-advance to next word after 2 seconds
            setTimeout(() => {
                initializeGame()
            }, 2000)
        } else {
            setGameState("incorrect")

            // Reset to playing state after 1 second
            setTimeout(() => {
                setGameState("playing")
                setUserAnswer("")
            }, 1000)
        }
    }

    // Add letter to answer
    const addLetter = (letter: string, index: number) => {
        if (gameState !== "playing") return

        setUserAnswer((prev) => prev + letter)
        // Remove the letter from scrambled letters temporarily
        const newScrambled = [...scrambledLetters]
        newScrambled[index] = ""
        setScrambledLetters(newScrambled)
    }

    // Remove last letter from answer
    const removeLetter = () => {
        if (userAnswer.length === 0 || gameState !== "playing") return

        const lastLetter = userAnswer[userAnswer.length - 1]
        setUserAnswer((prev) => prev.slice(0, -1))

        // Add the letter back to scrambled letters
        const emptyIndex = scrambledLetters.findIndex((letter) => letter === "")
        if (emptyIndex !== -1) {
            const newScrambled = [...scrambledLetters]
            newScrambled[emptyIndex] = lastLetter
            setScrambledLetters(newScrambled)
        }
    }

    // Reset current word
    const resetWord = () => {
        setScrambledLetters(scrambleWord(currentWord.word))
        setUserAnswer("")
        setShowHint(false)
        setGameState("playing")
    }

    // Initialize game on component mount
    useEffect(() => {
        initializeGame()
    }, [])

    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
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
                                <h1 className="text-2xl font-bold">Shabd Khoj</h1>
                                <p className="text-blue-100">Word Scramble Challenge</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Trophy className="w-4 h-4" />
                                <span>{score} XP</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                <span>{wordsCompleted} Words</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Area */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg border border-border">
                    {/* Game Status */}
                    {gameState === "correct" && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-800">Excellent! You got it right!</p>
                                <p className="text-sm text-green-600">+10 XP earned • Loading next word...</p>
                            </div>
                        </div>
                    )}

                    {gameState === "incorrect" && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                            <XCircle className="w-6 h-6 text-red-600" />
                            <div>
                                <p className="font-semibold text-red-800">Not quite right. Try again!</p>
                                <p className="text-sm text-red-600">Check your spelling and try once more.</p>
                            </div>
                        </div>
                    )}

                    {/* Word Display */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-card-foreground mb-2">Unscramble this word:</h2>
                        <p className="text-muted-foreground">Drag letters or click to build your answer</p>
                    </div>

                    {/* Scrambled Letters */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-card-foreground mb-4 text-center">Available Letters</h3>
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {scrambledLetters.map((letter, index) => (
                                <button
                                    key={index}
                                    onClick={() => letter && addLetter(letter, index)}
                                    disabled={!letter || gameState !== "playing"}
                                    className={`w-12 h-12 rounded-xl font-bold text-lg transition-all duration-200 ${letter
                                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:scale-105 active:scale-95 cursor-pointer"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* User Answer */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-card-foreground mb-4 text-center">Your Answer</h3>
                        <div className="flex justify-center mb-4">
                            <div className="min-h-[60px] min-w-[200px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-4">
                                <span className="text-2xl font-bold text-gray-800 tracking-wider">
                                    {userAnswer || "Start building your word..."}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={removeLetter}
                                disabled={userAnswer.length === 0 || gameState !== "playing"}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Remove Letter
                            </button>
                            <button
                                onClick={checkAnswer}
                                disabled={userAnswer.length === 0 || gameState !== "playing"}
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                            >
                                Check Answer
                            </button>
                        </div>
                    </div>

                    {/* Hint Section */}
                    <div className="mb-8 text-center">
                        {!showHint ? (
                            <button
                                onClick={() => setShowHint(true)}
                                className="flex items-center gap-2 mx-auto px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                            >
                                <Lightbulb className="w-4 h-4" />
                                Show Hint
                            </button>
                        ) : (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <div className="flex items-center gap-2 justify-center mb-2">
                                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                                    <span className="font-semibold text-yellow-800">Hint:</span>
                                </div>
                                <p className="text-yellow-700">{currentWord.hint}</p>
                            </div>
                        )}
                    </div>

                    {/* Game Controls */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={resetWord}
                            className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-colors font-semibold"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Scramble Again
                        </button>
                        <button
                            onClick={initializeGame}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                        >
                            <Star className="w-4 h-4" />
                            New Word
                        </button>
                    </div>

                    {/* Game Stats */}
                    <div className="mt-8 pt-6 border-t border-border">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-primary">{score}</p>
                                <p className="text-sm text-muted-foreground">Total XP</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-secondary">{wordsCompleted}</p>
                                <p className="text-sm text-muted-foreground">Words Solved</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-chart-3">{attempts}</p>
                                <p className="text-sm text-muted-foreground">Total Attempts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
