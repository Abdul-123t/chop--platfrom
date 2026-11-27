import { useCallback, useState } from 'react';
import { useAuthorizedAction } from '../../hooks/useAuthorizedAction';
import { vendorApi } from '../../services/api/vendor';
import type { ProfileUpdate } from '../types';
import { useVendor } from '../VendorContext';

export function useProfileSaver() {
  const { token, logout, applyProfile } = useVendor();
  const action = useAuthorizedAction(logout);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const { run } = action;

  const save = useCallback(
    async (update: ProfileUpdate) => {
      setSavedAt(null);
      const result = await run(() => vendorApi.updateProfile(token, update));
      if (!result) return false;
      applyProfile(result);
      setSavedAt(Date.now());
      return true;
    },
    [run, token, applyProfile]
  );

  return { save, pending: action.pending, error: action.error, savedAt, clearError: action.clearError };
}
