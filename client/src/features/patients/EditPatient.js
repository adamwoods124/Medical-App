import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectPatientById } from './patientsApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import { selectAllCases } from '../cases/casesApiSlice'
import EditPatientForm from './EditPatientForm'

const EditPatient = () => {
    const { id } = useParams()

    const patient = useSelector(state => selectPatientById(state, id))
    const cases = useSelector(selectAllCases)
    const users = useSelector(selectAllUsers)

    const content = patient && cases && users ? <EditPatientForm patient={patient} users={users} cases={cases} /> : <p>Loading...</p>
    return content
}
export default EditPatient