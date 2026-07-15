import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { authQueryKeys } from '@/hooks/use-session'
import { getSession, completeProviderSignup } from '@/lib/auth-client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

/**
 * OAuth callback page - handles successful ORCID login redirect.
 * 
 * This page:
 * 1. Invalidates the session cache to trigger a fresh auth check
 * 2. If a provider_signup flow is pending, completes the signup
 * 3. Redirects to the main app or error page based on auth state
 */
export function AuthCallbackPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    async function handleCallback() {
      try {
        queryClient.invalidateQueries({ queryKey: authQueryKeys.session() })

        let session = await getSession()
        console.log('Session after OAuth callback:', session)

        if (!session.isAuthenticated) {
          const signupResponse = await completeProviderSignup()

          if (!signupResponse.ok) {
            const body = await signupResponse.json().catch(() => null)
            const missingEmail = body?.errors?.some(
              (e: { param?: string }) => e.param === 'email'
            )

            if (signupResponse.status === 400 && missingEmail) {
              navigate('/auth/error?error=orcid_email_missing')
              return
            }

            if (signupResponse.status !== 409) {
              // 409 = already signed up, harmless (React StrictMode double-invoke)
              navigate('/auth/error?error=signup_failed')
              return
            }
          }

          session = await getSession()
        }

        if (session.isAuthenticated) {
          navigate('/')
        } else {
          navigate('/auth/error')
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error)
        navigate('/auth/error?error=network_error')
      }
    }

    handleCallback()
  }, [navigate, queryClient])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Completing authentication...</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Spinner className="size-8" />
      </CardContent>
    </Card>
  )
}

export default AuthCallbackPage