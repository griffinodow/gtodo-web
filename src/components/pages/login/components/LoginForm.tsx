import { skipToken } from '@reduxjs/toolkit/dist/query'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useGetUserQuery } from '../../../../slices/endpoints/user'
import { setUser } from '../../../../slices/app'
import { FlatButton } from '../../../components/FlatButton'
import { FlatInput } from '../../../components/FlatInput'
import styles from './LoginForm.module.sass'

export const LoginForm = ({ loading, setLoading }: { loading: boolean, setLoading: Function }) => {
  const dispatch = useDispatch()
  const [userInput, setUserInput] = useState('')
  const [userSubmit, setUserSubmit] = useState<string>()
  const { data, isLoading, isError, error } = useGetUserQuery(userSubmit || skipToken)

  useEffect(() => {
    if (data) {
      dispatch(setUser(data))
      setUserInput('')
    }
    if (isLoading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
    if (isError) {
      setLoading(false)
      error ? alert((error as any).data.message) : alert('An error occured')
    }
  }, [data, isLoading, isError, error])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const value = event.target.value.replaceAll(' ', '').toUpperCase()
    if (!(value.length <= 6)) return
    setUserInput(value)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setUserSubmit(userInput)
  }

  return loading
    ? <></>
    : <form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
        <FlatInput value={userInput} placeholder='Previous ID' onChange={(event) => handleChange(event)}/>
        <FlatButton type='submit'>Login</FlatButton>
      </form>
}
