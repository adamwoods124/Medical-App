import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://aw-medapp-api.onrender.com',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) // custom options

    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403) {
        console.log('Sending refresh token')

        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {
            // store new token
            api.dispatch(setCredentials({ ...refreshResult.data }))
            
            // retry query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Login expired."
            } 
            return refreshResult
        }
    }
    return result
}
export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Case', 'User', 'Patient'],
    endpoints: builder => ({})
})