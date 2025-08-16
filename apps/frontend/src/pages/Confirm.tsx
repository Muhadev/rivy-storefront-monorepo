import { useParams, Link } from 'react-router-dom'

export default function Confirm() {
  const { id } = useParams()
  return (
    <div className="card text-center">
      <h1 className="text-2xl font-bold">Order Confirmed</h1>
      <p className="text-gray-600 mt-2">Your order #{id} has been placed.</p>
      <Link to="/" className="btn btn-primary mt-4">Back to Store</Link>
    </div>
  )
}
