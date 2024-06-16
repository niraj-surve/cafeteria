import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Product from './pages/Product/Product'
import Cart from './components/Cart/Cart'
import NotFound from './pages/NotFound/NotFound'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/product/:id' element={<Product />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes