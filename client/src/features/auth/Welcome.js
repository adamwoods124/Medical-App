import { Link } from 'react-router-dom'
const Welcome = () => {
    
    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dataStyle: 'full', timeStyle: 'long'}).format(date)

    const content = (
        <section className="welcome">
            <p>{today}</p>

            <h1>Welcome</h1>

            <p><Link to="/dash/notes">View notes</Link></p>

            <p><Link to="/dash/users">View user settings</Link></p>

        </section>
    )

    return content
}

export default Welcome