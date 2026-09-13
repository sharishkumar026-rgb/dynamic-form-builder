import { useCallback, useMemo, useState } from "react";

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

interface PaginationResult {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  offset: number;

  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotalItems: (totalItems: number) => void;

  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;

  hasNextPage: boolean;
  hasPreviousPage: boolean;

  resetPagination: () => void;
}

const usePagination = (
  options: PaginationOptions = {}
): PaginationResult => {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalItems: initialTotalItems = 0,
  } = options;

  const [page, setPageState] = useState(
    Math.max(1, initialPage)
  );

  const [pageSize, setPageSizeState] = useState(
    Math.max(1, initialPageSize)
  );

  const [totalItems, setTotalItemsState] = useState(
    Math.max(0, initialTotalItems)
  );

  const totalPages = useMemo(() => {
    if (totalItems === 0) {
      return 1;
    }

    return Math.max(
      1,
      Math.ceil(totalItems / pageSize)
    );
  }, [totalItems, pageSize]);

  const offset = useMemo(() => {
    return (page - 1) * pageSize;
  }, [page, pageSize]);

  const setPage = useCallback(
    (newPage: number) => {
      const validPage = Math.min(
        Math.max(1, newPage),
        totalPages
      );

      setPageState(validPage);
    },
    [totalPages]
  );

  const setPageSize = useCallback(
    (newPageSize: number) => {
      const validPageSize = Math.max(
        1,
        newPageSize
      );

      setPageSizeState(validPageSize);
      setPageState(1);
    },
    []
  );

  const setTotalItems = useCallback(
    (newTotalItems: number) => {
      const validTotalItems = Math.max(
        0,
        newTotalItems
      );

      setTotalItemsState(validTotalItems);

      const newTotalPages =
        validTotalItems === 0
          ? 1
          : Math.ceil(
              validTotalItems / pageSize
            );

      setPageState((currentPage) =>
        Math.min(
          currentPage,
          Math.max(1, newTotalPages)
        )
      );
    },
    [pageSize]
  );

  const nextPage = useCallback(() => {
    setPageState((currentPage) =>
      Math.min(currentPage + 1, totalPages)
    );
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setPageState((currentPage) =>
      Math.max(currentPage - 1, 1)
    );
  }, []);

  const firstPage = useCallback(() => {
    setPageState(1);
  }, []);

  const lastPage = useCallback(() => {
    setPageState(totalPages);
  }, [totalPages]);

  const resetPagination = useCallback(() => {
    setPageState(Math.max(1, initialPage));
    setPageSizeState(Math.max(1, initialPageSize));
    setTotalItemsState(
      Math.max(0, initialTotalItems)
    );
  }, [
    initialPage,
    initialPageSize,
    initialTotalItems,
  ]);

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    offset,

    setPage,
    setPageSize,
    setTotalItems,

    nextPage,
    previousPage,
    firstPage,
    lastPage,

    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,

    resetPagination,
  };
};

export default usePagination;