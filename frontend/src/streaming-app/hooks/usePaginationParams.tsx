import { useLocation, useNavigate, useSearchParams } from "react-router";

interface SetPaginationParamsOptions {
    hash?: string;
}

export const usePaginationParams = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 20;

    const setParams = (newPage: number, newPageSize: number, options?: SetPaginationParamsOptions) => {
        const nextSearchParams = new URLSearchParams(searchParams);
        const hash = options?.hash
            ? options.hash.startsWith("#")
                ? options.hash
                : `#${options.hash}`
            : location.hash;

        nextSearchParams.set("page", newPage.toString());
        nextSearchParams.set("pageSize", newPageSize.toString());

        navigate({
            pathname: location.pathname,
            search: `?${nextSearchParams.toString()}`,
            hash,
        });
    };

    return {
        page,
        pageSize,
        setParams,
    };
};
