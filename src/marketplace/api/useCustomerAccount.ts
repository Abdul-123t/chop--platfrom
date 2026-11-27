import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../services/api/http';
import type { CustomerAddress, CustomerUser, LocationArea } from '../types';
import { marketplaceApi } from './client';
import { clearLegacyAccountData, readCustomerSession, writeCustomerSession } from './customerSession';
import { fromAddress, toAddress, toCustomerUser } from './mappers';
import type { CustomerSessionDto } from './types';

export interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  preferredLocation: LocationArea;
  password?: string;
}

export function useCustomerAccount() {
  const [session, setSession] = useState<CustomerSessionDto | null>(readCustomerSession);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const token = session?.token ?? null;

  const start = useCallback((next: CustomerSessionDto | null) => {
    writeCustomerSession(next);
    setSession(next);
  }, []);

  useEffect(() => {
    clearLegacyAccountData();
    const stored = readCustomerSession();
    if (!stored) return;
    marketplaceApi
      .me(stored.token)
      .then((result) => start({ ...stored, customer: result.customer }))
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) start(null);
      });
  }, [start]);

  useEffect(() => {
    if (!token) {
      setAddresses([]);
      return;
    }
    marketplaceApi
      .addresses(token)
      .then((result) => setAddresses(result.addresses.map(toAddress)))
      .catch(() => setAddresses([]));
  }, [token]);

  const login = useCallback(
    async (identifier: string, password: string): Promise<CustomerUser> => {
      const next = await marketplaceApi.login(identifier, password);
      start(next);
      return toCustomerUser(next.customer);
    },
    [start]
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<CustomerUser> => {
      if (!input.password || input.password.length < 8) throw new Error('Choose a password with at least 8 characters.');
      const next = await marketplaceApi.register({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        password: input.password,
        preferredArea: input.preferredLocation,
      });
      start(next);
      return toCustomerUser(next.customer);
    },
    [start]
  );

  const logout = useCallback(() => start(null), [start]);

  const requestPasswordReset = useCallback(async (identifier: string) => {
    await marketplaceApi.forgot(identifier);
  }, []);

  const saveAddress = useCallback(
    async (address: Omit<CustomerAddress, 'id'>) => {
      if (!token) throw new Error('Sign in to save addresses.');
      const result = await marketplaceApi.addAddress(token, fromAddress(address));
      const saved = toAddress(result.address);
      setAddresses((current) => [saved, ...current.map((entry) => (saved.isDefault ? { ...entry, isDefault: false } : entry))]);
    },
    [token]
  );

  const updateProfile = useCallback(
    async (update: { fullName?: string; email?: string; phone?: string; preferredLocation?: LocationArea }) => {
      if (!session) throw new Error('Sign in again to update your profile.');
      const result = await marketplaceApi.updateProfile(session.token, {
        ...(update.fullName !== undefined ? { fullName: update.fullName } : {}),
        ...(update.email !== undefined ? { email: update.email } : {}),
        ...(update.phone !== undefined ? { phone: update.phone } : {}),
        ...(update.preferredLocation ? { preferredArea: update.preferredLocation } : {}),
      });
      start({ ...session, customer: result.customer });
    },
    [session, start]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!token) throw new Error('Sign in again to change your password.');
      start(await marketplaceApi.changePassword(token, currentPassword, newPassword));
    },
    [token, start]
  );

  const setDefaultAddress = useCallback(
    async (addressId: string) => {
      if (!token) return;
      await marketplaceApi.updateAddress(token, addressId, { isDefault: true });
      setAddresses((current) =>
        [...current.map((entry) => ({ ...entry, isDefault: entry.id === addressId }))].sort(
          (a, b) => Number(b.isDefault) - Number(a.isDefault)
        )
      );
    },
    [token]
  );

  const deleteAddress = useCallback(
    async (addressId: string) => {
      if (!token) return;
      await marketplaceApi.deleteAddress(token, addressId);
      setAddresses((current) => current.filter((entry) => entry.id !== addressId));
    },
    [token]
  );

  return {
    token,
    user: session ? toCustomerUser(session.customer) : null,
    addresses,
    login,
    register,
    logout,
    requestPasswordReset,
    saveAddress,
    deleteAddress,
    updateProfile,
    changePassword,
    setDefaultAddress,
  };
}
