"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { getSurfaceRaised, getSurfaceOverlay, getAccent, getAccentHover } from "@/easter-eggs/themeColors"

function parseHexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "")
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  }
}

interface Position {
  x: number
  y: number
}

const GRID_SIZE = 20
const CELL_SIZE = 20
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE
const BASE_SPEED = 120
const SPEED_INCREMENT = 2

function randomPosition(exclude: Position[]): Position {
  let pos: Position
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (exclude.some((p) => p.x === pos.x && p.y === pos.y))
  return pos
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }] as Position[],
    food: { x: 15, y: 10 } as Position,
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    gameOver: false,
    lastTime: 0,
  })

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }]
    stateRef.current = {
      snake: initialSnake,
      food: randomPosition(initialSnake),
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      score: 0,
      gameOver: false,
      lastTime: 0,
    }
    setScore(0)
    setGameOver(false)
    setStarted(true)
  }, [])

  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  const changeDirection = useCallback(
    (newDir: { x: number; y: number }) => {
      const state = stateRef.current
      const isOpposite =
        newDir.x === -state.direction.x && newDir.y === -state.direction.y
      if (!isOpposite) {
        state.nextDirection = newDir
      }
      if (!started && !state.gameOver) {
        setStarted(true)
      }
    },
    [started]
  )

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { snake, food } = stateRef.current

    const bgColor = getSurfaceRaised()
    const gridColor = getSurfaceOverlay()
    const snakeBaseColor = getAccent()
    const foodColor = getAccentHover()

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    ctx.strokeStyle = gridColor
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE)
      ctx.stroke()
    }

    const baseRgb = parseHexToRgb(snakeBaseColor)

    snake.forEach((segment, index) => {
      const brightness = 1 - index * 0.03
      const r = Math.round(baseRgb.r * brightness)
      const g = Math.round(baseRgb.g * brightness)
      const b = Math.round(baseRgb.b * brightness)
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.beginPath()
      ctx.roundRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2,
        3
      )
      ctx.fill()
    })

    ctx.fillStyle = foodColor
    ctx.beginPath()
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = stateRef.current

      if (e.code === "Space" && state.gameOver) {
        e.preventDefault()
        resetGame()
        return
      }

      const keyMap: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        KeyW: { x: 0, y: -1 },
        KeyS: { x: 0, y: 1 },
        KeyA: { x: -1, y: 0 },
        KeyD: { x: 1, y: 0 },
      }

      const newDir = keyMap[e.code]
      if (!newDir) return

      e.preventDefault()
      changeDirection(newDir)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [resetGame, changeDirection])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const gameLoop = (timestamp: number) => {
      const state = stateRef.current

      if (state.gameOver) {
        draw(ctx)
        return
      }

      const speed = Math.max(BASE_SPEED - state.score * SPEED_INCREMENT, 50)

      if (timestamp - state.lastTime >= speed) {
        state.lastTime = timestamp
        state.direction = state.nextDirection

        const head = state.snake[0]
        const newHead: Position = {
          x: head.x + state.direction.x,
          y: head.y + state.direction.y,
        }

        const hitWall =
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE

        const hitSelf = state.snake.some(
          (s) => s.x === newHead.x && s.y === newHead.y
        )

        if (hitWall || hitSelf) {
          state.gameOver = true
          setGameOver(true)
          draw(ctx)
          return
        }

        const ateFood =
          newHead.x === state.food.x && newHead.y === state.food.y

        state.snake = [newHead, ...state.snake.slice(0, ateFood ? undefined : -1)]

        if (ateFood) {
          state.score += 1
          setScore(state.score)
          state.food = randomPosition(state.snake)
        }
      }

      draw(ctx)
      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animationId)
  }, [draw, started])

  return (
    <div className="flex flex-col items-center gap-4 w-full px-4">
      <div className="flex items-center justify-between w-full max-w-[400px]">
        <span className="text-sm text-text-secondary">Puntuacion</span>
        <span className="text-lg font-semibold text-accent tabular-nums">
          {score}
        </span>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-surface-border w-full max-w-[400px]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block w-full h-auto"
        />

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm">
            <p className="text-text-primary font-medium text-lg">Snake</p>
            <p className="text-text-muted text-sm mt-2 mb-4">
              {isTouchDevice ? "Controla con las flechas" : "Usa las flechas o WASD"}
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-6 py-3 rounded-xl bg-accent text-surface font-medium hover:bg-accent-hover active:bg-accent-hover transition-colors"
            >
              Jugar
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/85 backdrop-blur-sm">
            <p className="text-text-primary font-semibold text-xl">Game Over</p>
            <p className="text-accent text-2xl font-bold mt-2 tabular-nums">
              {score}
            </p>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-3 rounded-xl bg-accent text-surface font-medium hover:bg-accent-hover active:bg-accent-hover transition-colors"
            >
              Reiniciar
            </button>
          </div>
        )}
      </div>

      {isTouchDevice && (
        <div className="grid grid-cols-3 gap-2 w-[180px] mt-4">
          <div />
          <button
            onTouchStart={(e) => {
              e.preventDefault()
              changeDirection({ x: 0, y: -1 })
            }}
            className="flex items-center justify-center w-14 h-14 rounded-xl bg-surface-overlay/80 border border-surface-border text-text-secondary active:bg-accent active:text-surface"
          >
            <ChevronUp size={24} strokeWidth={2} />
          </button>
          <div />
          <button
            onTouchStart={(e) => {
              e.preventDefault()
              changeDirection({ x: -1, y: 0 })
            }}
            className="flex items-center justify-center w-14 h-14 rounded-xl bg-surface-overlay/80 border border-surface-border text-text-secondary active:bg-accent active:text-surface"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          <div />
          <button
            onTouchStart={(e) => {
              e.preventDefault()
              changeDirection({ x: 1, y: 0 })
            }}
            className="flex items-center justify-center w-14 h-14 rounded-xl bg-surface-overlay/80 border border-surface-border text-text-secondary active:bg-accent active:text-surface"
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>
          <div />
          <button
            onTouchStart={(e) => {
              e.preventDefault()
              changeDirection({ x: 0, y: 1 })
            }}
            className="flex items-center justify-center w-14 h-14 rounded-xl bg-surface-overlay/80 border border-surface-border text-text-secondary active:bg-accent active:text-surface"
          >
            <ChevronDown size={24} strokeWidth={2} />
          </button>
          <div />
        </div>
      )}
    </div>
  )
}
