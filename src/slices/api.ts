import { createApi } from '@reduxjs/toolkit/query/react'
import { request, ClientError } from 'graphql-request'
import { store, RootState } from '../lib/redux'

const graphqlBaseQuery =
  ({ baseUrl }: { baseUrl: string }) =>
    async ({ body }: { body: string }): Promise<any> => {
      try {
        const token: string | null = (store.getState() as RootState).app.user.id
        let requestHeaders
        if (token) {
          requestHeaders = { authorization: `Bearer ${token}` }
        }
        const result = await request(baseUrl, body, undefined, requestHeaders)
        return { data: result }
      } catch (error) {
        if (error instanceof ClientError) {
          return { error: { status: error.response.status, data: error } }
        }
        return { error: { status: 500, data: error } }
      }
    }

export const apiSlice = createApi({
  baseQuery: graphqlBaseQuery({ baseUrl: 'https://graph.g-todo.griffindow.com/' }),
  tagTypes: ['Lists'],
  endpoints: () => ({})
})
