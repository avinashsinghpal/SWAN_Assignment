import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export function useLeadFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const statusStr = searchParams.get('status') || '';
  const selectedStatuses = useMemo(() => {
    return statusStr ? statusStr.split(',').filter(Boolean) : [];
  }, [statusStr]);

  const datePreset = searchParams.get('preset') || '';
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  const sortMapping = useMemo(() => {
    switch (sort) {
      case 'oldest':
        return { sortBy: 'createdAt', order: 'asc' };
      case 'name_asc':
        return { sortBy: 'name', order: 'asc' };
      case 'follow_up':
        return { sortBy: 'followUpDate', order: 'asc' };
      case 'newest':
      default:
        return { sortBy: 'createdAt', order: 'desc' };
    }
  }, [sort]);

  const updateParams = useCallback((newParams) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(newParams).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') {
          next.delete(k);
        } else {
          next.set(k, String(v));
        }
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setSearch = useCallback((val) => {
    updateParams({ search: val, page: 1 });
  }, [updateParams]);

  const toggleStatus = useCallback((status) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const current = prev.get('status') ? prev.get('status').split(',').filter(Boolean) : [];
      let updated;
      if (current.includes(status)) {
        updated = current.filter((s) => s !== status);
      } else {
        updated = [...current, status];
      }
      if (updated.length > 0) {
        next.set('status', updated.join(','));
      } else {
        next.delete('status');
      }
      next.set('page', '1');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setDatePreset = useCallback((preset) => {
    if (!preset) {
      updateParams({ preset: '', dateFrom: '', dateTo: '', page: 1 });
      return;
    }

    const today = new Date();
    const toStr = today.toISOString().split('T')[0];
    let fromDate = new Date();

    if (preset === 'Today') {
      fromDate = today;
    } else if (preset === '7 Days') {
      fromDate.setDate(today.getDate() - 7);
    } else if (preset === '30 Days') {
      fromDate.setDate(today.getDate() - 30);
    }

    const fromStr = fromDate.toISOString().split('T')[0];
    updateParams({
      preset,
      dateFrom: fromStr,
      dateTo: toStr,
      page: 1,
    });
  }, [updateParams]);

  const setCustomDateRange = useCallback((from, to) => {
    updateParams({
      preset: 'custom',
      dateFrom: from,
      dateTo: to,
      page: 1,
    });
  }, [updateParams]);

  const setSort = useCallback((val) => {
    updateParams({ sort: val, page: 1 });
  }, [updateParams]);

  const setPage = useCallback((p) => {
    updateParams({ page: p });
  }, [updateParams]);

  const setPageSize = useCallback((size) => {
    updateParams({ pageSize: size, page: 1 });
  }, [updateParams]);

  const clearFilters = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams();
      if (prev.get('pageSize')) next.set('pageSize', prev.get('pageSize'));
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters = Boolean(
    search || selectedStatuses.length > 0 || datePreset || dateFrom || dateTo || (sort && sort !== 'newest')
  );

  const queryParams = useMemo(() => {
    const p = {
      page,
      pageSize,
      sortBy: sortMapping.sortBy,
      order: sortMapping.order,
    };
    if (search) p.search = search;
    if (selectedStatuses.length > 0) p.status = selectedStatuses.join(',');
    if (dateFrom) p.dateFrom = dateFrom;
    if (dateTo) p.dateTo = dateTo;
    return p;
  }, [page, pageSize, sortMapping, search, selectedStatuses, dateFrom, dateTo]);

  return {
    search,
    selectedStatuses,
    datePreset,
    dateFrom,
    dateTo,
    sort,
    page,
    pageSize,
    hasActiveFilters,
    queryParams,
    setSearch,
    toggleStatus,
    setDatePreset,
    setCustomDateRange,
    setSort,
    setPage,
    setPageSize,
    clearFilters,
  };
}
