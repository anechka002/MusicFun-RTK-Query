import type { TrackData } from '@/entities/track/api/tracksApi.types'
import s from './TracksList.module.css'

type Props = {
  tracks: TrackData[];
}

export const TracksList = ({tracks}: Props) => {
  return (
    <div className={s.list}>
      {tracks.map(track => {
        const { title, user, attachments } = track.attributes
        const firstAttachment = attachments[0]

        return (
          <div key={track.id} className={s.item}>
            <div>
              <p>Title: {title}</p>
              <p>Name: {user.name}</p>
            </div>
            {firstAttachment ? <audio controls src={firstAttachment.url} /> : 'no file'}
          </div>
        )
      })}
    </div>
  );
};
