import { ChangeEventHandler } from 'react'
import style from './FlatInput.module.sass'

interface IFlatInput {
  placeholder?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  value?: string | number
}

export const FlatInput = ({ placeholder, onChange, value }: IFlatInput) => {
  return (
    <input className={style.input} onChange={onChange} placeholder={placeholder} value={value}></input>
  )
}
