import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Welcome = () => {
    
    const { username, isManager, isAdmin } = useAuth()

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long'}).format(date)

    const content = (
        <section className="welcome">
            <p>{today}</p>

            <h1>Welcome {username}!</h1>

            <p><Link to="/dash/cases">View cases</Link></p>

            <p><Link to="/dash/cases/create">Add new case</Link></p>

            {(isManager || isAdmin) && <p><Link to="/dash/users">View users</Link></p>}

            {(isManager || isAdmin) && <p><Link to="/dash/users/create">Add new user</Link></p>}

            <p><Link to="/dash/patients">View patients</Link></p>

            <p><Link to="/dash/patients/create">Add new patient</Link></p>
        
        </section>
    )

    return content
}

export default Welcome