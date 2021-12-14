import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { cookies } from '../lib/cookie'
import { IUser } from './endpoints/user'

export interface IApp {
  user: IUser
  listUuid: string | null
}

export const appSlice = createSlice({
  name: 'app',
  initialState: { user: { id: cookies.get('userId') as string || null }, listUuid: null } as IApp,
  reducers: {
    setUser: (state: IApp, action: PayloadAction<IUser>): IApp => {
      cookies.set('userId', action.payload.id, { sameSite: 'strict', path: '/' })
      return {
        ...state,
        user: {
          id: action.payload.id
        }
      }
    },
    logoutUser: (state: IApp): IApp => {
      cookies.remove('userId', { sameSite: 'strict', path: '/' })
      return {
        listUuid: null,
        user: {
          id: null
        }
      }
    },
    setListUuid: (state: IApp, action: PayloadAction<string | null>): IApp => {
      return {
        ...state,
        listUuid: action.payload
      }
    }
  }
})

export const { setUser, logoutUser, setListUuid } = appSlice.actions
