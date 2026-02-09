"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Keyboard, MousePointer, Clock, Move, EyeOff, Search, Gamepad2, Trophy, Sparkles, X } from "lucide-react"

interface ToastData {
  id: string
  eggName: string
  category: string
  hint: string
}

interface AchievementToastStackProps {
  toasts: ToastData[]
  progress: { found: number; total: number }
  onDismiss: (id: string) => void
}

const TOAST_DURATION = 6000

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  keyboard: <Keyboard size={18} strokeWidth={1.5} />,
  click: <MousePointer size={18} strokeWidth={1.5} />,
  scroll: <Move size={18} strokeWidth={1.5} />,
  time: <Clock size={18} strokeWidth={1.5} />,
  hover: <Move size={18} strokeWidth={1.5} />,
  hidden: <EyeOff size={18} strokeWidth={1.5} />,
  form: <Search size={18} strokeWidth={1.5} />,
  game: <Gamepad2 size={18} strokeWidth={1.5} />,
  achievement: <Trophy size={18} strokeWidth={1.5} />,
  visual: <Sparkles size={18} strokeWidth={1.5} />,
}

function SingleToast({
  toast,
  progress,
  onDismiss,
}: {
  toast: ToastData
  progress: { found: number; total: number }
  onDismiss: (id: string) => void
}) {
  const handleDismiss = useCallback(() => onDismiss(toast.id), [onDismiss, toast.id])

  useEffect(() => {
    const timer = setTimeout(handleDismiss, TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [handleDismiss])

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 60, scale: 0.92, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{
        opacity: 0,
        scale: 0.88,
        y: -10,
        filter: "blur(4px)",
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={{
        type: "spring",
        damping: 24,
        stiffness: 180,
        mass: 1.2,
      }}
      className="pointer-events-auto w-[360px]"
    >
      <div className="relative bg-surface-raised border border-accent/30 rounded-2xl px-5 py-3.5 shadow-2xl overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-accent/40"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: TOAST_DURATION / 1000, ease: "linear" }}
        />
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/15 text-accent shrink-0"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              damping: 14,
              stiffness: 200,
              delay: 0.15,
            }}
          >
            {CATEGORY_ICONS[toast.category] || <Sparkles size={18} strokeWidth={1.5} />}
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.p
              className="text-sm font-semibold text-text-primary"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {toast.eggName}
            </motion.p>
            <motion.p
              className="text-xs text-text-muted mt-0.5 line-clamp-2"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {toast.hint}
            </motion.p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <motion.span
              className="text-xs font-medium text-accent tabular-nums"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              {progress.found}/{progress.total}
            </motion.span>
            <button
              onClick={handleDismiss}
              className="flex items-center justify-center w-6 h-6 rounded-lg text-text-muted/50 hover:text-text-primary transition-colors"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function AchievementToastStack({
  toasts,
  progress,
  onDismiss,
}: AchievementToastStackProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col-reverse gap-2 items-center pointer-events-none">
      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <SingleToast
              key={toast.id}
              toast={toast}
              progress={progress}
              onDismiss={onDismiss}
            />
          ))}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  )
}

export type { ToastData }
