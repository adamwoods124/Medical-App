import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import PulseLoader from 'react-spinners/PulseLoader'

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMessage, setErrMessage] = useState('')
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMessage('')
    }, [username, password])

    const handleUsernameInput = (e) => setUsername(e.target.value)
    const handlePasswordInput = (e) => setPassword(e.target.value)
    const handleTogglePersist = () => setPersist(prev => !prev)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            navigate('/dash')
        } catch (err) {
            if (!err.status) {
                setErrMessage('No response from server')
            } else if (err.status === 400) {
                setErrMessage('Missing username or password')
            } else if (err.status === 401) {
                setErrMessage('Unauthorized')
            } else {
                setErrMessage(err.data?.message)
            }
            errRef.current.focus()
        }
    }

    const errClass = errMessage ? "errmsg" : "offscreen"

    if (isLoading) return <PulseLoader color="#FFF" />

    const content = (
        <section className='public'>
            <header>
                <h1>Employee Login</h1>
            </header>
            <main className='login'>
                <p ref={errRef} className={errClass} aria-live='assertive'>{errMessage}</p>

                <form className='form' onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        className='form__input'
                        type='text'
                        id='username'
                        ref={userRef}
                        value={username}
                        onChange={handleUsernameInput}
                        autoComplete='off'
                        required={true}
                    />
                    <label htmlFor='password'>Password:</label>
                    <input
                        className='form__input'
                        type='password'
                        id='password'
                        onChange={handlePasswordInput}
                        value={password}
                        required={true}
                    />
                    <button className='form__submit-button'>Sign in</button>

                    <label htmlFor='persist' className='form__persist'>
                        <input
                            type='checkbox'
                            className='form__checkbox'
                            id='persist'
                            onChange={handleTogglePersist}
                            checked={persist}
                        />
                        Trust this device
                    </label>
                </form>
            </main>
            <footer>
                <Link to='/'>Back to home</Link>
            </footer>
        </section>
    )

    return content
}
export default Login