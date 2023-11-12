import { useState, useEffect } from 'react'
import { useAddNoteMutation } from './notesApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

const NewNoteForm = ({ users }) => {
    const [addNote, {
        isLoading,
        isSuccess, 
        isError,
        error
    }] = useAddNoteMutation()

    const navigate = useNavigate()

    const [user, setUser] = useState(users[0].id)
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    useEffect(() => {
        if (isSuccess) {
            setUser('')
            setTitle('')
            setText('')
            navigate('/dash/notes')
        }
    }, [isSuccess, navigate])

    const onUserChanged = e => setUser(e.target.value)
    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)

    const canSave = [user, title, text].every(Boolean) && !isLoading

    const onSaveClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNote({ user: user, title, text })
        }
    }

    const options = users.map(user => {
        return (
            <option 
                key={user.id}
                value={user.id}
            > {user.username}</option>
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className='form' onSubmit={onSaveClicked}>
                <div className = 'form__title-row'>
                    <h2>New Note</h2>
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
                <label className='form__label' htmlFor='title'>
                    Title:
                </label>
                <input 
                    //className={`form__input ${validTitleClass}`}
                    className='form__input'
                    id="title"
                    name="title"
                    type="text"
                    autoComplete='off'
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className='form__label' htmlFor='text'>
                    Text:
                </label>
                <input 
                    //className={`form__input ${validTextClass}`}
                    className='form__input'
                    id="text"
                    name="text"
                    type="text"
                    autoComplete='off'
                    value={text}
                    onChange={onTextChanged}
                />

                <label className='form__label' htmlFor='user'>
                    Assigned to:
                </label>
                <select
                    id='user'
                    name='user'
                    className='form__select'
                    value={user}
                    onChange={onUserChanged}
                >
                    {options}
                </select>
            </form>
        </>
    )
    
    return content
    
}
export default NewNoteForm