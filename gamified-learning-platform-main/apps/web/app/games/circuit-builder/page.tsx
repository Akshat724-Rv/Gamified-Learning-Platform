"use client"

import { useState, useEffect } from "react"
import { Zap, ArrowLeft, Trophy, Star, RotateCcw, CheckCircle, Lightbulb } from "lucide-react"
import Link from "next/link"

type ComponentType = "battery" | "bulb" | "switch" | "wire"

interface CircuitComponent {
    id: string
    type: ComponentType
    placed: boolean
    position?: { x: number; y: number }
}

interface CircuitSlot {
    id: string
    type: ComponentType
    filled: boolean
    position: { x: number; y: number }
}

export default function CircuitBuilderPage() {
    const [components, setComponents] = useState<CircuitComponent[]>([
        { id: "battery-1", type: "battery", placed: false },
        { id: "bulb-1", type: "bulb", placed: false },
        { id: "switch-1", type: "switch", placed: false },
        { id: "wire-1", type: "wire", placed: false },
        { id: "wire-2", type: "wire", placed: false },
    ])

    const [circuitSlots] = useState<CircuitSlot[]>([
        { id: "slot-battery", type: "battery", filled: false, position: { x: 50, y: 200 } },
        { id: "slot-wire-1", type: "wire", filled: false, position: { x: 150, y: 200 } },
        { id: "slot-switch", type: "switch", filled: false, position: { x: 250, y: 200 } },
        { id: "slot-wire-2", type: "wire", filled: false, position: { x: 350, y: 200 } },
        { id: "slot-bulb", type: "bulb", filled: false, position: { x: 450, y: 200 } },
    ])

    const [draggedComponent, setDraggedComponent] = useState<string | null>(null)
    const [circuitComplete, setCircuitComplete] = useState(false)
    const [score, setScore] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const [showHint, setShowHint] = useState(false)

    // Check if circuit is complete
    const checkCircuitComplete = () => {
        const allSlotsFilled = circuitSlots.every((slot) =>
            components.some((comp) => comp.placed && comp.type === slot.type),
        )

        if (allSlotsFilled && !circuitComplete) {
            setCircuitComplete(true)
            setScore((prev) => prev + 50)
        }
    }

    // Handle drag start
    const handleDragStart = (componentId: string) => {
        setDraggedComponent(componentId)
    }

    // Handle drop on slot
    const handleDrop = (slotId: string) => {
        if (!draggedComponent) return

        const component = components.find((c) => c.id === draggedComponent)
        const slot = circuitSlots.find((s) => s.id === slotId)

        if (!component || !slot) return

        // Check if component type matches slot type
        if (component.type === slot.type && !component.placed) {
            setComponents((prev) =>
                prev.map((c) => (c.id === draggedComponent ? { ...c, placed: true, position: slot.position } : c)),
            )
            setAttempts((prev) => prev + 1)
        }

        setDraggedComponent(null)
    }

    // Reset game
    const resetGame = () => {
        setComponents((prev) => prev.map((c) => ({ ...c, placed: false, position: undefined })))
        setCircuitComplete(false)
        setAttempts(0)
        setShowHint(false)
    }

    // Component SVG icons
    const ComponentIcon = ({ type, isLit = false }: { type: ComponentType; isLit?: boolean }) => {
        switch (type) {
            case "battery":
                return (
                    <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-sm">
                        <rect x="10" y="15" width="30" height="10" fill="#2563eb" rx="2" />
                        <rect x="40" y="12" width="8" height="16" fill="#1d4ed8" rx="2" />
                        <text x="25" y="25" fill="white" fontSize="8" textAnchor="middle">
                            +
                        </text>
                        <text x="44" y="25" fill="white" fontSize="8" textAnchor="middle">
                            -
                        </text>
                    </svg>
                )
            case "bulb":
                return (
                    <svg width="40" height="60" viewBox="0 0 40 60" className="drop-shadow-sm">
                        <circle cx="20" cy="25" r="15" fill={isLit ? "#fbbf24" : "#e5e7eb"} stroke="#374151" strokeWidth="2" />
                        <rect x="15" y="35" width="10" height="15" fill="#6b7280" rx="2" />
                        <path d="M12 20 L28 20 M12 25 L28 25 M12 30 L28 30" stroke="#374151" strokeWidth="1" opacity="0.5" />
                        {isLit && (
                            <>
                                <circle cx="20" cy="25" r="18" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.3" />
                                <circle cx="20" cy="25" r="22" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.2" />
                            </>
                        )}
                    </svg>
                )
            case "switch":
                return (
                    <svg width="60" height="30" viewBox="0 0 60 30" className="drop-shadow-sm">
                        <rect x="5" y="12" width="50" height="6" fill="#374151" rx="3" />
                        <circle cx="15" cy="15" r="4" fill="#6b7280" />
                        <circle cx="45" cy="15" r="4" fill="#6b7280" />
                        <rect x="25" y="8" width="10" height="14" fill="#ef4444" rx="2" />
                    </svg>
                )
            case "wire":
                return (
                    <svg width="60" height="20" viewBox="0 0 60 20" className="drop-shadow-sm">
                        <path d="M5 10 L55 10" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="5" cy="10" r="3" fill="#6b7280" />
                        <circle cx="55" cy="10" r="3" fill="#6b7280" />
                    </svg>
                )
            default:
                return null
        }
    }

    // Check circuit completion when components change
    useEffect(() => {
        checkCircuitComplete()
    }, [components])

    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
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
                                <h1 className="text-2xl font-bold">Circuit Master</h1>
                                <p className="text-yellow-100">Build the Perfect Circuit</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Trophy className="w-4 h-4" />
                                <span>{score} XP</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                <span>{attempts} Attempts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Area */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Success Message */}
                {circuitComplete && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div className="flex-1">
                            <p className="font-semibold text-green-800">Circuit Complete! The bulb is now glowing!</p>
                            <p className="text-sm text-green-600">+50 XP earned • You've mastered basic circuit building!</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Components Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                            <h2 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                Components
                            </h2>

                            <p className="text-sm text-muted-foreground mb-6">
                                Drag these components to build a complete electrical circuit
                            </p>

                            <div className="space-y-4">
                                {components.map((component) => (
                                    <div
                                        key={component.id}
                                        draggable={!component.placed}
                                        onDragStart={() => handleDragStart(component.id)}
                                        className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-move ${component.placed
                                                ? "border-green-300 bg-green-50 opacity-50 cursor-not-allowed"
                                                : "border-gray-300 bg-white hover:border-primary hover:bg-primary/5"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ComponentIcon type={component.type} />
                                                <div>
                                                    <p className="font-medium text-card-foreground capitalize">{component.type}</p>
                                                    <p className="text-xs text-muted-foreground">{component.placed ? "Placed" : "Available"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Hint Section */}
                            <div className="mt-6 pt-6 border-t border-border">
                                {!showHint ? (
                                    <button
                                        onClick={() => setShowHint(true)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                                    >
                                        <Lightbulb className="w-4 h-4" />
                                        Show Circuit Hint
                                    </button>
                                ) : (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                                            <span className="font-semibold text-yellow-800">Circuit Tip:</span>
                                        </div>
                                        <p className="text-sm text-yellow-700">
                                            A complete circuit needs: Battery (power source) → Wire → Switch (control) → Wire → Bulb (load) →
                                            back to battery
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={resetGame}
                                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-semibold"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset Circuit
                            </button>
                        </div>
                    </div>

                    {/* Circuit Board */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                            <h2 className="text-xl font-semibold text-card-foreground mb-6">Circuit Board</h2>

                            <div className="relative bg-gray-50 rounded-xl p-8 min-h-[400px] border-2 border-dashed border-gray-300">
                                {/* Circuit Path */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                                    <path
                                        d="M 70 220 L 170 220 L 270 220 L 370 220 L 470 220"
                                        stroke="#d1d5db"
                                        strokeWidth="4"
                                        fill="none"
                                        strokeDasharray="8,4"
                                    />
                                </svg>

                                {/* Drop Slots */}
                                {circuitSlots.map((slot) => {
                                    const placedComponent = components.find((c) => c.placed && c.type === slot.type)

                                    return (
                                        <div
                                            key={slot.id}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => handleDrop(slot.id)}
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                            style={{
                                                left: slot.position.x,
                                                top: slot.position.y,
                                                zIndex: 2,
                                            }}
                                        >
                                            {placedComponent ? (
                                                <div className="p-2 bg-white rounded-lg shadow-md border-2 border-green-400">
                                                    <ComponentIcon type={slot.type} isLit={slot.type === "bulb" && circuitComplete} />
                                                </div>
                                            ) : (
                                                <div className="w-20 h-16 border-2 border-dashed border-gray-400 rounded-lg bg-white/50 flex items-center justify-center">
                                                    <span className="text-xs text-gray-500 text-center capitalize">{slot.type}</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}

                                {/* Instructions */}
                                <div className="absolute bottom-4 left-4 right-4 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Drag components from the left panel to their matching slots to complete the circuit
                                    </p>
                                </div>
                            </div>

                            {/* Circuit Status */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <p className="text-2xl font-bold text-primary">{components.filter((c) => c.placed).length}/5</p>
                                    <p className="text-sm text-muted-foreground">Components Placed</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <p className={`text-2xl font-bold ${circuitComplete ? "text-green-600" : "text-gray-400"}`}>
                                        {circuitComplete ? "ON" : "OFF"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Circuit Status</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
