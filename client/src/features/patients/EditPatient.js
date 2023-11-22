import { useParams } from 'react-router-dom'
import { useGetPatientsQuery } from './patientsApiSlice'
import EditPatientForm from './EditPatientForm'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditPatient = () => {
    useTitle('Elm St. Hospital - Edit Patient')
    const { id } = useParams()
    
    const { patient } = useGetPatientsQuery('patientsList', {
        selectFromResult: ({ data }) => ({
            patient: data?.entities[id]
        })
    })

    if (!patient) return <PulseLoader color={"FFF"} />

    const content = <EditPatientForm patient={patient} /> 
    return content
}
export default EditPatient