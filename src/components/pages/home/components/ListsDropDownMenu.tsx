import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../../lib/redux'
import { useGetListsQuery, useCreateListMutation } from '../../../../slices/endpoints/list'
import { setListUuid } from '../../../../slices/app'
import styles from './ListsDropDownMenu.module.sass'
import { useEffect, useState, useRef, FormEvent } from 'react'
import { MdAdd, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'
import { v4 as uuidv4 } from 'uuid'
import { DisplayLists } from './components/DisplayLists'

export const ListsDropDownMenu = () => {
  const ref: any = useRef()
  const dispatch = useDispatch()
  const [menuOpen, setMenuOpen] = useState(false)
  const lid = useSelector((state: RootState) => state.app.listUuid)
  const { data: lists } = useGetListsQuery()
  const [createList, { isError, error }] = useCreateListMutation()
  const [listName, setListName] = useState('')

  useEffect(() => {
    if (isError && error) {
      alert((error as any).data.message)
    }
    const checkIfClickedOutside = (event: Event) => {
      if (menuOpen && ref.current && !ref.current.contains(event.target)) {
        setMenuOpen(false)
        setListName('')
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [isError, error, menuOpen])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (listName.length === 0) return
    const uuid = uuidv4()
    createList({ name: listName, uuid })
    setMenuOpen(false)
    dispatch(setListUuid(uuid))
    setListName('')
  }

  return (
    <div ref={ref} className={styles.wrapper}>
      <button className={`${styles.button} surface`} onClick={() => setMenuOpen(!menuOpen)}>
        <h3>{ (lid && lists) ? lists.find((list) => list.uuid === lid)?.name || 'Create a list' : 'Create a list' }</h3>
        { menuOpen ? <MdOutlineKeyboardArrowUp size={24}/> : <MdOutlineKeyboardArrowDown size={24}/> }
      </button>
      {
        menuOpen &&
          <div className={`${styles.menu} surface`}>
            { lists && lists.length > 0 && <DisplayLists lists={lists} /> }
            <form onSubmit={(event) => handleSubmit(event)}>
              <input placeholder='Add a list' value={listName} onChange={(event) => setListName(event.target.value)}></input>
              <button type='submit'><MdAdd size={24}/></button>
            </form>
          </div>
      }
    </div>
  )
}
