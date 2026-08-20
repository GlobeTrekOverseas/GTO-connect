import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface TabsProps {
  defaultValue: string
  className?: string
  children: React.ReactNode
}

const TabsContext = React.createContext<{
  value: string
  setValue: (value: string) => void
} | null>(null)

export const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("must be used within Tabs")
  return context
}

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue)

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center rounded-full bg-slate-50 p-1 mb-8 border border-slate-100",
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")

  const isActive = context.value === value

  return (
    <button
      type="button"
      onClick={() => context.setValue(value)}
      className={cn(
        "relative flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 py-3 text-sm font-semibold transition-colors z-10",
        isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-primary rounded-full shadow-md"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          style={{ zIndex: -1 }}
        />
      )}
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used within Tabs")

  if (context.value !== value) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)}
    >
      {children}
    </motion.div>
  )
}
