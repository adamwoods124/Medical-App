import { store } from '../../app/store'
import { casesApiSlice } from '../cases/casesApiSlice'
import { patientsApiSlice } from '../patients/patientsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    useEffect(() => {
        store.dispatch(casesApiSlice.util.prefetch('getCases', 'casesList', { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
        store.dispatch(patientsApiSlice.util.prefetch('getPatients', 'patientsList', { force: true }))
    }, [])
    return <Outlet />
}
export default Prefetch