import { configureStore } from '@reduxjs/toolkit'
import { appSlice } from '../slices/app'
import { apiSlice } from '../slices/api'

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
