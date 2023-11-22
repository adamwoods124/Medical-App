import { useGetCasesQuery } from './casesApiSlice'
import Case from './Case'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const CasesList = () => {

    useTitle('Elm St. Hospital - Cases List')
    const { id, isManager, isAdmin } = useAuth()

    const {
        data: cases,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetCasesQuery('casesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <PulseLoader color="#FFF" />

    if (isError) {
        content = <p className='errmsg'>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids, entities } = cases

        let filteredIds
        if (isManager || isAdmin) {
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(caseId => entities[caseId].users?.includes(id))
        }

        const tableContent = ids?.length && filteredIds.map(caseId => <Case key={caseId} caseId={caseId} />)
        
        content = (
            <table className="table table--cases">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className='table__th note__status'>Status</th>
                        <th scope="col" className="table__th note__title">Patient name</th>
                        <th scope="col" className="table__th note__title">Room number</th>
                        <th scope="col" className="table__th note__username">Assigned to</th>
                        <th scope="col" className="table__th note__created">Created</th>
                        <th scope="col" className="table__th note__updated">Updated</th>
                        <th scope="col" className="table__th note__edit">View/Edit</th>
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
export default CasesList