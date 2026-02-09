"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Keyboard, MousePointer, Clock, Move, EyeOff, Search, Gamepad2, Trophy, Sparkles } from "lucide-react"

interface AchievementToastProps {
  eggName: string
  category: string
  hint: string
  progress: { found: number; total: number }
  visible: boolean
  onClose: () => void
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  keyboard: <Keyboard size={20} strokeWidth={1.5} />,
  click: <MousePointer size={20} strokeWidth={1.5} />,
  scroll: <Move size={20} strokeWidth={1.5} />,
  time: <Clock size={20} strokeWidth={1.5} />,
  hover: <Move size={20} strokeWidth={1.5} />,
  hidden: <EyeOff size={20} strokeWidth={1.5} />,
  form: <Search size={20} strokeWidth={1.5} />,
  game: <Gamepad2 size={20} strokeWidth={1.5} />,
  achievement: <Trophy size={20} strokeWidth={1.5} />,
  visual: <Sparkles size={20} strokeWidth={1.5} />,
}

export default function AchievementToast({
  eggName,
  category,
  hint,
  progress,
  visible,
  onClose,
}: AchievementToastProps) {
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [visible, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="bg-surface-raised border border-accent/30 rounded-2xl px-6 py-4 shadow-2xl min-w-[340px] max-w-[420px]">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15 text-accent shrink-0">
                {CATEGORY_ICONS[category] || <Sparkles size={20} strokeWidth={1.5} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {eggName}
                </p>
                <p className="text-xs text-text-muted mt-0.5 truncate">
                  {hint}
                </p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-xs font-medium text-accent">
                  {progress.found}/{progress.total}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
