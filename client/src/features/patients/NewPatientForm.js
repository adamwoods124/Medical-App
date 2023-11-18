import { useState, useEffect } from 'react'
import { useAddPatientMutation } from './patientsApiSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
const PATH_REGEX = /^\/dash\/patients(\/)/

const NewPatientForm = ({ inCaseForm, onHiddenChanged }) => {
    const [addPatient, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddPatientMutation()

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [name, setName] = useState('')
    const [birthday, setBirthday] = useState(new Date().toISOString().split("T")[0])
    
    useEffect(() => {
        if (isSuccess && PATH_REGEX.test(pathname)) {
            setName('')
            setBirthday(new Date().toISOString().split("T")[0])
            navigate('/dash/patients')
        }
        if (isSuccess) {
            setName('')
            setBirthday(new Date().toISOString().split("T")[0])
        }
    }, [isSuccess, navigate, pathname])

    const onNameChanged = e => setName(e.target.value)
    const onBirthdayChanged = e => setBirthday(e.target.value)

    const canSave = [name, birthday].every(Boolean) && !isLoading

    const onSaveClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addPatient({ name, birthday })
            if (inCaseForm) {
                onHiddenChanged()
            }
        }
    }

    const dateMax = new Date().toISOString().split("T")[0]

    const errClass = isError ? 'errmsg' : 'offscreen'

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className='form' onSubmit={onSaveClicked}>
                <div className='form__title-row'>
                    <h2>New Patient</h2>
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
                <label className='form__label' htmlFor='name'>
                    Patient name:
                </label>
                <input 
                    className='form__input'
                    id='name'
                    name='name'
                    type='text'
                    autoComplete='off'
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
export default NewPatientForm