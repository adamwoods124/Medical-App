import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link } from 'react-router-dom'
import { useGetPatientsQuery } from './patientsApiSlice'
import { useGetCasesQuery } from '../cases/casesApiSlice'
import { memo } from 'react'


const Patient = ({ patientId }) => {

    const { patient } = useGetPatientsQuery('patientsList', {
        selectFromResult: ({ data }) => ({
            patient: data?.entities[patientId]
        })
    })

    
    const { cases } = useGetCasesQuery('casesList', {
        selectFromResult: ({ data }) => ({
            cases: data?.ids.map(id => data?.entities[id])
        })
    })

    const navigate = useNavigate()

    if (patient) {
        const handleEdit = () => navigate(`/dash/patients/${patientId}`)

        const formattedBirthday = new Date(patient.birthday).toISOString().split('T')[0]
        
        const patientHistory = cases.map(_case => {
            return _case.patient === patientId ? (
            <li key={_case.id}>
                <Link to={"/dash/cases/" + _case.id} key={_case.id} className='table__cell-caselink'>
                {new Date(_case.createdAt).toISOString().split('T')[0]}: {_case.symptoms}
                </Link>
            </li>
            ) : null
        })

        const assignedUsersArr = []

        cases.forEach(_case => {
            if (_case.patient !== patient.id) return
        
            _case.usernames.forEach(username => {
                if (assignedUsersArr.includes(username)) return
                assignedUsersArr.push(username)
            })
        });

        const assignedUsersString = assignedUsersArr.join(", ")

        return (
            <tr className="table__row patient">
                <td className='table__cell'>{patient.name}</td>
                <td className='table__cell'>{formattedBirthday}</td>
                <td className='table__cell'>{assignedUsersString}</td>
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

const memoizedPatient = memo(Patient)
export default memoizedPatient