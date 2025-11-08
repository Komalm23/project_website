import { useState, useEffect, useCallback } from 'react';
import { BankingService } from '@core/ports/inbound/BankingService';
import { ComplianceBalance } from '@core/domain/entities/Banking';

export function useBanking(bankingService: BankingService, year: number) {
  const [balance, setBalance] = useState<ComplianceBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bankingService.getComplianceBalance(year);
      setBalance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch compliance balance');
    } finally {
      setLoading(false);
    }
  }, [bankingService, year]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleBankSurplus = async () => {
    try {
      setActionLoading(true);
      setError(null);
      await bankingService.bankSurplus({ year });
      await fetchBalance();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bank surplus');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyBanked = async () => {
    try {
      setActionLoading(true);
      setError(null);
      await bankingService.applyBankedSurplus({ year });
      await fetchBalance();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply banked surplus');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    balance,
    loading,
    error,
    actionLoading,
    bankSurplus: handleBankSurplus,
    applyBanked: handleApplyBanked,
    refresh: fetchBalance,
  };
}

