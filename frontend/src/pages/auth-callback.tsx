import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { authQueryKeys } from '@/hooks/use-session'
import { getSession, completeProviderSignup } from '@/lib/auth-client'

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
  const [status, setStatus] = useState<'processing' | 'error'>('processing')

  useEffect(() => {
    async function handleCallback() {
      try {
        // Invalidate session cache to trigger refetch with new auth state
        queryClient.invalidateQueries({ queryKey: authQueryKeys.session() })
        
        // Check current session state
        let session = await getSession()
        console.log('Session after OAuth callback:', session)
        
        // If not authenticated, try to complete the provider signup
        if (!session.isAuthenticated) {
          try {
            await completeProviderSignup()
          } catch (err) {
            // 409 Conflict is expected if already signed up - not an error
            // This can happen in React StrictMode where effects run twice
            console.log('Signup attempt response (409 is OK if already authenticated):', err)
          }
          // Always re-check session after signup attempt, regardless of response status
          session = await getSession()
        }
        
        // Redirect based on final auth state
        if (session.isAuthenticated) {
          navigate('/')
        } else {
          // Still not authenticated - redirect to error page
          navigate('/auth/error')
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error)
        setStatus('error')
      }
    }

    handleCallback()
  }, [navigate, queryClient])

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Authentication failed</p>
          <p className="text-gray-500 text-sm mt-2">
            <button onClick={() => navigate('/auth/error')} className="underline">
              Go to error page
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}

export default AuthCallbackPage
