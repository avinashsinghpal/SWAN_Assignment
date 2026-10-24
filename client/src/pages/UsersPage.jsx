import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/dashboard.api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table.jsx';
import { TableRowSkeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { Card } from '../components/ui/Card.jsx';
import { formatDate, formatIndex } from '../lib/formatters.js';
import { cn } from '../lib/cn.js';

export function UsersPage() {
  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await usersApi.list();
      return res.data?.data || [];
    },
  });

  const users = usersData || [];

  return (
    <div className="space-y-8 font-mono">
      {/* ── Page Header ────────────────────────────────────────── */}
      <SectionHeader
        eyebrow="03 / Users"
        title="TEAM"
        subtitle="Active operators and administrative role distribution."
      />

      {/* ── Content View ───────────────────────────────────────── */}
      {isError ? (
        <ErrorState
          title="FAILED TO LOAD USERS"
          message="Could not retrieve the organization team roster."
          onRetry={refetch}
        />
      ) : isLoading ? (
        <Table>
          <TableHeader>
            <tr>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Joined</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, i) => (
              <TableRowSkeleton key={i} columns={5} />
            ))}
          </TableBody>
        </Table>
      ) : users.length === 0 ? (
        <EmptyState
          title="NO OPERATORS FOUND"
          description="There are currently no additional registered user accounts."
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </tr>
              </TableHeader>

              <TableBody>
                {users.map((u, idx) => {
                  const isAdmin = u.role === 'ADMIN';
                  return (
                    <TableRow key={u._id || idx}>
                      <TableCell className="w-12 text-[#717171] text-[11px]">
                        {formatIndex(idx + 1)}
                      </TableCell>

                      <TableCell className="font-medium text-[#EEEEEE]">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              'w-7 h-7 flex items-center justify-center font-display text-sm border bg-[#060606]',
                              isAdmin ? 'border-[#FE6A00] text-[#FE6A00]' : 'border-[#222222] text-[#8A8A8A]'
                            )}
                          >
                            {u.name?.charAt(0).toUpperCase()}
                          </span>
                          <span>{u.name}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-[#8A8A8A]">
                        {u.email}
                      </TableCell>

                      <TableCell>
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border bg-[#020202]',
                            isAdmin
                              ? 'border-[#FE6A00] text-[#FE6A00]'
                              : 'border-[#717171] text-[#717171]'
                          )}
                        >
                          {u.role}
                        </span>
                      </TableCell>

                      <TableCell className="text-right text-[#8A8A8A]">
                        {formatDate(u.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {users.map((u, idx) => {
              const isAdmin = u.role === 'ADMIN';
              return (
                <Card key={u._id || idx} className="p-5 space-y-3 font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-[#222222]/40">
                    <span className="text-[10px] text-[#717171] uppercase tracking-widest">
                      Operator {formatIndex(idx + 1)}
                    </span>
                    <span
                      className={cn(
                        'px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border bg-[#020202]',
                        isAdmin
                          ? 'border-[#FE6A00] text-[#FE6A00]'
                          : 'border-[#717171] text-[#717171]'
                      )}
                    >
                      {u.role}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE]">
                      {u.name}
                    </h3>
                    <p className="text-xs text-[#717171] mt-0.5">{u.email}</p>
                  </div>

                  <div className="pt-2 border-t border-[#222222]/30 flex items-center justify-between text-xs text-[#8A8A8A]">
                    <span className="text-[10px] uppercase tracking-wider text-[#717171]">Joined</span>
                    <span>{formatDate(u.createdAt)}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default UsersPage;
