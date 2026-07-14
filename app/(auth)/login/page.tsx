'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/'), 600)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daxil ol</CardTitle>
        <CardDescription>Hesabınıza daxil olmaq üçün email və şifrənizi yazın</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="ad@shirket.az" required autoComplete="email" />
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Şifrə</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Şifrəni unutmusunuz?
                </Link>
              </div>
              <Input id="password" type="password" required autoComplete="current-password" />
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Daxil ol
            </Button>
          </FieldGroup>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Hesabınız yoxdur?{' '}
          <Link href="/register" className="text-foreground underline-offset-4 hover:underline">
            Qeydiyyatdan keçin
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
