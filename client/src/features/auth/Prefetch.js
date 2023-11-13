import { store } from '../../app/store'
import { casesApiSlice } from '../cases/casesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        const cases = store.dispatch(casesApiSlice.endpoints.getCases.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
        
        return () => {
            console.log('unsubscribing')
            cases.unsubscribe()
            users.unsubscribe()
        }
    }, [])
    return <Outlet />
}
export default Prefetch