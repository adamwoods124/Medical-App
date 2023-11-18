import { useGetPatientsQuery } from './patientsApiSlice'
import Patient from './Patient'

const PatientsList = () => {
    const {
        data: patients,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPatientsQuery('patientsList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    
    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        console.log(error)
        content = <p className='errmsg'>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = patients

        const tableContent = ids?.length
            ? ids.map(patientId => <Patient key={patientId} patientId={patientId} />)
            : null

        content = (
            <table className='table table--patients'>
                <thead className='table__thead'>
                    <tr>
                        <th scope='col' className='table__th user__username'>Name</th>
                        <th scope='col' className='table__th user__username'>Birthday</th>
                        <th scope='col' className='table__th user__roles'>Assigned users</th>
                        <th scope='col' className='table__th user__edit'>View history</th>
                        <th scope='col' className='table__th user__edit'>View/Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}

export default PatientsList
