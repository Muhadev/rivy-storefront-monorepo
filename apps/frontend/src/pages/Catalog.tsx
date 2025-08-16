import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export default function Catalog() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const page = Number(params.get('page') || '1')

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', q, page],
    queryFn: async () => (await api.get('/products', { params: { q, page, limit: 12 } })).data
  })

  if (isLoading) return <div>Loading products...</div>
  if (error) return <div>Error loading products</div>

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {data.items.map((p: any) => (
        <div className="card" key={p.id}>
          <img src={p.imageUrl || 'https://via.placeholder.com/400x250'} alt="" className="w-full h-40 object-cover rounded-lg" />
          <div className="mt-2 font-semibold">{p.name}</div>
          <div className="text-sm text-gray-500">${p.price}</div>
          <Link to={`/product/${p.id}`} className="btn btn-primary mt-2">View</Link>
        </div>
      ))}
    </div>
  )
}
