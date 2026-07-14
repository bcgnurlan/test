import { Layers } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Layers className="size-5" aria-hidden="true" />
        </div>
        <span className="text-xl font-semibold tracking-tight">Taskora</span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  )
}
