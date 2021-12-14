import { apiSlice } from '../api'
import { gql } from 'graphql-request'
import { current } from '@reduxjs/toolkit'
import { ITask } from './task'
import { RootState, store } from '../../lib/redux'
import { setListUuid } from '../app'

export interface IList {
  uuid: string
  name: string
  tasks: ITask[]
}

export const listApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createList: builder.mutation<IList, { name: string, uuid: string }>({
      query: ({ name, uuid }) => ({
        body: gql`
          mutation {
            createList(name: "${name}", uuid: "${uuid}") {
              uuid
              name
            }
          }
        `
      }),
      async onQueryStarted ({ name, uuid }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          listApi.util.updateQueryData('getLists', undefined, (draft) => {
            const list: IList = {
              uuid,
              name,
              tasks: []
            }
            draft.push(list)
          }))
        const listUuid = (store.getState() as RootState).app.listUuid
        if (!listUuid) store.dispatch(setListUuid(uuid))
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      transformResponse: (response) => response.list
    }),
    getLists: builder.query<IList[], void>({
      query: () => ({
        body: gql`
          query {
            lists {
              uuid
              name
              tasks {
                uuid
                name
                complete
              }
            }
          }
        `
      }),
      transformResponse: (response) => {
        const listUuid = (store.getState() as RootState).app.listUuid
        if (response.lists.length > 0 && !listUuid) {
          store.dispatch(setListUuid(response.lists[0].uuid))
        }
        return response.lists
      },
      providesTags: ['Lists']
    }),
    updateList: builder.mutation<boolean, { uuid: string, name: string }>({
      query: ({ name, uuid }) => ({
        body: gql`
          mutation {
            updateList(uuid: "${uuid}", name: "${name}") {
              uuid
              name
            }
          }
        `
      }),
      async onQueryStarted ({ uuid, name }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          listApi.util.updateQueryData('getLists', undefined, (draft) => {
            const index = current(draft).findIndex(entry => entry.uuid === uuid)
            draft[index].name = name
          }))
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      transformResponse: (response) => response.list
    }),
    deleteList: builder.mutation<boolean, { uuid: string }>({
      query: ({ uuid }) => ({
        body: gql`
          mutation {
            deleteList(uuid: "${uuid}")
          }
        `
      }),
      async onQueryStarted ({ uuid }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          listApi.util.updateQueryData('getLists', undefined, (draft) => {
            const index = current(draft).findIndex(entry => entry.uuid === uuid)
            draft.splice(index, 1)
          }))

        const listUuid = (store.getState() as RootState).app.listUuid
        const lists: Array<IList> = (store.getState() as RootState).api.queries['getLists(undefined)']?.data as Array<IList>
        if (listUuid === uuid && lists && lists.length > 0) {
          store.dispatch(setListUuid(lists[lists.length - 1].uuid))
        } else if (listUuid === uuid) {
          store.dispatch(setListUuid(null))
        }
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      transformResponse: (response) => response.list
    })
  }),
  overrideExisting: false
})

export const { useCreateListMutation, useGetListsQuery, useUpdateListMutation, useDeleteListMutation } = listApi
