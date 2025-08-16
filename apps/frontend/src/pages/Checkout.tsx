import { useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const nav = useNavigate()
  const mutate = useMutation({
    mutationFn: (payload: any) => api.post('/checkout', payload).then(r => r.data),
    onSuccess: (data) => nav('/confirm/'+data.orderId)
  })

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Checkout Summary</h2>
      <p className="text-sm text-gray-600 mb-4">This simulates a checkout by sending a list of items.</p>
      <button className="btn btn-primary" onClick={() => mutate.mutate({ items: [{ productId: 1, quantity: 1 }] })}>
        Simulate Checkout
      </button>
    </div>
  )
}
