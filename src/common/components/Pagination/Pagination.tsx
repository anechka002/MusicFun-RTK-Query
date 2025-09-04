import s from './Pagination.module.css'
import {
  PageSizeSelector
} from "@/common/components/Pagination/PageSizeSelector/PageSizeSelector.tsx";
import {
  PaginationControls
} from "@/common/components/Pagination/PaginationControls/PaginationControls.tsx";
import {getPaginationPages} from "@/common/utils";


type Props = {
  currentPage: number
  setCurrentPage: (page: number) => void
  pagesCount: number
  pageSize: number
  changePageSize: (pageSize: number) => void
}

export const Pagination = ({ currentPage, setCurrentPage, pagesCount, pageSize, changePageSize }: Props) => {
  if (pagesCount <= 1) return null

  const pages = getPaginationPages(currentPage, pagesCount)

  return (
    <div className={s.container}>
      <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} pages={pages}/>
      <PageSizeSelector pageSize={pageSize} changePageSize={changePageSize}/>
    </div>

  )
}