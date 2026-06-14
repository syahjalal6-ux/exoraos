import apiClient from '../../../shared/lib/axios.js'
import { supabase } from '../../../shared/lib/supabaseClient.js'
import { createCrudAdapter, isSupabase } from '../../../shared/lib/crudAdapter.js'

const adapter = createCrudAdapter({
  table: 'transactions',
  gas: {
    getAll: 'finance.getTransactions',
    getById: 'finance.getTransaction',
    create: 'finance.createTransaction',
    update: 'finance.updateTransaction',
    remove: 'finance.deleteTransaction',
  },
  order: { column: 'date', ascending: false },
})

export const fetchTransactions      = () => adapter.getAll()
export const fetchTransactionById   = (id) => adapter.getById(id)
export const createTransaction      = (data) => adapter.create({ ...data, amount: Number(data.amount) || 0 })
export const updateTransaction      = (id, data) => adapter.update(id, { ...data, amount: data.amount !== undefined ? Number(data.amount) || 0 : undefined })
export const deleteTransaction      = (id) => adapter.remove(id)
export const bulkCreateTransactions = (rows) => adapter.bulkCreate(rows.map(r => ({ ...r, amount: Number(r.amount) || 0 })))

export async function fetchFinanceSummary() {
  if (isSupabase()) {
    const { data: all, error } = await supabase.from('transactions').select('*').limit(10000)
    if (error) throw new Error(error.message)

    const income  = all.filter(t => t.type === 'income')
    const expense = all.filter(t => t.type === 'expense')
    const sum = (arr) => arr.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)

    // Paid only
    const paidIncome  = income.filter(t => t.status === 'paid')
    const paidExpense = expense.filter(t => t.status === 'paid')

    // Partial only
    const partialIncome  = income.filter(t => t.status === 'partial')
    const partialExpense = expense.filter(t => t.status === 'partial')

    // Paid + partial (exclude unpaid)
    const activeIncome  = income.filter(t => t.status !== 'unpaid')
    const activeExpense = expense.filter(t => t.status !== 'unpaid')

    const totalIncome  = sum(activeIncome)
    const totalExpense = sum(activeExpense)

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const inMonth = (t) => new Date(t.date) >= monthStart

    const monthIncome        = sum(activeIncome.filter(inMonth))
    const monthExpense       = sum(activeExpense.filter(inMonth))
    const monthPaidIncome    = sum(paidIncome.filter(inMonth))
    const monthPaidExpense   = sum(paidExpense.filter(inMonth))
    const monthPartialIncome  = sum(partialIncome.filter(inMonth))
    const monthPartialExpense = sum(partialExpense.filter(inMonth))

    const unpaidIncome  = sum(income.filter(t => t.status === 'unpaid'))
    const unpaidExpense = sum(expense.filter(t => t.status === 'unpaid'))

    // Dominant year for trend
    const years = all.map(t => new Date(t.date).getFullYear()).filter(Boolean)
    const minYear = years.length ? Math.min(...years) : now.getFullYear()
    const maxYear = years.length ? Math.max(...years) : now.getFullYear()
    const yearCounts = {}
    all.forEach(t => {
      const y = new Date(t.date).getFullYear()
      yearCounts[y] = (yearCounts[y] || 0) + 1
    })
    const dominantYear = Object.keys(yearCounts).sort((a, b) => yearCounts[b] - yearCounts[a])[0]
    const trendYear = parseInt(dominantYear || now.getFullYear())

    // Trend: breakdown paid vs partial per bulan
    const trend = []
    for (let m = 0; m < 12; m++) {
      const inThisMonth = (t) => {
        const td = new Date(t.date)
        return td.getFullYear() === trendYear && td.getMonth() === m
      }
      const label       = new Date(trendYear, m, 1).toLocaleString('id-ID', { month: 'short', year: '2-digit' })
      const inc         = sum(activeIncome.filter(inThisMonth))
      const exp         = sum(activeExpense.filter(inThisMonth))
      const paidInc     = sum(paidIncome.filter(inThisMonth))
      const paidExp     = sum(paidExpense.filter(inThisMonth))
      const partialInc  = sum(partialIncome.filter(inThisMonth))
      const partialExp  = sum(partialExpense.filter(inThisMonth))
      trend.push({ label, income: inc, expense: exp, paid_income: paidInc, paid_expense: paidExp, partial_income: partialInc, partial_expense: partialExp })
    }

    return {
      total_income:          totalIncome,
      total_expense:         totalExpense,
      net_profit:            totalIncome - totalExpense,
      month_income:          monthIncome,
      month_expense:         monthExpense,
      month_profit:          monthIncome - monthExpense,
      month_paid_income:     monthPaidIncome,
      month_paid_expense:    monthPaidExpense,
      month_partial_income:  monthPartialIncome,
      month_partial_expense: monthPartialExpense,
      unpaid_income:         unpaidIncome,
      unpaid_expense:        unpaidExpense,
      trend,
      trend_year: trendYear,
      min_year:   minYear,
      max_year:   maxYear,
    }
  }

  return (await apiClient.post('', { action: 'finance.getSummary', payload: {} })).data.data
}
