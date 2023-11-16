import { useState, useEffect } from 'react'
import { useUpdatePatientMutation, useDeletePatientMutation } from './patientsApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'

const EditPatientForm = ({ patient, users, cases }) => {
    
    const [updatePatient, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdatePatientMutation()

    const [deletePatient, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeletePatientMutation()

    const navigate = useNavigate()

    const [name, setName] = useState(patient.name)
    const [birthday, setBirthday] = useState(patient.birthday)
    const [assignedUsers, setAssignedUsers] = useState(patient.assignedUsers)
    const [history, setHistory] = useState(patient.history)

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setName('')
            setBirthday(new Date(0))
            setAssignedUsers([])
            navigate('/dash/patients')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onBirthdayChanged = e => setBirthday(e.target.value)
    
    const onAssignedUsersChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setAssignedUsers(values)
    }

    const onHistoryChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setHistory(values)
    }

    const dateMax = new Date().toISOString().split("T")[0]
    const canSave = [name, birthday].every(Boolean) && !isLoading
    
    const onSaveClicked = async () => {
        if (canSave) {
            await updatePatient({ id: patient.id, name, birthday, assignedUsers, history})
        }
    }

    const onDeleteClicked = async () => {
        await deletePatient({ id: patient.id })
    }

    const assignedUsersOptions = users.map(user => {
        return user.active ? (
            <option 
                key={user.id}
                value={user.id}
            > {user.username}</option>
        ) : null
    })

    const patientHistory = cases.map(_case => {
        return patient.history.includes(_case.id) ? (
        <li>
            {new Date(_case.createdAt).toISOString().split('T')[0]}: {_case.symptoms}
        </li>
        ) : null
    })

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className='form' onSubmit={e => e.preventDefault()}>
                <div className='form__title-row'>
                    <h2>Edit Patient</h2>
                    <div className='form__action-buttons'>
                        <button
                            className='icon-button'
                            title='Save'
                            onClick={onSaveClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button 
                            className='icon-button'
                            title='Delete'
                            onClick={onDeleteClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className='form__label' htmlFor='name'>
                    Patient name:
                </label>
                <input 
                    className='form__input'
                    id='name'
                    name='name'
                    type='text'
                    value={name}
                    onChange={onNameChanged}
                />
                <label className='form__label' htmlFor='birthday'>
                    Patient birthday:
                </label>
                <input 
                    className='form__input'
                    id='birthday'
                    name='birthday'
                    type='date'
                    max={dateMax}
                    value={birthday}
                    onChange={onBirthdayChanged}
                />
                <label className='form__label' htmlFor='assignedUsers'>
                    Assigned to patient:
                </label>
                <select 
                    id='assignedUsers'
                    name='assignedUsers'
                    className='form__select'
                    multiple={true}
                    size='3'
                    value={assignedUsers}
                    onChange={onAssignedUsersChanged}
                >
                    {assignedUsersOptions}
                </select>
                <label className='form__label' htmlFor='history'>
                    Previous cases:
                </label>
                <div>
                    {patientHistory}
                </div>
            </form>
        </>
    )

    return content
}
export default EditPatientForm