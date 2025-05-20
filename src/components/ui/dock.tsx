"use client"

import * as React from "react"
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"
import { cn } from "../../lib/utils"

export interface DockProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode
}

export function Dock({ className, children, ...props }: DockProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={cn(
        "flex h-16 items-end justify-center gap-4 rounded-3xl bg-white/70 px-4 pb-3 backdrop-blur dark:bg-gray-800/70",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export interface DockItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode
  label?: string
}

export function DockItem({ className, children, ...props }: DockItemProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("relative flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export interface DockLabelProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode
}

export function DockLabel({ className, children, ...props }: DockLabelProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: -20 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "absolute whitespace-nowrap rounded-md bg-gray-800 px-3 py-2 text-sm text-white dark:bg-white dark:text-gray-800",
          className
        )}
        {...props}
      >
        {children}
        <motion.div
          className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent"
          style={{
            borderTopColor: "rgb(31, 41, 55)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export interface DockIconProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode
}

export function DockIcon({ className, children, ...props }: DockIconProps) {
  return (
    <motion.div
      className={cn("h-10 w-10 p-2", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
