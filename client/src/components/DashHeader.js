import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
const DASH_REGEX = /^\/dash(\/)?$/
const CASES_REGEX = /^\/dash\/cases(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    if (isLoading) return <p>Logging out...</p>

    if (isError) return <p>Error: {error.data?.message}</p>

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !CASES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = 'dash-header__container--small'
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

    const content = (
        <header className="dash-header">
            <div className={`dash-header__container ${dashClass}`}>
                <Link to="/dash">
                    <h1 className="dash-header__title">Hospital admin system</h1>
                </Link>
                <nav className="dash-header__nav">
                    {/*todo add buttons*/}
                    {logoutButton}
                </nav>
            </div>
        </header>
    )

    return content
}

export default DashHeader