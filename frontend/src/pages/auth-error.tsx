import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface AuthError {
  message: string
  code?: string
}

export function AuthErrorPage() {
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    // Parse error from query parameters
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (errorParam) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
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
        <CardFooter>
          <Button asChild>
            <Link to="/">Return to Application</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AuthErrorPage
