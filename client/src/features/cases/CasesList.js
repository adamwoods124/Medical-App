import { useGetCasesQuery } from './casesApiSlice'
import Case from './Case'

const CasesList = () => {
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

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className='errmsg'>{error?.data?.message}</p>
    }

    if (isSuccess) {
        const { ids } = cases

        const tableContent = ids?.length
            ? ids.map(caseId => <Case key={caseId} caseId={caseId} />)
            : null

        content = (
            <table className="table table--notes">
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