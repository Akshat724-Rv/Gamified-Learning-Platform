"use client"

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, RotateCcw, Target, Trophy, Play } from "lucide-react"
import Link from "next/link"

interface Position {
    x: number
    y: number
}

interface Projectile {
    x: number
    y: number
    vx: number
    vy: number
    trail: Position[]
}

export default function GravityArcherGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | undefined>(undefined)

    const [angle, setAngle] = useState(45)
    const [power, setPower] = useState(50)
    const [score, setScore] = useState(0)
    const [level, setLevel] = useState(1)
    const [shots, setShots] = useState(0)
    const [isLaunching, setIsLaunching] = useState(false)
    const [projectile, setProjectile] = useState<Projectile | null>(null)
    const [target, setTarget] = useState<Position>({ x: 600, y: 300 })
    const [gameState, setGameState] = useState<"ready" | "launching" | "hit" | "miss">("ready")

    const canvasWidth = 800
    const canvasHeight = 400
    const gravity = 0.3
    const cannonX = 50
    const cannonY = canvasHeight - 50

    useEffect(() => {
        generateNewTarget()
    }, [level])

    useEffect(() => {
        if (projectile && canvasRef.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            if (!ctx) return

            const animate = () => {
                // Clear canvas
                ctx.clearRect(0, 0, canvasWidth, canvasHeight)

                // Draw background
                drawBackground(ctx)

                // Draw cannon
                drawCannon(ctx)

                // Draw target
                drawTarget(ctx)

                // Update and draw projectile
                if (projectile) {
                    const newProjectile = { ...projectile }

                    // Update position
                    newProjectile.x += newProjectile.vx
                    newProjectile.y += newProjectile.vy
                    newProjectile.vy += gravity

                    // Add to trail
                    newProjectile.trail.push({ x: newProjectile.x, y: newProjectile.y })
                    if (newProjectile.trail.length > 20) {
                        newProjectile.trail.shift()
                    }

                    // Draw trail
                    drawTrail(ctx, newProjectile.trail)

                    // Draw projectile
                    drawProjectile(ctx, newProjectile.x, newProjectile.y)

                    // Check collision with target
                    const distance = Math.sqrt(Math.pow(newProjectile.x - target.x, 2) + Math.pow(newProjectile.y - target.y, 2))

                    if (distance < 30) {
                        // Hit!
                        setGameState("hit")
                        setScore((prev) => prev + (100 - shots * 10))
                        setProjectile(null)
                        setTimeout(() => {
                            setLevel((prev) => prev + 1)
                            setShots(0)
                            setGameState("ready")
                        }, 2000)
                        return
                    }

                    // Check if projectile is out of bounds
                    if (newProjectile.x > canvasWidth || newProjectile.y > canvasHeight) {
                        setGameState("miss")
                        setProjectile(null)
                        setTimeout(() => {
                            setGameState("ready")
                        }, 1000)
                        return
                    }

                    setProjectile(newProjectile)
                    animationRef.current = requestAnimationFrame(animate)
                }
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [projectile, target, shots])

    const drawBackground = (ctx: CanvasRenderingContext2D) => {
        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
        gradient.addColorStop(0, "#87CEEB")
        gradient.addColorStop(1, "#98FB98")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        // Ground
        ctx.fillStyle = "#8B4513"
        ctx.fillRect(0, canvasHeight - 30, canvasWidth, 30)

        // Clouds
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.beginPath()
        ctx.arc(150, 80, 30, 0, Math.PI * 2)
        ctx.arc(180, 80, 40, 0, Math.PI * 2)
        ctx.arc(210, 80, 30, 0, Math.PI * 2)
        ctx.fill()
    }

    const drawCannon = (ctx: CanvasRenderingContext2D) => {
        ctx.save()
        ctx.translate(cannonX, cannonY)

        // Cannon base
        ctx.fillStyle = "#4A4A4A"
        ctx.fillRect(-15, -10, 30, 20)

        // Cannon barrel
        ctx.rotate((-angle * Math.PI) / 180)
        ctx.fillStyle = "#2C2C2C"
        ctx.fillRect(0, -5, 40, 10)

        ctx.restore()
    }

    const drawTarget = (ctx: CanvasRenderingContext2D) => {
        // Target rings
        const rings = [
            { radius: 30, color: "#FF4444" },
            { radius: 20, color: "#FFFFFF" },
            { radius: 10, color: "#FF4444" },
        ]

        rings.forEach((ring) => {
            ctx.fillStyle = ring.color
            ctx.beginPath()
            ctx.arc(target.x, target.y, ring.radius, 0, Math.PI * 2)
            ctx.fill()
        })

        // Bullseye
        ctx.fillStyle = "#000000"
        ctx.beginPath()
        ctx.arc(target.x, target.y, 3, 0, Math.PI * 2)
        ctx.fill()
    }

    const drawProjectile = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
        ctx.fillStyle = "#FF6B35"
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        ctx.shadowColor = "#FF6B35"
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
    }

    const drawTrail = (ctx: CanvasRenderingContext2D, trail: Position[]) => {
        if (trail.length < 2) return

        ctx.strokeStyle = "rgba(255, 107, 53, 0.5)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(trail[0].x, trail[0].y)

        for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y)
        }

        ctx.stroke()
    }

    const generateNewTarget = () => {
        const minX = 400
        const maxX = canvasWidth - 50
        const minY = 100
        const maxY = canvasHeight - 100

        setTarget({
            x: minX + Math.random() * (maxX - minX),
            y: minY + Math.random() * (maxY - minY),
        })
    }

    const launch = () => {
        if (isLaunching || projectile) return

        setIsLaunching(true)
        setShots((prev) => prev + 1)
        setGameState("launching")

        // Calculate initial velocity
        const radians = (angle * Math.PI) / 180
        const velocity = power * 0.3
        const vx = Math.cos(radians) * velocity
        const vy = -Math.sin(radians) * velocity

        setProjectile({
            x: cannonX + Math.cos(radians) * 40,
            y: cannonY + Math.sin(radians) * 40,
            vx,
            vy,
            trail: [],
        })

        setTimeout(() => setIsLaunching(false), 500)
    }

    const resetGame = () => {
        setProjectile(null)
        setGameState("ready")
        setShots(0)
        generateNewTarget()
    }

    // Initial canvas draw
    useEffect(() => {
        if (canvasRef.current && !projectile) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            if (!ctx) return

            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            drawBackground(ctx)
            drawCannon(ctx)
            drawTarget(ctx)
        }
    }, [angle, target, projectile])

    return (
        <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/games" className="flex items-center gap-2 text-red-600 hover:text-red-700">
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
                            <span>Shots: {shots}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Game Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl mb-4">
                        <Target className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Gravity Archer</h1>
                    <p className="text-lg text-gray-600">Master projectile motion by hitting targets!</p>
                </div>

                {/* Game Canvas */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                    <div className="flex justify-center mb-4">
                        <canvas
                            ref={canvasRef}
                            width={canvasWidth}
                            height={canvasHeight}
                            className="border-2 border-gray-200 rounded-xl max-w-full h-auto"
                        />
                    </div>

                    {/* Game Status */}
                    <div className="text-center mb-4">
                        {gameState === "ready" && <p className="text-lg text-gray-600">Adjust angle and power, then launch!</p>}
                        {gameState === "launching" && (
                            <p className="text-lg text-blue-600 font-semibold">Projectile in flight...</p>
                        )}
                        {gameState === "hit" && <p className="text-lg text-green-600 font-bold">🎯 Direct Hit! Great shot!</p>}
                        {gameState === "miss" && (
                            <p className="text-lg text-red-600 font-semibold">Missed! Try adjusting your aim.</p>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Angle Control */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Launch Angle</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Angle:</span>
                                <span className="font-bold text-2xl text-red-600">{angle}°</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="80"
                                value={angle}
                                onChange={(e) => setAngle(Number(e.target.value))}
                                disabled={isLaunching || !!projectile}
                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>10°</span>
                                <span>45°</span>
                                <span>80°</span>
                            </div>
                        </div>
                    </div>

                    {/* Power Control */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Launch Power</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Power:</span>
                                <span className="font-bold text-2xl text-orange-600">{power}%</span>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="100"
                                value={power}
                                onChange={(e) => setPower(Number(e.target.value))}
                                disabled={isLaunching || !!projectile}
                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>20%</span>
                                <span>60%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <button
                        onClick={launch}
                        disabled={isLaunching || !!projectile}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play className="w-5 h-5" />
                        {isLaunching ? "Launching..." : "Launch Projectile"}
                    </button>

                    <button
                        onClick={resetGame}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border-2 border-red-500 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Reset Level
                    </button>
                </div>

                {/* Physics Info */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Physics Concepts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-semibold text-blue-700 mb-2">Projectile Motion</h4>
                            <p className="text-gray-600">
                                Objects follow a curved path when launched at an angle due to gravity pulling them downward.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-700 mb-2">Optimal Angle</h4>
                            <p className="text-gray-600">
                                45° gives maximum range on flat ground, but adjust based on target height and distance!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ef4444, #f97316);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ef4444, #f97316);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
        </main>
    )
}
