// components/ui/Section.tsx
import { Separator } from '@/components/ui/Separator'

interface SettingsSectionProps {
  title: string
  description?: string
  actionRow?: React.ReactNode
  children: React.ReactNode
}

export function SettingsSection({ title, description, actionRow, children }: SettingsSectionProps) {
  return (
    <div className='flex flex-col'>
      <div className='mb-2 flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold tracking-tight md:text-2xl'>{title}</h2>
          {description && <p className='text-sm text-muted-foreground'>{description}</p>}
        </div>
        {actionRow}
      </div>
      <Separator />
      <div className='flex flex-col gap-8 py-8'>{children}</div>
    </div>
  )
}
