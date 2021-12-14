import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../lib/redux'
import { Login } from './pages/login/Login'
import { Home } from './pages/home/Home'
import './style.sass'
import './themes.sass'

function App () {
  const uid = useSelector((state: RootState) => state.app.user.id)
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={ uid ? <Home uid={uid}/> : <Navigate to='/login'/> }/>
          <Route path='/login' element={ !uid ? <Login/> : <Navigate to='/'/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
