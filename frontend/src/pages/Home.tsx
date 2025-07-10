import { useEffect } from 'react'
import toast from 'react-hot-toast'

const Home = () => {
  useEffect(() => {
    toast.success('Hello world!')
  })

  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

export default Home
