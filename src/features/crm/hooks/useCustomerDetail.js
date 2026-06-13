import { useEffect, useCallback } from 'react'
import { useCrmStore } from '../store/crmStore.js'
import { fetchCustomerById } from '../services/customerService.js'
export function useCustomerDetail(id) {
  const {activeCustomer,setActiveCustomer,setLoading,setError,isLoading} = useCrmStore()
  const load = useCallback(async()=>{if(!id)return;setLoading(true);try{setActiveCustomer(await fetchCustomerById(id))}catch(e){setError(e.message)}},[id,setActiveCustomer,setLoading,setError])
  useEffect(()=>{load();return()=>setActiveCustomer(null)},[id])
  return {customer:activeCustomer,isLoading,reload:load}
}
