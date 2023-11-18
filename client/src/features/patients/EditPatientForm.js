import { useState, useEffect } from 'react'
import { useUpdatePatientMutation, useDeletePatientMutation } from './patientsApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'

const EditPatientForm = ({ patient }) => {
    
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
    const [birthday, setBirthday] = useState(new Date(patient.birthday).toISOString().split("T")[0])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setName('')
            setBirthday(new Date(0))
            navigate('/dash/patients')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onNameChanged = e => setName(e.target.value)
    const onBirthdayChanged = e => setBirthday(e.target.value)

    const dateMax = new Date().toISOString().split("T")[0]
    const canSave = [name, birthday].every(Boolean) && !isLoading
    
    const onSaveClicked = async () => {
        if (canSave) {
            await updatePatient({ id: patient.id, name, birthday })
        }
    }

    const onDeleteClicked = async () => {
        await deletePatient({ id: patient.id })
    }

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
            </form>
        </>
    )

    return content
}
export default EditPatientForm