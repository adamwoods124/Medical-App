import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewCaseForm from './NewCaseForm'
import { selectAllPatients } from '../patients/patientsApiSlice'

const NewCase = () => {
    const users = useSelector(selectAllUsers)
    const patients = useSelector(selectAllPatients)
    if (!users?.length) return <p>Not currently available</p>

    const content =  <NewCaseForm users={users} patients={patients}/> 

    return content
}
export default NewCase