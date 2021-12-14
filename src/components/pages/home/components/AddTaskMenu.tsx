import { FormEvent, useEffect, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { useCreateTaskMutation } from '../../../../slices/endpoints/task'
import { v4 as uuidv4 } from 'uuid'

import styles from './AddTaskMenu.module.sass'

export const AddTaskMenu = ({ list }: { list: string }) => {
  const [name, setName] = useState('')
  const [createTask, { isError, error }] = useCreateTaskMutation()

  useEffect(() => {
    if (isError && error) {
      alert((error as any).data.message)
    }
  }, [isError, error])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (name === '') return
    createTask({ list, uuid: uuidv4(), name })
    setName('')
  }

  return (
    <div className={styles.taskmenu}>
      <form className='surface' onSubmit={(event) => handleSubmit(event)}>
        <input value={name} placeholder='Create a task' onChange={(event) => setName(event.target.value)}></input>
        <button type='submit'><MdAdd size={24}/></button>
      </form>
    </div>
  )
}
