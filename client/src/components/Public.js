import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">Elm St. Hospital</span></h1>
            </header>
            <main className="public__main">
                <p>Even if your case feels like a nightmare, we can help you!</p>
                <address className="public__addr">
                    Elm St. Hospital<br />
                    555 Elm St.<br />
                    Nightmare City, NY 12345<br />
                    <a href="tel:+15555555555">(555) 555-5555</a>
                </address>
                <br />
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}

export default Public