import { useFetchTracksInfiniteQuery } from '@/entities/track/api/tracksApi'
import { useInfinityScroll } from '@/shared/lib/hooks'
import { LoadingTrigger } from '@/widgets/loading-trigger/ui/LoadingTrigger'
import { TracksList } from '@/widgets/tracks-list/ui/TracksList'

export const TracksPage = () => {

  const {data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage} = useFetchTracksInfiniteQuery()

  // Создает ссылку на DOM элемент, который будет "триггером" для автозагрузки
  const {observerRef} = useInfinityScroll({hasNextPage, isFetching, fetchNextPage})

  const pages = data?.pages.map(page => page.data).flat() || []
  // const pages = data?.pages.flatMap((page) => page.data) || []

  return (
    <div>
      <h1>Tracks page</h1>
      <TracksList tracks={pages}/>

      {hasNextPage && <LoadingTrigger observerRef={observerRef} isFetchingNextPage={isFetchingNextPage}/>}

      {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
    </div>
  )
}
