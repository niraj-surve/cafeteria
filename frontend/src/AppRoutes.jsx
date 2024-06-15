import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Coffee from './pages/Coffee/Coffee'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/coffee/:id' element={<Coffee />} />
    </Routes>
  )
}

export default AppRoutes