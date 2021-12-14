import { useState } from 'react'
import { MdSync } from 'react-icons/md'
import { RegisterForm } from './components/RegisterForm'
import { LoginForm } from './components/LoginForm'
import styles from './Login.module.sass'

export const Login = () => {
  const [loading, setLoading] = useState(false)
  return (
    <main className={styles.login}>
      <section className={styles.section}>
        <h1>G-TODO</h1>
        <span>Login with a previously generated ID or create a new one</span>
      </section>
      <section className={styles.section}>
        <LoginForm loading={loading} setLoading={setLoading}/>
        <RegisterForm loading={loading} setLoading={setLoading}/>
        { loading && <MdSync className='spin' size={36}/> }
      </section>
    </main>
  )
}
