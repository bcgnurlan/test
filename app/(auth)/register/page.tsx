'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'

export default function RegisterPage() {
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
        <CardTitle>Qeydiyyat</CardTitle>
        <CardDescription>Yeni hesab yaradın və komandanızla işə başlayın</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Ad Soyad</FieldLabel>
              <Input id="name" placeholder="Aysel Məmmədova" required autoComplete="name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="ad@shirket.az" required autoComplete="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Şifrə</FieldLabel>
              <Input id="password" type="password" required minLength={8} autoComplete="new-password" />
              <FieldDescription>Ən azı 8 simvol olmalıdır</FieldDescription>
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Hesab yarat
            </Button>
          </FieldGroup>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Artıq hesabınız var?{' '}
          <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
            Daxil olun
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
