import { IList } from '../../../../slices/endpoints/list'
import styles from './DisplayTasks.module.sass'
import { Task } from './components/Task'
import { useState } from 'react'

export const DisplayTasks = ({ list, lists }: { list: string, lists: IList[] }) => {
  const [globalEdit, setGlobalEdit] = useState(false)
  return (
    <div className={styles.display}>
      { lists.find((entry) => entry.uuid === list)?.tasks.map((task) => <Task key={task.uuid} task={task} globalEdit={globalEdit} setGlobalEdit={setGlobalEdit}/>) }
    </div>
  )
}
