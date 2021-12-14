import { apiSlice } from '../api'
import { gql } from 'graphql-request'
import { current } from '@reduxjs/toolkit'
import { RootState, store } from '../../lib/redux'
import { listApi } from './list'

export interface ITask {
  uuid: string
  name: string
  complete: boolean
}

export const taskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation<boolean, {list: string, uuid: string, name: string }>({
      query: ({ list, uuid, name }) => ({
        body: gql`
          mutation {
            createTask(list: "${list}", uuid: "${uuid}", name: "${name}", complete: false) {
              uuid
            }
          }
        `
      }),
      async onQueryStarted ({ list, uuid, name }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          listApi.util.updateQueryData('getLists', undefined, (draft) => {
            const index = current(draft).findIndex(entry => entry.uuid === list)
            const task = {
              uuid: uuid,
              name,
              complete: false
            }
            draft[index].tasks.push(task)
          }))
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      transformResponse: (response) => response.task
    }),
    updateTask: builder.mutation<boolean, { uuid: string, name: string, complete: boolean }>({
      query: ({ uuid, name, complete }) => ({
        body: gql`
          mutation {
            updateTask(uuid: "${uuid}", name: "${name}", complete: ${complete}) {
              uuid
            }
          }
        `
      }),
      async onQueryStarted ({ uuid, name, complete }, { dispatch, queryFulfilled }) {
        const listUuid = (store.getState() as RootState).app.listUuid
        const patchResult = dispatch(
          listApi.util.updateQueryData('getLists', undefined, (draft) => {
            const index = current(draft).findIndex(entry => entry.uuid === listUuid)
            const taskIndex = draft[index].tasks.findIndex((task) => task.uuid === uuid)
            draft[index].tasks[taskIndex] = {
              uuid,
              name,
              complete
            }
          }))
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      transformResponse: (response) => response.task
    }),
    deleteTask: builder.mutation<boolean, { uuid: string }>({
      query: ({ uuid }) => ({
        body: gql`
          mutation {
            deleteTask(uuid: "${uuid}")
          }
        `
      }),
      async onQueryStarted ({ uuid }, { dispatch, queryFulfilled }) {
        const listUuid = (store.getState() as RootState).app.listUuid
        const patchResult = dispatch(
          listApi.util.updateQueryData('getLists', undefined, (draft) => {
            const index = current(draft).findIndex(entry => entry.uuid === listUuid)
            draft[index].tasks = draft[index].tasks.filter((task) => task.uuid !== uuid)
          }))
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      transformResponse: (response) => response.task
    })
  }),
  overrideExisting: false
})

export const { useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = taskApi
