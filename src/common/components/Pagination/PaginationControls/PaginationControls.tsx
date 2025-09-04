import s from "@/common/components/Pagination/Pagination.module.css";

type Props = {
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
  pages: (number | "...")[];
}

export const PaginationControls = ({currentPage, setCurrentPage, pages}: Props) => {

  // const pages = getPaginationPages(currentPage, pagesCount)

  return (
    <div className={s.pagination}>
      {pages.map((page, idx) =>
        page === '...' ? (
          <span className={s.ellipsis} key={`ellipsis-${idx}`}>
            ...
          </span>
        ) : (
          <button
            key={page}
            className={
              page === currentPage ? `${s.pageButton} ${s.pageButtonActive}` : s.pageButton
            }
            onClick={() => page !== currentPage && setCurrentPage(Number(page))}
            disabled={page === currentPage}
            type="button"
          >
            {page}
          </button>
        )
      )}
    </div>
  );
};