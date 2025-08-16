import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../lib/api'

export default function Cart() {
  const cart = useQuery({ queryKey: ['cart'], queryFn: async () => (await api.get('/cart')).data })
  const update = useMutation({ mutationFn: (payload: any) => api.patch('/cart/items', payload).then(r => r.data), onSuccess: () => cart.refetch() })
  const remove = useMutation({ mutationFn: (id: number) => api.delete('/cart/items/'+id).then(r => r.data), onSuccess: () => cart.refetch() })

  if (cart.isLoading) return <div>Loading cart...</div>
  if (cart.error) return <div>Error loading cart</div>
  const items = cart.data.items || []
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Cart</h2>
      {items.length === 0 ? <div>Cart is empty</div> : (
        <ul className="space-y-2">
          {items.map((it: any) => (
            <li key={it.productId} className="flex items-center gap-3">
              <div className="flex-1">Product #{it.productId}</div>
              <input type="number" min={1} className="input w-24" value={it.quantity} onChange={(e) => update.mutate({ productId: it.productId, quantity: Number(e.target.value) })}/>
              <button className="btn" onClick={() => remove.mutate(it.productId)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
