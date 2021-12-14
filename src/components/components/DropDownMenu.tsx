import { useEffect, useRef, useState } from 'react'
import styles from './DropDownMenu.module.sass'

interface IDropDownMenu {
  menuButtonIcon: any,
  dropdownButtons: any[]
}

export const DropDownMenu = ({ menuButtonIcon, dropdownButtons }: IDropDownMenu) => {
  const ref: any = useRef()
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const checkIfClickedOutside = (event: Event) => {
      if (menuOpen && ref.current && !ref.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [menuOpen])

  return (
    <div ref={ref} className={styles.wrapper}>
      <button onClick={(event) => {
        event.preventDefault()
        setMenuOpen(!menuOpen)
        event.stopPropagation()
      }}>{ menuButtonIcon }</button>
      {
        menuOpen &&
          <div className={`${styles.menu} surface`}>
          { dropdownButtons.map(button => button) }
          </div>
      }
    </div>
  )
}
