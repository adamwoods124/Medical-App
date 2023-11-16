import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectPatientById } from './patientsApiSlice'
import { selectAllCases } from '../cases/casesApiSlice'


const Patient = ({ patientId }) => {
    const patient = useSelector(state => selectPatientById(state, patientId))
    const cases = useSelector(selectAllCases)

    const navigate = useNavigate()

    if (patient) {
        const handleEdit = () => navigate(`/dash/patients/${patientId}`)

        const assignedToPatientString = patient.assignedUsers.length ? patient.assignedUsers.toString().replaceAll(',', ', ') : "None"
        const formattedBirthday = new Date(patient.birthday).toISOString().split('T')[0]
        
        const patientHistory = cases.map(_case => {
            return patient.history.includes(_case.id) ? (
            <li>
                {new Date(_case.createdAt).toISOString().split('T')[0]}: {_case.symptoms}
            </li>
            ) : null
        })

        return (
            <tr className="table__row patient">
                <td className='table__cell'>{patient.name}</td>
                <td className='table__cell'>{formattedBirthday}</td>
                <td className='table__cell'>{assignedToPatientString}</td>
                <td className='table__cell'>{patientHistory}</td>
                <td className='table__cell'>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}
export default Patient