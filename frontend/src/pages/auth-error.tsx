import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-red-600">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error?.message}
          </p>
        </div>
        <div className="flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Application
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuthErrorPage