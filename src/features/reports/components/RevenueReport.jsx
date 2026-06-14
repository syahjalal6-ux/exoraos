import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Legend,PieChart,Pie,Cell } from 'recharts'
import { formatCurrency } from '../../dashboard/utils/dashboardHelpers.js'
import { formatCurrencyShort,objectToChartData } from '../utils/reportsHelpers.js'
import Spinner from '../../../shared/components/ui/Spinner.jsx'
import { cn } from '../../../shared/utils/cn.js'

const PIE_COLORS = ['#4f46e5','#16a34a','#f59e0b','#ec4899','#8b5cf6','#06b6d4','#f97316']

function Tooltip12({ active, payload, label }) {
  if (!active || !payload?.length) return null

  const income  = payload.find(p => p.dataKey === 'income')
  const expense = payload.find(p => p.dataKey === 'expense')
  const data    = payload[0]?.payload ?? {}

  const paidInc    = data.paid_income     ?? 0
  const paidExp    = data.paid_expense    ?? 0
  const partialInc = data.partial_income  ?? 0
  const partialExp = data.partial_expense ?? 0

  return (
    <div className="bg-white border border-surface-border rounded-xl px-3 py-2 shadow-modal text-xs min-w-[180px]">
      <p className="text-ink-muted font-semibold mb-2">{label}</p>

      {income && (
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-600"/>
            <span className="text-ink-muted">Income:</span>
            <span className="font-bold text-ink ml-auto">{formatCurrencyShort(income.value)}</span>
          </div>
          {paidInc > 0 && (
            <div className="flex items-center gap-2 mb-0.5 pl-4">
              <span className="text-ink-faint">paid:</span>
              <span className="text-ink-faint ml-auto">{formatCurrencyShort(paidInc)}</span>
            </div>
          )}
          {partialInc > 0 && (
            <div className="flex items-center gap-2 pl-4">
              <span className="text-amber-500">partial:</span>
              <span className="text-amber-500 ml-auto">{formatCurrencyShort(partialInc)}</span>
            </div>
          )}
        </div>
      )}

      {expense && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"/>
            <span className="text-ink-muted">Expense:</span>
            <span className="font-bold text-ink ml-auto">{formatCurrencyShort(expense.value)}</span>
          </div>
          {paidExp > 0 && (
            <div className="flex items-center gap-2 mb-0.5 pl-4">
              <span className="text-ink-faint">paid:</span>
              <span className="text-ink-faint ml-auto">{formatCurrencyShort(paidExp)}</span>
            </div>
          )}
          {partialExp > 0 && (
            <div className="flex items-center gap-2 pl-4">
              <span className="text-amber-500">partial:</span>
              <span className="text-amber-500 ml-auto">{formatCurrencyShort(partialExp)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function RevenueReport({ data, isLoading }) {
  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
  if (!data) return null

  const categoryData = objectToChartData(data.by_category)

  const partialIncome  = data.month_partial_income  ?? 0
  const partialExpense = data.month_partial_expense ?? 0

  const kpis = [
    {
      label: 'Total Income',
      value: formatCurrency(data.total_income),
      color: 'text-green-600',
      sub:   null,
    },
    {
      label: 'Total Expense',
      value: formatCurrency(data.total_expense),
      color: 'text-red-600',
      sub:   null,
    },
    {
      label: 'Net Profit',
      value: formatCurrency(data.net_profit),
      color: data.net_profit >= 0 ? 'text-brand-600' : 'text-red-600',
      sub:   null,
    },
    {
      label: 'Profit Margin',
      value: data.profit_margin + '%',
      color: 'text-purple-600',
      sub:   null,
    },
    {
      label: 'Income Bulan Ini',
      value: formatCurrency(data.month_income),
      color: 'text-green-600',
      sub:   partialIncome > 0 ? `termasuk ${formatCurrencyShort(partialIncome)} partial` : null,
    },
    {
      label: 'Expense Bulan Ini',
      value: formatCurrency(data.month_expense),
      color: 'text-red-600',
      sub:   partialExpense > 0 ? `termasuk ${formatCurrencyShort(partialExpense)} partial` : null,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-white border border-surface-border rounded-xl p-4 shadow-card">
            <p className="text-2xs text-ink-faint mb-1 font-medium uppercase tracking-wide">{k.label}</p>
            <p className={cn('text-base font-bold', k.color)}>{k.value}</p>
            {k.sub && <p className="text-2xs text-amber-500 mt-0.5">{k.sub}</p>}
          </div>
        ))}
      </div>

      <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
        <h4 className="text-sm font-bold text-ink mb-4">Tren 12 Bulan</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.monthly_trend} margin={{top:4,right:4,left:0,bottom:0}} barSize={12} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="label" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} width={40}
              tickFormatter={v=>v>=1_000_000?(v/1_000_000).toFixed(0)+'M':v>=1_000?(v/1_000).toFixed(0)+'K':v}/>
            <Tooltip content={<Tooltip12/>} cursor={{fill:'#f8fafc'}}/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:'11px',paddingTop:'8px'}}/>
            <Bar dataKey="income"  name="Income"  fill="#16a34a" radius={[3,3,0,0]}/>
            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {categoryData.length > 0 && (
        <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
          <h4 className="text-sm font-bold text-ink mb-4">Income by Category</h4>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                  {categoryData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={v => formatCurrencyShort(v)}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {categoryData.map((d,i) => (
                <div key={d.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:PIE_COLORS[i%PIE_COLORS.length]}}/>
                    <span className="text-xs text-ink font-medium">{d.label}</span>
                  </div>
                  <span className="text-xs font-bold text-ink">{formatCurrencyShort(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
