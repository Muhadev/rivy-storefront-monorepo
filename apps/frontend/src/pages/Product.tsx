import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export default function Product() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => (await api.get('/products/' + id)).data
  })
  if (!id) return null
  if (isLoading) return <div>Loading product...</div>
  if (error) return <div>Error loading product</div>
  const p = data
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <img src={p.imageUrl || 'https://via.placeholder.com/600x400'} className="w-full rounded-2xl" />
      <div>
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <p className="text-gray-600 mt-2">{p.description}</p>
        <div className="text-xl font-semibold mt-4">${p.price}</div>
        <Link to="/cart" className="btn btn-primary mt-4">Go to Cart</Link>
      </div>
    </div>
  )
}
