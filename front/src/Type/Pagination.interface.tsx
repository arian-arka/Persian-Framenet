
export type PaginationInterface ={
    page: number,
    linkPerPage: number,
    limit: number,
    sort?: number,
}
export type PaginatedInterface<schema> = {
    pagination: {
        pages: number[]
        next: number,
        current: number,
        previous: number,
        total: number,
        totalSoFar: number,
        lastPage: number,
        firstPage: number,
        end: boolean
    }
    data: schema[]
}