import { useState, useEffect } from 'react'
import { useUpdateCaseMutation, useDeleteCaseMutation } from './casesApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import useAuth from '../../hooks/useAuth'

const EditCaseForm = ({ _case, users, patients }) => {
    
    const { isManager, isAdmin } = useAuth()

    const [updateCase, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateCaseMutation()

    const [deleteCase, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteCaseMutation()

    const navigate = useNavigate()

    const [usernames, setUsernames] = useState(_case.users)
    const [patient, setPatient] = useState(_case.patient)
    const [roomNum, setRoomNum] = useState(_case.roomNum)
    const [symptoms, setSymptoms] = useState(_case.symptoms)
    const [notes, setNotes] = useState(_case.notes)
    const [completed, setCompleted] = useState(_case.completed)

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsernames('')
            setPatient('')
            setRoomNum('')
            setSymptoms('')
            setNotes('')
            navigate('/dash/cases')
        } 
    }, [isSuccess, isDelSuccess, navigate])   

    const onPatientChanged = e => setPatient(e.target.value)
    const onRoomNumChanged = e => setRoomNum(e.target.value)
    const onSymptomsChanged = e => setSymptoms(e.target.value)
    const onNotesChanged = e => setNotes(e.target.value)
    const onCompletedChanged = () => setCompleted(prev => !prev)

    const onUsernamesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setUsernames(values)
    }

    const validUsernamesClass = !Boolean(usernames.length) ? 'form__input--incomplete' : ''
    const canSave = [usernames.length, patient, roomNum, symptoms, notes].every(Boolean) && !isLoading 

    //console.log(usernames)
    const onSaveClicked = async () => {
        if (canSave) {
            await updateCase({ id: _case.id, users: usernames, patient, roomNum, symptoms, notes, completed })
        }
    }

    const onDeleteClicked = async () => {
        await deleteCase({ id: _case.id })
    }

    const created = new Date(_case.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updated = new Date(_case.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })

    const options = users.map(user => {
        return user.active || _case.users.includes(user.id) ? (
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

    const isAdminClass = (isAdmin || isManager) ? "" : "hidden"
    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    //const validTitleClass = !title ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    let deleteButton = null
    if (isManager || isAdmin) {
        deleteButton = (
            <button 
                className='icon-button'
                title="Delete"
                onClick={onDeleteClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Case</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {deleteButton}
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
                <label className="form__label" htmlFor="note-title">
                    Room number:
                </label>
                <input
                    className="form__input"
                    id="roomNum"
                    name="roomNum"
                    type="number"
                    min="0"
                    max="1000"
                    autoComplete="off"
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
                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="note-completed">
                            Case completed:
                            <input
                                className="form__checkbox"
                                id="note-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                        </label>
                            
                        <label className={`form__label ${isAdminClass}`} htmlFor="usernames">
                            Assigned to:</label>
                        <select
                            id="usernames"
                            name="usernames"
                            className={`form__select ${validUsernamesClass} ${isAdminClass}`}
                            size="4"
                            multiple={true}
                            value={usernames}
                            onChange={onUsernamesChanged}
                        >
                            {options}
                        </select>
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{created}</p>
                        <p className="form__updated">Updated:<br />{updated}</p>
                    </div>
                </div>   
            </form>
        </>
    )

    return content
}

export default EditCaseForm