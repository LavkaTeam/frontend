import { Pagination } from '@/components/Pagination/Pagination';
import { BlockingOverlay } from '@/components/ui/BlockingOverlay';
import { Button } from '@/components/ui/Button';
import { useSellerFinancesPage } from './model/useSellerFinancesPage';
import { extractErrorMessage } from '@/utils/error';
import { SellerVerificationNotice } from '../shared/SellerVerificationNotice/SellerVerificationNotice';

import { FinanceFilters } from './components/FinanceFilters';
import { SellerFinancesSkeleton } from './components/SellerFinancesSkeleton';
import { FinanceSummaryCards } from './components/FinanceSummaryCards';
import { FinanceTransactionsTable } from './components/FinanceTransactionsTable';
import { PayoutModal } from './components/PayoutModal';
import { TransactionDetailsDrawer } from './components/TransactionDetailsDrawer';
import styles from './SellerFinances.module.css';

const DownloadIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
    <polyline points='7 10 12 15 17 10'></polyline>
    <line x1='12' y1='15' x2='12' y2='3'></line>
  </svg>
);

const SellerFinances = () => {
  const {
    type,
    status,
    startDate,
    endDate,
    currentPage,
    hasInvalidDateRange,
    summaryQuery,
    transactionsQuery,
    transactionDetailsQuery,
    payoutMutation,
    downloadFinanceReportMutation,
    isSellerNotVerified,
    hasBlockingError,
    availableBalance,
    visibleTransactions,
    totalPages,
    totalItems,
    bankName,
    iban,
    isPayoutModalOpen,
    setIsPayoutModalOpen,
    selectedTransactionId,
    setSelectedTransactionId,
    isTransactionsRefreshing,
    handleTypeChange,
    handleStatusChange,
    handleDateChange,
    handlePageChange,
    handlePayoutSubmit,
    handleReportDownload,
  } = useSellerFinancesPage();

  if (isSellerNotVerified) {
    return (
      <SellerVerificationNotice sectionName='balances, payouts and transaction history'>
        <SellerFinancesSkeleton />
      </SellerVerificationNotice>
    );
  }

  if (summaryQuery.isLoading && !summaryQuery.data) {
    return <SellerFinancesSkeleton />;
  }

  if (hasBlockingError) {
    return (
      <div className={styles.feedbackState}>
        <h3>Failed to load finances</h3>
        <p>
          {extractErrorMessage(
            summaryQuery.error ?? transactionsQuery.error,
            'Please refresh the page and try again.',
          )}
        </p>
      </div>
    );
  }

  return (
    <div
      className={styles.page}
      aria-busy={summaryQuery.isFetching || transactionsQuery.isFetching}
    >
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Finances</h1>
          <p className={styles.subtitle}>
            Track payouts, pending payments, platform fees and transaction
            history.
          </p>
        </div>

        <div className={styles.actions}>
          <Button
            type='button'
            disabled={availableBalance <= 0 || summaryQuery.isLoading}
            onClick={() => setIsPayoutModalOpen(true)}
          >
            Request payout
          </Button>
          <button
            type='button'
            className={styles.downloadButton}
            onClick={handleReportDownload}
            disabled={downloadFinanceReportMutation.isPending}
          >
            <DownloadIcon />
            Download report (.pdf)
          </button>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <FinanceSummaryCards
          summary={summaryQuery.data}
          isLoading={summaryQuery.isLoading}
        />

        <div className={styles.historyColumn}>
          <FinanceFilters
            type={type}
            status={status}
            startDate={startDate}
            endDate={endDate}
            hasInvalidDateRange={hasInvalidDateRange}
            onTypeChange={handleTypeChange}
            onStatusChange={handleStatusChange}
            onStartDateChange={(value) => handleDateChange('startDate', value)}
            onEndDateChange={(value) => handleDateChange('endDate', value)}
          />

          <BlockingOverlay
            active={isTransactionsRefreshing}
            className={styles.transactionsSection}
          >
            <FinanceTransactionsTable
              transactions={visibleTransactions}
              isLoading={transactionsQuery.isLoading}
              totalItems={totalItems}
              onTransactionClick={setSelectedTransactionId}
            />

            {totalPages > 1 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                noPaddings
                disabled={isTransactionsRefreshing}
              />
            ) : null}
          </BlockingOverlay>
        </div>
      </div>

      <PayoutModal
        isOpen={isPayoutModalOpen}
        availableBalance={availableBalance}
        bankName={bankName}
        iban={iban}
        isSubmitting={payoutMutation.isPending}
        onClose={() => setIsPayoutModalOpen(false)}
        onSubmit={handlePayoutSubmit}
      />

      <TransactionDetailsDrawer
        isOpen={Boolean(selectedTransactionId)}
        transaction={transactionDetailsQuery.data}
        isLoading={transactionDetailsQuery.isLoading}
        onClose={() => setSelectedTransactionId(null)}
      />
    </div>
  );
};

export default SellerFinances;
