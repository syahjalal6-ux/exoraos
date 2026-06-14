import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Legend } from 'recharts'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import Spinner from '../../../../shared/components/ui/Spinner.jsx'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  const income  = payload.find(p => p.dataKey === 'income')
  const expense = payload.find(p => p.dataKey === 'expense')
  const data    = payload[0]?.payload ?? {}

  const partialInc = data.partial_income  ?? 0
  const partialExp = data.partial_expense ?? 0
  const paidInc    = data.paid_income     ?? 0
  const paidExp    = data.paid_expense    ?? 0

  return (
    <div className="bg-white border border-surface-border rounded-xl px-3 py-2 shadow-modal text-xs min-w-[180px]">
      <p className="text-ink-muted font-semibold mb-2">{label}</p>

      {income && (
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-600"/>
            <span className="text-ink-muted">Income:</span>
            <span className="font-bold text-ink ml-auto">{formatCurrency(income.value)}</span>
          </div>
          {paidInc > 0 && (
            <div className="flex items-center gap-2 mb-0.5 pl-4">
              <span className="text-ink-faint">paid:</span>
              <span className="text-ink-faint ml-auto">{formatCurrency(paidInc)}</span>
            </div>
          )}
          {partialInc > 0 && (
            <div className="flex items-center gap-2 pl-4">
              <span className="text-amber-500">partial:</span>
              <span className="text-amber-500 ml-auto">{formatCurrency(partialInc)}</span>
            </div>
          )}
        </div>
      )}

      {expense && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"/>
            <span className="text-ink-muted">Expense:</span>
            <span className="font-bold text-ink ml-auto">{formatCurrency(expense.value)}</span>
          </div>
          {paidExp > 0 && (
            <div className="flex items-center gap-2 mb-0.5 pl-4">
              <span className="text-ink-faint">paid:</span>
              <span className="text-ink-faint ml-auto">{formatCurrency(paidExp)}</span>
            </div>
          )}
          {partialExp > 0 && (
            <div className="flex items-center gap-2 pl-4">
              <span className="text-amber-500">partial:</span>
              <span className="text-amber-500 ml-auto">{formatCurrency(partialExp)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function FinanceChart({ trend, isLoading }) {
  if (isLoading) return (
    <div className="h-52 flex items-center justify-center">
      <Spinner size="lg" className="text-ink-faint"/>
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={208}>
      <BarChart data={trend} margin={{top:4,right:4,left:0,bottom:0}} barSize={14} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
        <XAxis dataKey="label" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
        <YAxis
          tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} width={44}
          tickFormatter={v=>v>=1_000_000?(v/1_000_000).toFixed(0)+'M':v>=1_000?(v/1_000).toFixed(0)+'K':v}
        />
        <Tooltip content={<CustomTooltip/>} cursor={{fill:'#f8fafc'}}/>
        <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:'11px',paddingTop:'12px'}}/>
        <Bar dataKey="income"  name="Income"  fill="#16a34a" radius={[4,4,0,0]}/>
        <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4,4,0,0]}/>
      </BarChart>
    </ResponsiveContainer>
  )
}
