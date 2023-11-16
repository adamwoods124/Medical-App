import { store } from '../../app/store'
import { casesApiSlice } from '../cases/casesApiSlice'
import { patientsApiSlice } from '../patients/patientsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        const cases = store.dispatch(casesApiSlice.endpoints.getCases.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
        const patients = store.dispatch(patientsApiSlice.endpoints.getPatients.initiate())

        return () => {
            console.log('unsubscribing')
            cases.unsubscribe()
            users.unsubscribe()
            patients.unsubscribe()
        }
    }, [])
    return <Outlet />
}
export default Prefetch