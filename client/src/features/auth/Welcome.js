import { Link } from 'react-router-dom'
const Welcome = () => {
    
    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dataStyle: 'full', timeStyle: 'long'}).format(date)

    const content = (
        <section className="welcome">
            <p>{today}</p>

            <h1>Welcome</h1>

            <p><Link to="/dash/cases">View cases</Link></p>

            <p><Link to="/dash/cases/create">Add new case</Link></p>

            <p><Link to="/dash/users">View users</Link></p>

            <p><Link to="/dash/users/create">Add new user</Link></p>
        </section>
    )

    return content
}

export default Welcome