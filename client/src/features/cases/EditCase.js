import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCaseById } from './casesApiSlice'
import { selectAllUsers } from '../users/usersApiSlice'
import EditCaseForm from './EditCaseForm'

const EditCase = () => {
    const { id } = useParams()

    const _case = useSelector(state => selectCaseById(state, id))
    const users = useSelector(selectAllUsers)
    console.log("case", _case)

    const content = (_case && users) && (!_case.undefined && !users.undefined) ? <EditCaseForm _case={_case} users={users} /> : <p>Loading...</p>
    return content
}
export default EditCase