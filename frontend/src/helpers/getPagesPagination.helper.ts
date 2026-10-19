

export const getPagesPagination = (page: number, totalPages: number) => {
    const pages: number[] = [];

    const maxVisible = 5; // cantidad de botones visibles
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return { pages, firstVisiblePage: pages[0], lastVisiblePage: pages[pages.length - 1] };
};