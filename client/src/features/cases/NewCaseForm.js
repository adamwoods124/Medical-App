import { useState, useEffect } from 'react'
import { useAddCaseMutation } from './casesApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

const NewCaseForm = ({ users, patients }) => {
    const [addCase, {
        isLoading,
        isSuccess, 
        isError,
        error
    }] = useAddCaseMutation()

    const navigate = useNavigate()

    const [usernames, setUsernames] = useState([])
    const [patient, setPatient] = useState('')
    const [roomNum, setRoomNum] = useState('')
    const [symptoms, setSymptoms] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (isSuccess) {
            setUsernames('')
            setPatient('')
            setRoomNum('')
            setSymptoms('')
            setNotes('')
            navigate('/dash/cases')
        }
    }, [isSuccess, navigate])

    const onUsersChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setUsernames(values)
    }

    const onPatientChanged = e => setPatient(e.target.value)
    const onRoomNumChanged = e => setRoomNum(e.target.value)
    const onSymptomsChanged = e => setSymptoms(e.target.value)
    const onNotesChanged = e => setNotes(e.target.value)
    
    const canSave = [usernames.length, patient, roomNum, symptoms, notes].every(Boolean) && !isLoading
    
    const onSaveClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addCase({ users: usernames, patient, roomNum, symptoms, notes })
        }
    }

    const options = users.map(user => {
        return user.active ? (
            <option 
                key={user.id}
                value={user.id}
            > {user.username}</option>
        ) : null
    })

    const patientOptions = patients.map(patient => {
        return (
            <option 
                key={patient.id}
                value={patient.id}
            > {patient.name}</option>
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className='form' onSubmit={onSaveClicked}>
                <div className = 'form__title-row'>
                    <h2>New Case</h2>
                    <div className='form__action-buttons'>
                        <button
                            className='icon-button'
                            title='Save'
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className='form__label' htmlFor='patient'>
                    Patient:
                </label>
                <select
                    id='patient'
                    name='patient'
                    className='form__select'
                    value={patient}
                    onChange={onPatientChanged}
                >
                    {patientOptions}
                </select>

                <label className='form__label' htmlFor='text'>
                    Room number:
                </label>
                <input 
                    //className={`form__input ${validTextClass}`}
                    className='form__input'
                    id="text"
                    name="text"
                    type="number"
                    min="0"
                    max="1000"
                    autoComplete='off'
                    value={roomNum}
                    onChange={onRoomNumChanged}
                />
                <label className="form__label" htmlFor="note-text">
                    Symptoms:  
                </label>
                <textarea
                    className="form__input form__input--text"
                    id="symptoms"
                    name="symptoms"
                    type="text"
                    value={symptoms}
                    onChange={onSymptomsChanged}
                />
                <label className="form__label" htmlFor="note-text">
                    Notes:  
                </label>
                <textarea
                    className="form__input form__input--text"
                    id="notes"
                    name="notes"
                    type="text"
                    value={notes}
                    onChange={onNotesChanged}
                />
                <label className='form__label' htmlFor='users'>
                    Assigned to:
                </label>
                <select
                    id='users'
                    name='users'
                    className='form__select'
                    multiple={true}
                    size='3'
                    value={usernames}
                    onChange={onUsersChanged}
                >
                    {options}
                </select>
            </form>
        </>
    )
    
    return content
    
}
export default NewCaseForm