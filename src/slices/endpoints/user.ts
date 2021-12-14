import { apiSlice } from '../api'
import { gql } from 'graphql-request'

export interface IUser {
  id: string | null
}

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<IUser, void>({
      query: () => ({
        body: gql`
          mutation {
            createUser {
              id
            }
          }
        `
      }),
      transformResponse: (response) => response.createUser
    }),
    getUser: builder.query<IUser, string>({
      query: (user) => ({
        body: gql`
          query {
            user(id: "${user}") {
              id
            }
          }
        `
      }),
      transformResponse: (response) => response.user
    })
  }),
  overrideExisting: false
})

export const { useCreateUserMutation, useGetUserQuery } = userApi
