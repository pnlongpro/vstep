'use client';

import { useEffect, useState, useCallback } from 'react';
import { FreeAccountManagementPage as FreeAccountManagementPageUI } from './FreeAccountManagementPage';
import { userManagementApi, FreeUser as ApiFreeUser } from '@/services/admin.service';
import { useApiError } from '@/hooks/useApiError';

// Map API FreeUser to component FreeUser interface
function mapApiFreeUserToFreeUser(user: ApiFreeUser): FreeUser {
  return {
    id: Number(user.id),
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    email: user.email,
    phone: user.profile?.phone || '',
    registeredDate: user.createdAt,
    lastActive: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('vi-VN') : '',
    status: user.status === 'active' ? 'active' : 'inactive',
    usage: {
      mockTests: user.usage?.mockTests ?? 0,
      aiSpeaking: user.usage?.aiSpeaking ?? 0,
      aiWriting: user.usage?.aiWriting ?? 0,
    },
    limits: {
      mockTests: user.limits?.mockTests ?? 3,
      aiSpeaking: user.limits?.aiSpeaking ?? 1,
      aiWriting: user.limits?.aiWriting ?? 1,
    },
  };
}

export default function FreeAccountManagementPageContainer() {
  const [freeUsers, setFreeUsers] = useState<FreeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useApiError();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userManagementApi.getFreeUsers({});
      setFreeUsers(data.items.map(mapApiFreeUserToFreeUser));
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải...</div>;
  }

  return <FreeAccountManagementPageUI freeUsers={freeUsers} />;
}

// Type for prop drilling
export interface FreeUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  lastActive: string;
  status: 'active' | 'inactive';
  usage: {
    mockTests: number;
    aiSpeaking: number;
    aiWriting: number;
  };
  limits: {
    mockTests: number;
    aiSpeaking: number;
    aiWriting: number;
  };
}
