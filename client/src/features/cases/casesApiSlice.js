import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'

import { apiSlice } from '../../app/api/apiSlice'

const casesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = casesAdapter.getInitialState()

export const casesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCases: builder.query({
            query: () => '/cases',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedCases = responseData.map(_case => {
                    _case.id = _case._id
                    return _case
                });
                return casesAdapter.setAll(initialState, loadedCases)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Case', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Case', id }))
                    ]
                } else return [{ type: 'Case', id: 'LIST' }]
            }
        }),
        addCase: builder.mutation({
            query: initialCaseData => ({
                url: '/cases',
                method: 'POST',
                body: {
                    ...initialCaseData
                }
            }),
            invalidatesTags: [
                { type: 'Case', id: 'LIST' }
            ]
        }),
        updateCase: builder.mutation({
            query: initialCaseData => ({
                url: '/cases',
                method: 'PATCH',
                body: {
                    ...initialCaseData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Case', id: arg.id }
            ]
        }),
        deleteCase: builder.mutation({
            query: ({ id }) => ({
                url: '/cases',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Case', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetCasesQuery,
    useAddCaseMutation,
    useDeleteCaseMutation,
    useUpdateCaseMutation
} = casesApiSlice

// returns the query result object
export const selectCasesResult = casesApiSlice.endpoints.getCases.select()

// creates memoized selector
const selectCasesData = createSelector(
    selectCasesResult,
    casesResult => casesResult.data
)

// getSelectors creates selectors and we rename them using destructuring
export const {
    selectAll: selectAllCases,
    selectById: selectCaseById,
    selectIds: selectCaseIds
} = casesAdapter.getSelectors(state => selectCasesData(state) ?? initialState)