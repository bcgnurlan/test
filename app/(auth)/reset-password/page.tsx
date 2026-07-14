'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('password') !== data.get('confirm')) {
      setError('Şifrələr uyğun gəlmir')
      return
    }
    setError(null)
    setLoading(true)
    setTimeout(() => router.push('/login'), 600)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yeni şifrə təyin et</CardTitle>
        <CardDescription>Hesabınız üçün yeni şifrə yaradın</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">Yeni şifrə</FieldLabel>
              <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
              <FieldDescription>Ən azı 8 simvol olmalıdır</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm">Şifrəni təsdiqlə</FieldLabel>
              <Input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" />
              {error && <FieldError>{error}</FieldError>}
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Şifrəni yenilə
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
