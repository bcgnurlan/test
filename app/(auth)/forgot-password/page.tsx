'use client'

import * as React from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

export default function ForgotPasswordPage() {
  const [state, setState] = React.useState<'idle' | 'loading' | 'sent'>('idle')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setTimeout(() => setState('sent'), 600)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Şifrəni bərpa et</CardTitle>
        <CardDescription>
          Email ünvanınızı yazın, sizə bərpa keçidi göndərək
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state === 'sent' ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="size-10 text-chart-2" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Bərpa keçidi email ünvanınıza göndərildi. Gələnlər qutusunu yoxlayın.
            </p>
            <Button variant="outline" render={<Link href="/login">Girişə qayıt</Link>} />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="ad@shirket.az" required autoComplete="email" />
              </Field>
              <Button type="submit" className="w-full" disabled={state === 'loading'}>
                {state === 'loading' && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                Bərpa keçidi göndər
              </Button>
            </FieldGroup>
          </form>
        )}
        {state !== 'sent' && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
              Girişə qayıt
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
