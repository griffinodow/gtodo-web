import { useState } from 'react'
import { IList } from '../../../../../slices/endpoints/list'
import { List } from './components/List'
import styles from './DisplayLists.module.sass'

export const DisplayLists = ({ lists }: { lists: IList[] }) => {
  const [globalEdit, setGlobalEdit] = useState(false)
  return (
    <div className={styles.display}>
      { lists.map(list => <List key={list.uuid} list={list} globalEdit={globalEdit} setGlobalEdit={setGlobalEdit}/>) }
    </div>
  )
}
