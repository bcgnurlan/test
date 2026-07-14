'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Kbd, KbdGroup } from '@/components/ui/kbd'

const shortcuts = [
  { keys: ['⌘', 'K'], label: 'Əmr paneli' },
  { keys: ['/'], label: 'Axtarış' },
  { keys: ['C'], label: 'Yeni tapşırıq yarat' },
  { keys: ['?'], label: 'Qısayol köməyi' },
]

interface ShortcutsHelpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShortcutsHelp({ open, onOpenChange }: ShortcutsHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Klaviatura qısayolları</DialogTitle>
          <DialogDescription>Platformada sürətli işləmək üçün qısayollar.</DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-3">
          {shortcuts.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-4">
              <span className="text-sm">{s.label}</span>
              <KbdGroup>
                {s.keys.map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </KbdGroup>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
