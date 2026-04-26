'use client';

import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';

export const useAuth = () => {
  const { user, isLoading, login, logout, register, refreshToken } = useUserStore();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    refreshToken,
  };
};
