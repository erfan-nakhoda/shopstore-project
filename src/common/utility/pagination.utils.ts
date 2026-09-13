export function PaginationSolver(page: number = 1, limit: number = 10) {
    if(!page || page <= 1) page = 0
    else page = page - 1
    if(!limit || limit <= 1) limit = 10
    const skip = limit * page
    return {
        skip,
        page,
        limit
    }
}

export function PaginationGenerator(count : number, page : number, limit : number) {
    const totalPage = Math.ceil(count / limit)
    return {
        totalCount : count,
        totalPage,
        countPerPage : limit,
        page : page + 1
    }
}