import styles from './Home.module.sass'
import { DropDownMenu } from '../../components/DropDownMenu'
import { MdOutlineMoreVert } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../../slices/app'
import { ListsDropDownMenu } from './components/ListsDropDownMenu'
import { AddTaskMenu } from './components/AddTaskMenu'
import { RootState } from '../../../lib/redux'
import { DisplayTasks } from './components/DisplayTasks'
import { useGetListsQuery } from '../../../slices/endpoints/list'
import { apiSlice } from '../../../slices/api'

export const Home = ({ uid }: { uid: string }) => {
  const dispatch = useDispatch()
  const lid = useSelector((state: RootState) => state.app.listUuid)
  const { data: lists } = useGetListsQuery()

  return (
    <main className={styles.home}>
      <header className={`${styles.header} surface`}>
        <section>
          <h2>{uid.slice(0, 3) + ' ' + uid.slice(3, 6)}</h2>
          <DropDownMenu menuButtonIcon={<MdOutlineMoreVert size={24}/>} dropdownButtons={[<button key={1} onClick={() => {
            dispatch(apiSlice.util.resetApiState())
            dispatch(logoutUser())
          }}><h3>Logout</h3></button>]}/>
        </section>
        <section>
          <ListsDropDownMenu />
        </section>
      </header>
      { lid && lists && <DisplayTasks list={lid} lists={lists}/> }
      { lid && <AddTaskMenu list={lid}/> }
    </main>
  )
}
