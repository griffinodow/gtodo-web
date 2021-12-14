import { FlatButton } from '../../../components/FlatButton'
import { FormEvent, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useCreateUserMutation } from '../../../../slices/endpoints/user'
import { setUser } from '../../../../slices/app'
import styles from './RegisterForm.module.sass'

export const RegisterForm = ({ loading, setLoading }: { loading: boolean, setLoading: Function }) => {
  const dispatch = useDispatch()
  const [createUser, { data, isLoading, isError, error }] = useCreateUserMutation()

  useEffect(() => {
    if (data) dispatch(setUser(data))
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    createUser()
  }

  return loading
    ? <></>
    : <form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
        <FlatButton type='submit'>New ID</FlatButton>
      </form>
}
