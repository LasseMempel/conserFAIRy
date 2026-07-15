import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { redirectToProvider } from '@/lib/auth-client'

interface AuthError {
  message: string
  code?: string
}

export function AuthErrorPage() {
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (errorParam === 'orcid_email_missing') {
      setError({
        code: errorParam,
        message:
          "Your ORCID account doesn't have a public email address, which conserFAIRy needs to create your account. " +
          "Go to orcid.org, sign in, open Account Settings → Emails, and set your email's visibility to " +
          "\"Everyone\" or \"Trusted parties.\" Then try signing in again.",
      })
    } else if (errorParam === 'network_error') {
      setError({
        code: errorParam,
        message: 'A network error occurred while signing in. Please check your connection and try again.',
      })
    } else if (errorParam === 'signup_failed') {
      setError({
        code: errorParam,
        message: 'Something went wrong creating your account. Please try signing in again, or contact support if this persists.',
      })
    } else if (errorParam) {
      setError({
        message: errorDescription || errorParam,
        code: errorParam,
      })
    } else {
      setError({
        message: 'An unknown error occurred during authentication.',
      })
    }
  }, [searchParams])

  const handleRetry = () => {
    redirectToProvider('orcid', window.location.origin + '/auth/callback')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Error</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertDescription>
            {error?.message}
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleRetry}>
          Try Again
        </Button>
        <Button asChild>
          <Link to="/">Return to Application</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default AuthErrorPage