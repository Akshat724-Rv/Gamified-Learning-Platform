"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, ArrowUp, ArrowDown, ArrowLeftIcon, ArrowRight, Trophy, Star, X, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Position {
    x: number
    y: number
}

interface Station {
    id: string
    name: string
    x: number
    y: number
    width: number
    height: number
    color: string
    icon: string
    fact: string
    question?: {
        text: string
        options: string[]
        correct: number
    }
    visited: boolean
}

interface Player {
    x: number
    y: number
}

export default function VirtualLabGame() {
    const [player, setPlayer] = useState<Player>({ x: 50, y: 50 })
    const [stations, setStations] = useState<Station[]>([])
    const [activeStation, setActiveStation] = useState<Station | null>(null)
    const [score, setScore] = useState(0)
    const [visitedCount, setVisitedCount] = useState(0)
    const [gameComplete, setGameComplete] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)

    const labWidth = 800
    const labHeight = 600
    const playerSize = 20
    const moveSpeed = 10

    const initialStations: Station[] = [
        {
            id: "microscope",
            name: "Microscope Station",
            x: 150,
            y: 100,
            width: 80,
            height: 60,
            color: "#3B82F6",
            icon: "🔬",
            fact: "A microscope can magnify objects up to 2000 times! The first microscope was invented in the 1590s.",
            question: {
                text: "What is the maximum magnification of a typical light microscope?",
                options: ["100x", "1000x", "2000x", "5000x"],
                correct: 2,
            },
            visited: false,
        },
        {
            id: "periodic-table",
            name: "Periodic Table",
            x: 350,
            y: 80,
            width: 100,
            height: 80,
            color: "#10B981",
            icon: "⚛️",
            fact: "The periodic table has 118 known elements. Dmitri Mendeleev created the first version in 1869!",
            question: {
                text: "How many elements are currently in the periodic table?",
                options: ["108", "118", "128", "138"],
                correct: 1,
            },
            visited: false,
        },
        {
            id: "dna-model",
            name: "DNA Model",
            x: 600,
            y: 120,
            width: 70,
            height: 90,
            color: "#8B5CF6",
            icon: "🧬",
            fact: "DNA contains the instructions for all living things. If you unraveled all the DNA in your body, it would stretch 10 billion miles!",
            question: {
                text: "What does DNA stand for?",
                options: ["Deoxyribonucleic Acid", "Dynamic Nuclear Acid", "Dual Nucleic Acid", "Dense Nuclear Acid"],
                correct: 0,
            },
            visited: false,
        },
        {
            id: "telescope",
            name: "Telescope",
            x: 100,
            y: 300,
            width: 90,
            height: 50,
            color: "#F59E0B",
            icon: "🔭",
            fact: "The Hubble Space Telescope has been taking pictures of space for over 30 years and travels at 17,500 mph!",
            question: {
                text: "How fast does the Hubble Space Telescope travel?",
                options: ["5,000 mph", "10,000 mph", "17,500 mph", "25,000 mph"],
                correct: 2,
            },
            visited: false,
        },
        {
            id: "chemistry-set",
            name: "Chemistry Set",
            x: 400,
            y: 350,
            width: 100,
            height: 70,
            color: "#EF4444",
            icon: "🧪",
            fact: "Water is the only substance that exists naturally in all three states: solid (ice), liquid (water), and gas (steam)!",
            question: {
                text: "At what temperature does water boil at sea level?",
                options: ["90°C", "100°C", "110°C", "120°C"],
                correct: 1,
            },
            visited: false,
        },
        {
            id: "skeleton",
            name: "Human Skeleton",
            x: 650,
            y: 400,
            width: 60,
            height: 120,
            color: "#6B7280",
            icon: "🦴",
            fact: "The human body has 206 bones when fully grown, but babies are born with about 270 bones!",
            question: {
                text: "How many bones does an adult human have?",
                options: ["196", "206", "216", "226"],
                correct: 1,
            },
            visited: false,
        },
        {
            id: "plant-lab",
            name: "Plant Laboratory",
            x: 200,
            y: 480,
            width: 120,
            height: 80,
            color: "#059669",
            icon: "🌱",
            fact: "Plants produce oxygen through photosynthesis. One large tree can provide enough oxygen for two people for a whole day!",
            question: {
                text: "What gas do plants release during photosynthesis?",
                options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
                correct: 2,
            },
            visited: false,
        },
        {
            id: "computer",
            name: "Research Computer",
            x: 500,
            y: 500,
            width: 80,
            height: 60,
            color: "#7C3AED",
            icon: "💻",
            fact: "The first computer bug was an actual bug! In 1947, Grace Hopper found a moth stuck in a computer relay.",
            question: {
                text: "Who found the first computer 'bug'?",
                options: ["Ada Lovelace", "Grace Hopper", "Alan Turing", "John von Neumann"],
                correct: 1,
            },
            visited: false,
        },
    ]

    useEffect(() => {
        setStations(initialStations)
    }, [])

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (activeStation) return // Don't move when modal is open

            const { key } = event
            setPlayer((prev) => {
                let newX = prev.x
                let newY = prev.y

                switch (key.toLowerCase()) {
                    case "w":
                    case "arrowup":
                        newY = Math.max(playerSize / 2, prev.y - moveSpeed)
                        break
                    case "s":
                    case "arrowdown":
                        newY = Math.min(labHeight - playerSize / 2, prev.y + moveSpeed)
                        break
                    case "a":
                    case "arrowleft":
                        newX = Math.max(playerSize / 2, prev.x - moveSpeed)
                        break
                    case "d":
                    case "arrowright":
                        newX = Math.min(labWidth - playerSize / 2, prev.x + moveSpeed)
                        break
                    default:
                        return prev
                }

                return { x: newX, y: newY }
            })
        },
        [activeStation],
    )

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [handleKeyPress])

    useEffect(() => {
        // Check for station collisions
        stations.forEach((station) => {
            const playerCenterX = player.x
            const playerCenterY = player.y

            const stationCenterX = station.x + station.width / 2
            const stationCenterY = station.y + station.height / 2

            const distance = Math.sqrt(
                Math.pow(playerCenterX - stationCenterX, 2) + Math.pow(playerCenterY - stationCenterY, 2),
            )

            if (distance < 50 && !station.visited) {
                setActiveStation(station)
            }
        })
    }, [player, stations])

    const handleStationComplete = (correct: boolean) => {
        if (!activeStation) return

        setShowResult(true)

        setTimeout(() => {
            if (correct) {
                setScore((prev) => prev + 20)
            }

            // Mark station as visited
            setStations((prev) => prev.map((s) => (s.id === activeStation.id ? { ...s, visited: true } : s)))

            setVisitedCount((prev) => {
                const newCount = prev + 1
                if (newCount >= stations.length) {
                    setGameComplete(true)
                }
                return newCount
            })

            setActiveStation(null)
            setSelectedAnswer(null)
            setShowResult(false)
        }, 2000)
    }

    const movePlayer = (direction: "up" | "down" | "left" | "right") => {
        if (activeStation) return

        setPlayer((prev) => {
            let newX = prev.x
            let newY = prev.y

            switch (direction) {
                case "up":
                    newY = Math.max(playerSize / 2, prev.y - moveSpeed)
                    break
                case "down":
                    newY = Math.min(labHeight - playerSize / 2, prev.y + moveSpeed)
                    break
                case "left":
                    newX = Math.max(playerSize / 2, prev.x - moveSpeed)
                    break
                case "right":
                    newX = Math.min(labWidth - playerSize / 2, prev.x + moveSpeed)
                    break
            }

            return { x: newX, y: newY }
        })
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/games" className="flex items-center gap-2 text-pink-600 hover:text-pink-700">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Games</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold">{score} XP</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                                Stations: {visitedCount}/{stations.length}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Game Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl mb-4">
                        <Star className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Virtual Lab Explorer</h1>
                    <p className="text-lg text-gray-600">Explore the science lab and discover amazing facts!</p>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">How to Play</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-semibold text-pink-700 mb-2">Desktop Controls</h4>
                            <p className="text-gray-600">Use WASD keys or arrow keys to move your character around the lab.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-pink-700 mb-2">Mobile Controls</h4>
                            <p className="text-gray-600">Use the arrow buttons below the lab to move your character.</p>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4">
                        Walk close to any station to learn fascinating science facts and answer quiz questions!
                    </p>
                </div>

                {/* Game Lab */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                    <div className="relative mx-auto" style={{ width: labWidth, height: labHeight }}>
                        {/* Lab Background */}
                        <div
                            className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300 overflow-hidden"
                            style={{ width: labWidth, height: labHeight }}
                        >
                            {/* Grid Pattern */}
                            <div className="absolute inset-0 opacity-20">
                                {Array.from({ length: Math.ceil(labWidth / 40) }).map((_, i) => (
                                    <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-gray-400" style={{ left: i * 40 }} />
                                ))}
                                {Array.from({ length: Math.ceil(labHeight / 40) }).map((_, i) => (
                                    <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-gray-400" style={{ top: i * 40 }} />
                                ))}
                            </div>

                            {/* Stations */}
                            {stations.map((station) => (
                                <div
                                    key={station.id}
                                    className={`absolute rounded-lg border-2 flex flex-col items-center justify-center text-white font-bold text-xs transition-all duration-200 ${station.visited ? "opacity-50 border-gray-400" : "border-white shadow-lg hover:scale-105"
                                        }`}
                                    style={{
                                        left: station.x,
                                        top: station.y,
                                        width: station.width,
                                        height: station.height,
                                        backgroundColor: station.visited ? "#9CA3AF" : station.color,
                                    }}
                                >
                                    <div className="text-2xl mb-1">{station.icon}</div>
                                    <div className="text-center px-1">{station.name}</div>
                                    {station.visited && (
                                        <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-green-500 bg-white rounded-full" />
                                    )}
                                </div>
                            ))}

                            {/* Player */}
                            <div
                                className="absolute w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full border-2 border-white shadow-lg transition-all duration-100"
                                style={{
                                    left: player.x - playerSize / 2,
                                    top: player.y - playerSize / 2,
                                    width: playerSize,
                                    height: playerSize,
                                }}
                            >
                                <div className="absolute inset-1 bg-white rounded-full opacity-30"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className="flex justify-center mb-8 md:hidden">
                    <div className="grid grid-cols-3 gap-2">
                        <div></div>
                        <button
                            onClick={() => movePlayer("up")}
                            className="w-12 h-12 bg-pink-500 text-white rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                        >
                            <ArrowUp className="w-6 h-6" />
                        </button>
                        <div></div>

                        <button
                            onClick={() => movePlayer("left")}
                            className="w-12 h-12 bg-pink-500 text-white rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <div></div>
                        <button
                            onClick={() => movePlayer("right")}
                            className="w-12 h-12 bg-pink-500 text-white rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </button>

                        <div></div>
                        <button
                            onClick={() => movePlayer("down")}
                            className="w-12 h-12 bg-pink-500 text-white rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                        >
                            <ArrowDown className="w-6 h-6" />
                        </button>
                        <div></div>
                    </div>
                </div>

                {/* Progress */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div
                            className="bg-gradient-to-r from-pink-500 to-rose-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${(visitedCount / stations.length) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-gray-600">
                        Visited {visitedCount} of {stations.length} stations
                    </p>
                </div>
            </div>

            {/* Station Modal */}
            {activeStation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">{activeStation.name}</h3>
                            <button onClick={() => setActiveStation(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">{activeStation.icon}</div>
                            <p className="text-gray-700 leading-relaxed">{activeStation.fact}</p>
                        </div>

                        {activeStation.question && !showResult && (
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4">{activeStation.question.text}</h4>
                                <div className="space-y-2 mb-6">
                                    {activeStation.question.options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedAnswer(index)}
                                            className={`w-full p-3 text-left rounded-lg border-2 transition-all ${selectedAnswer === index
                                                    ? "border-pink-500 bg-pink-50"
                                                    : "border-gray-200 hover:border-pink-300"
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleStationComplete(selectedAnswer === activeStation.question!.correct)}
                                    disabled={selectedAnswer === null}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit Answer
                                </button>
                            </div>
                        )}

                        {showResult && (
                            <div className="text-center">
                                {selectedAnswer === activeStation.question?.correct ? (
                                    <>
                                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <h4 className="text-xl font-bold text-green-600 mb-2">Correct!</h4>
                                        <p className="text-gray-600">+20 XP earned!</p>
                                    </>
                                ) : (
                                    <>
                                        <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                        <h4 className="text-xl font-bold text-red-600 mb-2">Not quite right!</h4>
                                        <p className="text-gray-600">Keep exploring to learn more!</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Game Complete Modal */}
            {gameComplete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
                        <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Lab Exploration Complete!</h2>
                        <p className="text-xl text-gray-600 mb-2">Final Score: {score} XP</p>
                        <p className="text-lg text-gray-500 mb-8">You've discovered all the amazing science facts in the lab!</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => {
                                    setStations(initialStations)
                                    setPlayer({ x: 50, y: 50 })
                                    setScore(0)
                                    setVisitedCount(0)
                                    setGameComplete(false)
                                }}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                Explore Again
                            </button>
                            <Link
                                href="/games"
                                className="flex-1 px-6 py-3 border-2 border-pink-500 text-pink-600 font-bold rounded-xl hover:bg-pink-50 transition-all duration-300 hover:scale-105"
                            >
                                Back to Games
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
