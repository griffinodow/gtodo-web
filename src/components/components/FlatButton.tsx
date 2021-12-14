import { MouseEventHandler } from 'react'
import styles from './FlatButton.module.sass'

interface IFlatButton {
  children?: any
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
  buttonStyle?: any
  buttonSize?: number
}

export const FlatButton = ({ children, type, onClick }: IFlatButton) => {
  return (
    <button className={styles.button} onClick={onClick} type={type} >
      {children}
    </button>
  )
}
