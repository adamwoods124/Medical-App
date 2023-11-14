import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewCaseForm from './NewCaseForm'

const NewCase = () => {
    const users = useSelector(selectAllUsers)
    console.log(users)
    if (!users?.length) return <p>Not currently available</p>

    console.log("users")
    const content =  <NewCaseForm users={users} /> 

    return content
}
export default NewCase