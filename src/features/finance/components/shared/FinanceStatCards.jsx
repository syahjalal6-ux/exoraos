import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react'
import StatCard from '../../../dashboard/components/StatCard.jsx'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import Spinner from '../../../../shared/components/ui/Spinner.jsx'

export default function FinanceStatCards({ summary, isLoading }) {
  if (isLoading && !summary) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_,i) => (
        <div key={i} className="bg-white border border-surface-border rounded-xl p-5 shadow-card flex items-center justify-center h-24">
          <Spinner size="md" className="text-ink-faint"/>
        </div>
      ))}
    </div>
  )

  const partialIncome  = summary?.month_partial_income  ?? 0
  const partialExpense = summary?.month_partial_expense ?? 0

  const cards = [
    {
      title:     'Total Income',
      value:     formatCurrency(summary?.total_income ?? 0),
      subtitle:  (
        <span>
          {formatCurrency(summary?.month_income ?? 0)} bulan ini
          {partialIncome > 0 && (
            <span className="block text-amber-500">
              termasuk {formatCurrency(partialIncome)} partial
            </span>
          )}
        </span>
      ),
      icon:      TrendingUp,
      iconColor: 'text-green-600',
      iconBg:    'bg-green-50',
    },
    {
      title:     'Total Expense',
      value:     formatCurrency(summary?.total_expense ?? 0),
      subtitle:  (
        <span>
          {formatCurrency(summary?.month_expense ?? 0)} bulan ini
          {partialExpense > 0 && (
            <span className="block text-amber-500">
              termasuk {formatCurrency(partialExpense)} partial
            </span>
          )}
        </span>
      ),
      icon:      TrendingDown,
      iconColor: 'text-red-600',
      iconBg:    'bg-red-50',
    },
    {
      title:     'Net Profit',
      value:     formatCurrency(summary?.net_profit ?? 0),
      subtitle:  (
        <span>
          {formatCurrency(summary?.month_profit ?? 0)} bulan ini
          {(partialIncome > 0 || partialExpense > 0) && (
            <span className="block text-amber-500">
              termasuk transaksi partial
            </span>
          )}
        </span>
      ),
      icon:      DollarSign,
      iconColor: (summary?.net_profit ?? 0) >= 0 ? 'text-brand-600' : 'text-red-600',
      iconBg:    (summary?.net_profit ?? 0) >= 0 ? 'bg-brand-50'    : 'bg-red-50',
    },
    {
      title:     'Belum Lunas',
      value:     formatCurrency((summary?.unpaid_income ?? 0) + (summary?.unpaid_expense ?? 0)),
      subtitle:  'Total unpaid',
      icon:      AlertCircle,
      iconColor: 'text-amber-600',
      iconBg:    'bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(c => <StatCard key={c.title} {...c} isLoading={false}/>)}
    </div>
  )
}
