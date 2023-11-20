import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faFileCirclePlus, faFilePen, faUserGear, faUserPlus, faUserDoctor } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'
const DASH_REGEX = /^\/dash(\/)?$/
const CASES_REGEX = /^\/dash\/cases(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/
const PATIENTS_REGEX = /^\/dash\/patients(\/)?$/

const DashHeader = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { isManager, isAdmin } = useAuth()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    const onCasesClicked = () => navigate('/dash/cases')
    const onNewCaseClicked = () => navigate('/dash/cases/create')
    const onUsersClicked = () => navigate('/dash/users')
    const onNewUserClicked = () => navigate('/dash/users/create')
    const onPatientsClicked = () => navigate('/dash/patients')
    const onNewPatientClicked = () => navigate('/dash/patients/create')


    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !CASES_REGEX.test(pathname) && !USERS_REGEX.test(pathname) && !PATIENTS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }

    let newCaseButton = null
    if (CASES_REGEX.test(pathname)) {
        newCaseButton = (
            <button 
                className='icon-button'
                title='New case'
                onClick={onNewCaseClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    let newUserButton = null 
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button 
                className='icon-button'
                title='New user'
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    let newPatientButton = null 
    if (PATIENTS_REGEX.test(pathname)) {
        newPatientButton = (
            <button 
                className='icon-button'
                title='New patient'
                onClick={onNewPatientClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    let casesButton = null
    if (!CASES_REGEX.test(pathname) && pathname.includes('/dash')) {
        casesButton = (
            <button 
                className='icon-button'
                title="Cases"
                onClick={onCasesClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        )
    }

    let usersButton = null
    if (isManager || isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            usersButton = (
                <button 
                    className='icon-button'
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserDoctor} />
                </button>
            )
        }
    }

    let patientsButton = null 
    if (!PATIENTS_REGEX.test(pathname) && pathname.includes('/dash')) {
        patientsButton = (
            <button 
                className='icon-button'
                title="Patients"
                onClick={onPatientsClicked}
            >
                <FontAwesomeIcon icon={faUserGear} />
            </button>
        )
    }
    

    const logoutButton = (
        <button
            className='icon-button'
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    let buttonContent
    if (isLoading) {
        buttonContent = <p>Logging out...</p>
    } else {
        buttonContent = (
            <>
                {newUserButton}
                {newCaseButton}
                {newPatientButton}
                {usersButton}
                {casesButton}
                {patientsButton}
                {logoutButton}
            </>
        )
    }

    const errClass = isError ? "errmsg" : "offscreen"

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">Hospital admin system</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}

export default DashHeader