"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Lightbulb, Trophy, Star } from "lucide-react"
import Link from "next/link"

interface ProcessStep {
    id: string
    text: string
    order: number
}

interface BiologyProcess {
    id: string
    name: string
    description: string
    steps: ProcessStep[]
}

export default function ProcessPioneerGame() {
    const [currentProcess, setCurrentProcess] = useState<BiologyProcess | null>(null)
    const [shuffledSteps, setShuffledSteps] = useState<ProcessStep[]>([])
    const [orderedSteps, setOrderedSteps] = useState<(ProcessStep | null)[]>([])
    const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing")
    const [score, setScore] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const [showHint, setShowHint] = useState(false)
    const [draggedStep, setDraggedStep] = useState<ProcessStep | null>(null)

    const processes: BiologyProcess[] = [
        {
            id: "photosynthesis",
            name: "Photosynthesis",
            description: "The process by which plants make their own food using sunlight",
            steps: [
                { id: "1", text: "Sunlight hits the chlorophyll in leaves", order: 1 },
                { id: "2", text: "Chlorophyll absorbs light energy", order: 2 },
                { id: "3", text: "Water is absorbed through roots", order: 3 },
                { id: "4", text: "Carbon dioxide enters through stomata", order: 4 },
                { id: "5", text: "Light energy converts CO₂ and H₂O to glucose", order: 5 },
                { id: "6", text: "Oxygen is released as a byproduct", order: 6 },
            ],
        },
        {
            id: "digestion",
            name: "Human Digestion",
            description: "How our body breaks down food into nutrients",
            steps: [
                { id: "1", text: "Food enters the mouth and is chewed", order: 1 },
                { id: "2", text: "Saliva begins breaking down starches", order: 2 },
                { id: "3", text: "Food travels down the esophagus", order: 3 },
                { id: "4", text: "Stomach acid breaks down proteins", order: 4 },
                { id: "5", text: "Small intestine absorbs nutrients", order: 5 },
                { id: "6", text: "Large intestine absorbs water", order: 6 },
            ],
        },
        {
            id: "water-cycle",
            name: "Water Cycle",
            description: "How water moves through Earth's atmosphere and surface",
            steps: [
                { id: "1", text: "Sun heats water in oceans and lakes", order: 1 },
                { id: "2", text: "Water evaporates into water vapor", order: 2 },
                { id: "3", text: "Water vapor rises and cools in atmosphere", order: 3 },
                { id: "4", text: "Water vapor condenses into clouds", order: 4 },
                { id: "5", text: "Clouds release water as precipitation", order: 5 },
                { id: "6", text: "Water flows back to oceans and lakes", order: 6 },
            ],
        },
    ]

    useEffect(() => {
        startNewGame()
    }, [])

    const startNewGame = () => {
        const randomProcess = processes[Math.floor(Math.random() * processes.length)]
        setCurrentProcess(randomProcess)

        // Shuffle the steps
        const shuffled = [...randomProcess.steps].sort(() => Math.random() - 0.5)
        setShuffledSteps(shuffled)

        // Initialize ordered steps array with nulls
        setOrderedSteps(new Array(randomProcess.steps.length).fill(null))

        setGameState("playing")
        setAttempts(0)
        setShowHint(false)
        setDraggedStep(null)
    }

    const handleDragStart = (step: ProcessStep) => {
        setDraggedStep(step)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        if (draggedStep) {
            const newOrderedSteps = [...orderedSteps]

            // Remove step from its current position if it exists
            const existingIndex = newOrderedSteps.findIndex((step) => step?.id === draggedStep.id)
            if (existingIndex !== -1) {
                newOrderedSteps[existingIndex] = null
            }

            // Place step in new position
            newOrderedSteps[index] = draggedStep
            setOrderedSteps(newOrderedSteps)

            // Remove from shuffled steps
            setShuffledSteps((prev) => prev.filter((step) => step.id !== draggedStep.id))

            setDraggedStep(null)
        }
    }

    const handleStepClick = (step: ProcessStep) => {
        // Find first empty slot
        const emptyIndex = orderedSteps.findIndex((slot) => slot === null)
        if (emptyIndex !== -1) {
            const newOrderedSteps = [...orderedSteps]
            newOrderedSteps[emptyIndex] = step
            setOrderedSteps(newOrderedSteps)
            setShuffledSteps((prev) => prev.filter((s) => s.id !== step.id))
        }
    }

    const handleSlotClick = (index: number) => {
        const step = orderedSteps[index]
        if (step) {
            // Move step back to shuffled area
            setShuffledSteps((prev) => [...prev, step])
            const newOrderedSteps = [...orderedSteps]
            newOrderedSteps[index] = null
            setOrderedSteps(newOrderedSteps)
        }
    }

    const checkAnswer = () => {
        if (!currentProcess) return

        setAttempts((prev) => prev + 1)

        const isCorrect = orderedSteps.every((step, index) => step && step.order === index + 1)

        if (isCorrect) {
            setGameState("won")
            const points = Math.max(100 - attempts * 10, 50)
            setScore((prev) => prev + points)
        } else {
            setGameState("lost")
        }
    }

    const resetGame = () => {
        if (currentProcess) {
            setShuffledSteps([...currentProcess.steps].sort(() => Math.random() - 0.5))
            setOrderedSteps(new Array(currentProcess.steps.length).fill(null))
            setGameState("playing")
            setShowHint(false)
        }
    }

    const isComplete = orderedSteps.every((step) => step !== null)

    if (!currentProcess) return <div>Loading...</div>

    return (
        <main className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/games" className="flex items-center gap-2 text-teal-600 hover:text-teal-700">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Games</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold">{score} XP</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Attempts: {attempts}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Game Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl mb-4">
                        <Star className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Process Pioneer</h1>
                    <p className="text-lg text-gray-600">Arrange the steps in the correct order!</p>
                </div>

                {/* Current Process Info */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentProcess.name}</h2>
                    <p className="text-gray-600 mb-4">{currentProcess.description}</p>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                        >
                            <Lightbulb className="w-4 h-4" />
                            {showHint ? "Hide Hint" : "Show Hint"}
                        </button>

                        <button
                            onClick={resetGame}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                    </div>

                    {showHint && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                                <strong>Hint:</strong> Think about the natural sequence of events. What needs to happen first before the
                                next step can occur?
                            </p>
                        </div>
                    )}
                </div>

                {/* Game Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Shuffled Steps */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Available Steps</h3>
                        <div className="space-y-3">
                            {shuffledSteps.map((step) => (
                                <div
                                    key={step.id}
                                    draggable
                                    onDragStart={() => handleDragStart(step)}
                                    onClick={() => handleStepClick(step)}
                                    className="p-4 bg-gradient-to-r from-teal-50 to-green-50 border-2 border-teal-200 rounded-xl cursor-move hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    <p className="text-gray-800 font-medium">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ordered Steps */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Correct Order</h3>
                        <div className="space-y-3">
                            {orderedSteps.map((step, index) => (
                                <div
                                    key={index}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onClick={() => handleSlotClick(index)}
                                    className={`min-h-[80px] p-4 border-2 border-dashed rounded-xl transition-all duration-200 ${step
                                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 cursor-pointer hover:shadow-md"
                                            : "bg-gray-50 border-gray-300 hover:border-teal-300"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        {step ? (
                                            <p className="text-gray-800 font-medium">{step.text}</p>
                                        ) : (
                                            <p className="text-gray-400 italic">Drop step here or click a step above</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Check Answer Button */}
                {isComplete && gameState === "playing" && (
                    <div className="text-center mt-8">
                        <button
                            onClick={checkAnswer}
                            className="px-8 py-4 bg-gradient-to-r from-teal-500 to-green-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            Check My Answer
                        </button>
                    </div>
                )}

                {/* Game Result */}
                {gameState !== "playing" && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
                            {gameState === "won" ? (
                                <>
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Excellent Work!</h3>
                                    <p className="text-gray-600 mb-4">You correctly arranged the {currentProcess.name} process!</p>
                                    <p className="text-lg font-semibold text-green-600 mb-6">
                                        +{Math.max(100 - attempts * 10, 50)} XP earned!
                                    </p>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Not Quite Right</h3>
                                    <p className="text-gray-600 mb-6">
                                        The sequence isn't correct. Try again and think about the natural order of events!
                                    </p>
                                </>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={startNewGame}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                                >
                                    New Process
                                </button>
                                <button
                                    onClick={resetGame}
                                    className="flex-1 px-6 py-3 border-2 border-teal-500 text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-all"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
