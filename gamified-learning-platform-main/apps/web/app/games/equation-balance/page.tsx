"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Scale, Trophy, Lightbulb } from "lucide-react"
import Link from "next/link"

interface Equation {
    id: string
    reactants: Array<{ formula: string; coefficient: number }>
    products: Array<{ formula: string; coefficient: number }>
    description: string
    difficulty: "easy" | "medium" | "hard"
}

interface AtomCount {
    [element: string]: number
}

export default function EquationBalanceGame() {
    const [currentEquation, setCurrentEquation] = useState<Equation | null>(null)
    const [userCoefficients, setUserCoefficients] = useState<number[]>([])
    const [score, setScore] = useState(0)
    const [level, setLevel] = useState(1)
    const [attempts, setAttempts] = useState(0)
    const [gameState, setGameState] = useState<"playing" | "correct" | "incorrect">("playing")
    const [showHint, setShowHint] = useState(false)
    const [atomCounts, setAtomCounts] = useState<{ reactants: AtomCount; products: AtomCount }>({
        reactants: {},
        products: {},
    })

    const equations: Equation[] = [
        {
            id: "1",
            reactants: [
                { formula: "H₂", coefficient: 2 },
                { formula: "O₂", coefficient: 1 },
            ],
            products: [{ formula: "H₂O", coefficient: 2 }],
            description: "Formation of water from hydrogen and oxygen",
            difficulty: "easy",
        },
        {
            id: "2",
            reactants: [
                { formula: "CH₄", coefficient: 1 },
                { formula: "O₂", coefficient: 2 },
            ],
            products: [
                { formula: "CO₂", coefficient: 1 },
                { formula: "H₂O", coefficient: 2 },
            ],
            description: "Combustion of methane",
            difficulty: "medium",
        },
        {
            id: "3",
            reactants: [
                { formula: "N₂", coefficient: 1 },
                { formula: "H₂", coefficient: 3 },
            ],
            products: [{ formula: "NH₃", coefficient: 2 }],
            description: "Haber process for ammonia synthesis",
            difficulty: "medium",
        },
        {
            id: "4",
            reactants: [
                { formula: "Ca(OH)₂", coefficient: 1 },
                { formula: "HCl", coefficient: 2 },
            ],
            products: [
                { formula: "CaCl₂", coefficient: 1 },
                { formula: "H₂O", coefficient: 2 },
            ],
            description: "Neutralization reaction",
            difficulty: "hard",
        },
        {
            id: "5",
            reactants: [
                { formula: "Fe₂O₃", coefficient: 1 },
                { formula: "CO", coefficient: 3 },
            ],
            products: [
                { formula: "Fe", coefficient: 2 },
                { formula: "CO₂", coefficient: 3 },
            ],
            description: "Iron ore reduction in blast furnace",
            difficulty: "hard",
        },
    ]

    useEffect(() => {
        startNewEquation()
    }, [])

    useEffect(() => {
        if (currentEquation && userCoefficients.length > 0) {
            calculateAtomCounts()
        }
    }, [userCoefficients, currentEquation])

    const startNewEquation = () => {
        const availableEquations = equations.filter(
            (eq) =>
                (level <= 2 && eq.difficulty === "easy") ||
                (level <= 4 && eq.difficulty === "medium") ||
                (level > 4 && eq.difficulty === "hard"),
        )

        const randomEquation = availableEquations[Math.floor(Math.random() * availableEquations.length)]
        setCurrentEquation(randomEquation)

        // Initialize coefficients with 1s
        const totalCompounds = randomEquation.reactants.length + randomEquation.products.length
        setUserCoefficients(new Array(totalCompounds).fill(1))

        setGameState("playing")
        setAttempts(0)
        setShowHint(false)
    }

    const parseFormula = (formula: string): AtomCount => {
        const atoms: AtomCount = {}

        // Simple parser for common chemical formulas
        const matches = formula.match(/([A-Z][a-z]?)(\d*)/g) || []

        matches.forEach((match) => {
            const element = match.match(/[A-Z][a-z]?/)?.[0] || ""
            const count = Number.parseInt(match.match(/\d+$/)?.[0] || "1")
            atoms[element] = (atoms[element] || 0) + count
        })

        // Handle parentheses (simplified)
        const parenMatches = formula.match(/$$([^)]+)$$(\d+)/g) || []
        parenMatches.forEach((match) => {
            const inside = match.match(/$$([^)]+)$$/)?.[1] || ""
            const multiplier = Number.parseInt(match.match(/\)(\d+)/)?.[1] || "1")

            const insideAtoms = parseFormula(inside)
            Object.entries(insideAtoms).forEach(([element, count]) => {
                atoms[element] = (atoms[element] || 0) + count * multiplier
            })
        })

        return atoms
    }

    const calculateAtomCounts = () => {
        if (!currentEquation) return

        const reactantCounts: AtomCount = {}
        const productCounts: AtomCount = {}

        // Calculate reactant atoms
        currentEquation.reactants.forEach((reactant, index) => {
            const coefficient = userCoefficients[index] || 1
            const atoms = parseFormula(reactant.formula)

            Object.entries(atoms).forEach(([element, count]) => {
                reactantCounts[element] = (reactantCounts[element] || 0) + count * coefficient
            })
        })

        // Calculate product atoms
        currentEquation.products.forEach((product, index) => {
            const coefficient = userCoefficients[currentEquation.reactants.length + index] || 1
            const atoms = parseFormula(product.formula)

            Object.entries(atoms).forEach(([element, count]) => {
                productCounts[element] = (productCounts[element] || 0) + count * coefficient
            })
        })

        setAtomCounts({ reactants: reactantCounts, products: productCounts })
    }

    const checkBalance = () => {
        setAttempts((prev) => prev + 1)

        const { reactants, products } = atomCounts

        // Check if all elements are balanced
        const allElements = new Set([...Object.keys(reactants), ...Object.keys(products)])
        const isBalanced = Array.from(allElements).every(
            (element) => (reactants[element] || 0) === (products[element] || 0),
        )

        if (isBalanced) {
            setGameState("correct")
            const points = Math.max(100 - attempts * 15, 25)
            setScore((prev) => prev + points)

            setTimeout(() => {
                setLevel((prev) => prev + 1)
                startNewEquation()
            }, 2500)
        } else {
            setGameState("incorrect")
            setTimeout(() => setGameState("playing"), 1500)
        }
    }

    const updateCoefficient = (index: number, value: string) => {
        const numValue = Math.max(1, Number.parseInt(value) || 1)
        const newCoefficients = [...userCoefficients]
        newCoefficients[index] = numValue
        setUserCoefficients(newCoefficients)
    }

    const isBalanced = () => {
        const { reactants, products } = atomCounts
        const allElements = new Set([...Object.keys(reactants), ...Object.keys(products)])
        return Array.from(allElements).every((element) => (reactants[element] || 0) === (products[element] || 0))
    }

    if (!currentEquation) return <div>Loading...</div>

    return (
        <main className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/games" className="flex items-center gap-2 text-violet-600 hover:text-violet-700">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Games</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold">{score} XP</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Level: {level}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Attempts: {attempts}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Game Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl mb-4">
                        <Scale className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Equation Balance</h1>
                    <p className="text-lg text-gray-600">Balance chemical equations by finding the right coefficients!</p>
                </div>

                {/* Current Equation */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Level {level}</h2>
                        <div className="flex items-center gap-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${currentEquation.difficulty === "easy"
                                        ? "bg-green-100 text-green-700"
                                        : currentEquation.difficulty === "medium"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {currentEquation.difficulty.charAt(0).toUpperCase() + currentEquation.difficulty.slice(1)}
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6">{currentEquation.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                        >
                            <Lightbulb className="w-4 h-4" />
                            {showHint ? "Hide Hint" : "Show Hint"}
                        </button>

                        <button
                            onClick={startNewEquation}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            New Equation
                        </button>
                    </div>

                    {showHint && (
                        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                                <strong>Hint:</strong> Start by counting atoms of each element on both sides. Adjust coefficients until
                                the number of each type of atom is equal on both sides.
                            </p>
                        </div>
                    )}
                </div>

                {/* Equation Display */}
                <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-2xl font-mono">
                        {/* Reactants */}
                        {currentEquation.reactants.map((reactant, index) => (
                            <div key={`reactant-${index}`} className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={userCoefficients[index] || 1}
                                    onChange={(e) => updateCoefficient(index, e.target.value)}
                                    className="w-16 h-12 text-center border-2 border-violet-200 rounded-lg focus:border-violet-500 focus:outline-none"
                                />
                                <span className="text-gray-800">{reactant.formula}</span>
                                {index < currentEquation.reactants.length - 1 && <span className="text-gray-500 mx-2">+</span>}
                            </div>
                        ))}

                        {/* Arrow */}
                        <div className="flex items-center mx-4">
                            <div className="w-12 h-0.5 bg-gray-400"></div>
                            <div className="w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                        </div>

                        {/* Products */}
                        {currentEquation.products.map((product, index) => (
                            <div key={`product-${index}`} className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={userCoefficients[currentEquation.reactants.length + index] || 1}
                                    onChange={(e) => updateCoefficient(currentEquation.reactants.length + index, e.target.value)}
                                    className="w-16 h-12 text-center border-2 border-violet-200 rounded-lg focus:border-violet-500 focus:outline-none"
                                />
                                <span className="text-gray-800">{product.formula}</span>
                                {index < currentEquation.products.length - 1 && <span className="text-gray-500 mx-2">+</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Atom Counter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Reactants Count */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Reactants (Left Side)</h3>
                        <div className="space-y-2">
                            {Object.entries(atomCounts.reactants).map(([element, count]) => (
                                <div
                                    key={`reactant-${element}`}
                                    className="flex justify-between items-center p-3 bg-blue-50 rounded-lg"
                                >
                                    <span className="font-semibold text-blue-700">{element}:</span>
                                    <span className="font-bold text-blue-800">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Products Count */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Products (Right Side)</h3>
                        <div className="space-y-2">
                            {Object.entries(atomCounts.products).map(([element, count]) => (
                                <div
                                    key={`product-${element}`}
                                    className="flex justify-between items-center p-3 bg-green-50 rounded-lg"
                                >
                                    <span className="font-semibold text-green-700">{element}:</span>
                                    <span className="font-bold text-green-800">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Balance Status */}
                <div className="text-center mb-8">
                    <div
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold ${isBalanced() ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                    >
                        {isBalanced() ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Equation is Balanced!
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5" />
                                Equation is Not Balanced
                            </>
                        )}
                    </div>
                </div>

                {/* Check Button */}
                {gameState === "playing" && (
                    <div className="text-center">
                        <button
                            onClick={checkBalance}
                            disabled={!isBalanced()}
                            className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Check Balance
                        </button>
                    </div>
                )}

                {/* Game Result */}
                {gameState !== "playing" && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
                            {gameState === "correct" ? (
                                <>
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Perfect Balance!</h3>
                                    <p className="text-gray-600 mb-4">You correctly balanced the chemical equation!</p>
                                    <p className="text-lg font-semibold text-green-600 mb-6">
                                        +{Math.max(100 - attempts * 15, 25)} XP earned!
                                    </p>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Not Balanced Yet</h3>
                                    <p className="text-gray-600 mb-6">
                                        The atoms don't match on both sides. Check your coefficients and try again!
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Chemistry Info */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Chemistry Concepts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-semibold text-blue-700 mb-2">Law of Conservation of Mass</h4>
                            <p className="text-gray-600">
                                Matter cannot be created or destroyed in chemical reactions - atoms must be balanced on both sides.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-700 mb-2">Coefficients</h4>
                            <p className="text-gray-600">
                                Numbers in front of formulas that tell us how many molecules of each compound participate in the
                                reaction.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
