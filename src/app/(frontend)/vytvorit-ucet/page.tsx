'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyAccountCreationToken } from '@/lib/auth/tokens';
import { registerSchema } from '@/validators/auth';

interface FormData {
  password: string;
  confirmPassword: string;
}

function VytvoritUcetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setError('Neplatný odkaz pro vytvoření účtu');
      setIsValidToken(false);
      return;
    }

    const result = verifyAccountCreationToken(token);
    if (!result.success) {
      setError('Odkaz pro vytvoření účtu je neplatný nebo expirovaný');
      setIsValidToken(false);
    } else {
      setIsValidToken(true);
      setTokenData(result);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Hesla se neshodují');
      return;
    }

    const validation = registerSchema.safeParse({
      email: tokenData.email,
      password: formData.password,
    });

    if (!validation.success) {
      setError('Heslo musí mít alespoň 8 znaků');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: tokenData.email,
          password: formData.password,
          orderId: tokenData.orderId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registrace selhala');
      }

      router.push('/ucet?message=Účet byl úspěšně vytvořen');

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Došlo k chybě');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Ověřování odkazu...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-4">Neplatný odkaz</h1>
          <p className="text-red-600 text-center mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Zpět na hlavní stránku
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">Vytvořte si účet</h1>
        <p className="text-gray-600 text-center mb-6">
          Vytvořte heslo pro email: <strong>{tokenData.email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Heslo
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Zadejte heslo (min. 8 znaků)"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Potvrzení hesla
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Zopakujte heslo"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Vytváření účtu...' : 'Vytvořit účet'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Zpět na hlavní stránku
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VytvoritUcetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <VytvoritUcetContent />
    </Suspense>
  );
}
