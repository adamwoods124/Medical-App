import NewCaseForm from './NewCaseForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import { useGetPatientsQuery } from '../patients/patientsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const NewCase = () => {
    useTitle('Elm St. Hospital - New Case')
    const { users } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })
    const { patients } = useGetPatientsQuery('patientsList', {
        selectFromResult: ({ data }) => ({
            patients: data?.ids.map(id => data?.entities[id])
        })
    })

    if (!users?.length || !patients?.length) return <PulseLoader color={"#FFF"} />

    const content =  <NewCaseForm users={users} patients={patients}/> 

    return content
}
export default NewCase