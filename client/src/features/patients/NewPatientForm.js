import { useState, useEffect } from 'react'
import { useAddPatientMutation } from './patientsApiSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
const PATH_REGEX = /^\/dash\/patients(\/)?$/

const NewPatientForm = ({ users }) => {
    const [addPatient, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddPatientMutation()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [name, setName] = useState('')
    const [birthday, setBirthday] = useState(new Date(0))
    const [assignedUsers, setAssignedUsers] = useState([])

    useEffect(() => {
        if (PATH_REGEX.test(pathname) && isSuccess) {
            console.log("success")
            setName('')
            setBirthday(new Date(0))
            setAssignedUsers([])
            navigate('/dash/patients')
        }
        if (isSuccess) {
            console.log("success,")
            setName('')
            setBirthday(new Date(0))
            setAssignedUsers([])
            navigate('/dash/patients')
        }
    }, [isSuccess, navigate, pathname])

    const onNameChanged = e => setName(e.target.value)
    const onBirthdayChanged = e => setBirthday(e.target.value)
    const onAssignedUsersChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setAssignedUsers(values)
    }

    const canSave = [name, birthday].every(Boolean) && !isLoading

    const onSaveClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addPatient({ name, birthday, assignedUsers })
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
                    {options}
                </select>
            </form>
        </>
    )

    return content
}
export default NewPatientForm