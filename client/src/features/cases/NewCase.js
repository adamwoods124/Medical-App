import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewCaseForm from './NewCaseForm'

const NewCase = () => {
    const users = useSelector(selectAllUsers)

    const content = users ? <NewCaseForm users={users} /> : <p>Loading...</p>

    return content
}
export default NewCase