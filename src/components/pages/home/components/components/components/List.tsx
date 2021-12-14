import { IList, useUpdateListMutation, useDeleteListMutation } from '../../../../../../slices/endpoints/list'
import { setListUuid } from '../../../../../../slices/app'
import styles from './List.module.sass'
import { useDispatch } from 'react-redux'
import { FormEvent, useEffect, useRef, useState } from 'react'

export const List = ({ list, globalEdit, setGlobalEdit }: { list: IList, globalEdit: boolean, setGlobalEdit: Function }) => {
  const ref: any = useRef()
  const dispatch = useDispatch()
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState(list.name)
  const [updateList, { isError: updateIE, error: updateError }] = useUpdateListMutation()
  const [deleteList, { isError: deleteIE, error: deleteError }] = useDeleteListMutation()
  const isError = updateIE || deleteIE

  useEffect(() => {
    if (isError) {
      alert(alert(((updateError || deleteError) as any).data.message))
    }
    const checkIfClickedOutside = (event: Event) => {
      if (editing && ref.current && !ref.current.contains(event.target)) {
        setEditing(false)
        setGlobalEdit(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [editing, isError, updateError, deleteError])

  const handleSubmit = (event?: FormEvent) => {
    event && event.preventDefault()
    setEditing(false)
    setGlobalEdit(false)
    if (newName === '' || newName === list.name) return
    updateList({ uuid: list.uuid, name: newName })
  }

  return (
    <div ref={ref} className={styles.list}>
      <section>
        { editing ? <form onSubmit={(event) => handleSubmit(event)}><input value={newName} onChange={(event) => setNewName(event.target.value)}></input></form> : <button onClick={() => dispatch(setListUuid(list.uuid))}><h3>{list.name}</h3></button> }
      </section>
      <section>
        { editing
          ? <>
              <button onClick={() => handleSubmit()}><h3>Update</h3></button>
              <button onClick={() => {
                deleteList({ uuid: list.uuid })
                setGlobalEdit(false)
              }}><h3>Delete</h3></button>
            </>
          : !globalEdit
              ? <button onClick={() => {
                setEditing(true)
                setGlobalEdit(true)
              }}><h3>Edit</h3></button>
              : <></>
        }
      </section>
    </div>
  )
}
