import { FormEvent, useEffect, useRef, useState } from 'react'
import { MdDone, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md'
import { ITask, useUpdateTaskMutation, useDeleteTaskMutation } from '../../../../../slices/endpoints/task'
import styles from './Task.module.sass'

export const Task = ({ task, globalEdit, setGlobalEdit }: { task: ITask, globalEdit: boolean, setGlobalEdit: Function }) => {
  const ref: any = useRef()
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState(task.name)
  // const [newComplete, setNewComplete] = useState(task.complete)
  const [updateTask, { isError: isUpdateError, error: updateError }] = useUpdateTaskMutation()
  const [deleteTask, { isError: isDeleteError, error: deleteError }] = useDeleteTaskMutation()
  const isError = isUpdateError || isDeleteError

  useEffect(() => {
    if (isError && (updateError || deleteError)) {
      alert(((updateError || deleteError) as any).data.message)
    }

    const outerClick = (event: Event) => {
      if (editing && ref.current && !ref.current.contains(event.target)) {
        setEditing(false)
        setGlobalEdit(false)
      }
    }
    document.addEventListener('mousedown', outerClick)
    return () => {
      document.removeEventListener('mousedown', outerClick)
    }
  }, [editing, isError, updateError, deleteError])

  const handleCheckbox = () => {
    updateTask({ uuid: task.uuid, name: task.name, complete: !task.complete })
  }

  const handleUpdate = (event?: FormEvent) => {
    event?.preventDefault()
    if ((task.name === newName) || task.name === '') return
    updateTask({ uuid: task.uuid, name: newName, complete: task.complete })
    setEditing(false)
    setGlobalEdit(false)
  }

  return (
    <div ref={ref} className={styles.task}>
      <section>
      { task.complete
        ? <MdDone
            onClick={() => handleCheckbox()}
            size='24'
             />
        : <MdOutlineCheckBoxOutlineBlank
          onClick={() => handleCheckbox()}
            size='24'/>}
      { editing ? <form onSubmit={(event) => handleUpdate(event)}><input value={newName} onChange={(event) => setNewName(event.target.value)}></input></form> : <h3>{task.name}</h3> }
      </section>
      <section>
        { editing
          ? <>
              <button onClick={() => handleUpdate()}><h3>Update</h3></button>
              <button onClick={() => {
                deleteTask({ uuid: task.uuid })
                setGlobalEdit(false)
              }}><h3>Delete</h3></button>
            </>
          : !globalEdit
              ? <button onClick={() => {
                setEditing(true)
                setGlobalEdit(true)
              }}><h3>Edit</h3>
                </button>
              : <></> }
      </section>
    </div>
  )
}
