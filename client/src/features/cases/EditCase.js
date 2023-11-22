import { useParams } from 'react-router-dom'
import EditCaseForm from './EditCaseForm'
import { useGetCasesQuery } from './casesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import { useGetPatientsQuery } from '../patients/patientsApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditCase = () => {
    useTitle('Elm St. Hospital - Edit Case')
    const { id } = useParams()

    const { id: userId, isManager, isAdmin } = useAuth() 

    const { _case } = useGetCasesQuery('casesList', {
        selectFromResult: ({ data }) => ({
            _case: data?.entities[id]
        })
    })


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

    if (!_case || !users?.length || !patients?.length) return <PulseLoader color={"#FFF"} />

    if (!isManager && !isAdmin) {
        if (!_case.users.includes(userId)) {
            return <p className='errmsg'>Unauthorized</p>
        }
    }
    
    const content = <EditCaseForm _case={_case} users={users} patients={patients}/> 
    return content
}
export default EditCase