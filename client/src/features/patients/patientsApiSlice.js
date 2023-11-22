import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const patientsAdapter = createEntityAdapter({})

const initialState = patientsAdapter.getInitialState()

export const patientsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPatients: builder.query({
            query: () => ({
                url: '/patients',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedPatients = responseData.map(patient => {
                    patient.id = patient._id
                    return patient
                });
                return patientsAdapter.setAll(initialState, loadedPatients)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Patient', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Patient', id }))
                    ]
                } else return [{ type: 'Patient', id: 'LIST' }]
            }
        }),
        addPatient: builder.mutation({
            query: initialPatientData => ({
                url: '/patients',
                method: 'POST',
                body: {
                    ...initialPatientData,
                }
            }),
            invalidatesTags: [
                { type: 'Patient', id: 'LIST'}
            ]
        }),
        updatePatient: builder.mutation({
            query: initialPatientData => ({
                url: '/patients',
                method: 'PATCH',
                body: {
                    ...initialPatientData
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Patient', id: arg.id }
            ]
        }),
        deletePatient: builder.mutation({
            query: ({ id }) => ({
                url: '/patients',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Patient', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetPatientsQuery,
    useAddPatientMutation,
    useUpdatePatientMutation,
    useDeletePatientMutation
} = patientsApiSlice

// returns the query result object
export const selectPatientsResult = patientsApiSlice.endpoints.getPatients.select()

// creates memoized selector
const selectPatientsData = createSelector(
    selectPatientsResult,
    patientsResult => patientsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPatients,
    selectById: selectPatientById,
    selectIds: selectPatientIds
    // Pass in a selector that returns the patients slice of state
} = patientsAdapter.getSelectors(state => selectPatientsData(state) ?? initialState)