import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersApiSlice'
import NewCaseForm from './NewCaseForm'
import NewUserForm from '../users/NewUserForm'

const NewCase = () => {
    const users = useSelector(selectAllUsers)
    console.log(users)
    if (!users?.length) return <p>Not currently available</p>

    const content =  <NewCaseForm users={users} /> 

    return content
}
export default NewCase