import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewPatientForm from "./NewPatientForm";

const NewPatient = () => {
    const users = useSelector(selectAllUsers)
    if (!users?.length) return <p>Not currently available</p>

    const content = <NewPatientForm users={users} />

    return content
}
export default NewPatient