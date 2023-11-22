import useTitle from "../../hooks/useTitle"
import { useGetUsersQuery } from "../users/usersApiSlice"
import NewPatientForm from "./NewPatientForm"
import PulseLoader from "react-spinners/PulseLoader"

const NewPatient = () => {
    useTitle('Elm St. Hospital - New Patient')

    const { users } = useGetUsersQuery('usersList', {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })

    if (!users?.length) return <PulseLoader color="#FFF" />

    const content = <NewPatientForm />

    return content
}
export default NewPatient