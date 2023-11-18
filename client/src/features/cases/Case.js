import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectCaseById } from './casesApiSlice'
import { selectPatientById } from '../patients/patientsApiSlice'

const Case = ({ caseId }) => {
    const _case = useSelector(state => selectCaseById(state, caseId))
    const patient = useSelector(state => selectPatientById(state, _case?.patient))
    const navigate = useNavigate()

    if (!_case || !patient) return null
    
    const created = new Date(_case.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

    const updated = new Date(_case.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

    const handleEdit = () => navigate(`/dash/cases/${caseId}`)

    const usernamesString = _case.usernames.toString().replaceAll(',', ', ')

    return (
        <tr className="table__row note">
            <td className="table__cell note__status">
                {_case.completed
                    ? <span className="note__status--completed">Completed</span>
                    : <span className="note__status--open">Open</span>
                }
            </td>
                
            <td className="table__cell note__title">{patient.name}</td>
            <td className="table__cell note__title">{_case.roomNum}</td>
            <td className="table__cell note__username">{usernamesString}</td>
            <td className="table__cell note__created">{created}</td>
            <td className="table__cell note__updated">{updated}</td>
            <td className="table__cell note__edit">
                <button
                    className='icon-button table__button'
                    onClick={handleEdit}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
            </td>
        </tr>
    )
}
export default Case