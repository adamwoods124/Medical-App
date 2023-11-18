import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCaseById } from './casesApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import EditCaseForm from './EditCaseForm'
import { selectAllPatients } from '../patients/patientsApiSlice'

const EditCase = () => {
    const { id } = useParams()

    const _case = useSelector(state => selectCaseById(state, id))
    const users = useSelector(selectAllUsers)
    const patients = useSelector(selectAllPatients)

    const content = _case && users ? <EditCaseForm _case={_case} users={users} patients={patients}/> : <p>Loading...</p>
    return content
}
export default EditCase