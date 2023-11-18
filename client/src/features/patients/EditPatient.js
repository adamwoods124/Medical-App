import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectPatientById } from './patientsApiSlice'
import EditPatientForm from './EditPatientForm'

const EditPatient = () => {
    const { id } = useParams()

    const patient = useSelector(state => selectPatientById(state, id))

    const content = patient ? <EditPatientForm patient={patient} /> : <p>Loading...</p>
    return content
}
export default EditPatient