import ContentLoader from "react-content-loader"

export const PlaylistSkeleton = () => (
  <ContentLoader
    speed={2}
    width={280}
    height={465}
    viewBox="0 0 280 465"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="5" y="297" rx="10" ry="10" width="250" height="25" />
    <rect x="5" y="403" rx="10" ry="10" width="95" height="25" />
    <rect x="77" y="412" rx="0" ry="0" width="7" height="0" />
    <rect x="4" y="264" rx="10" ry="10" width="130" height="25" />
    <rect x="101" y="403" rx="10" ry="10" width="95" height="25" />
    <rect x="4" y="14" rx="10" ry="10" width="250" height="237" />
    <rect x="146" y="264" rx="10" ry="10" width="108" height="25" />
    <rect x="5" y="332" rx="10" ry="10" width="250" height="25" />
    <rect x="5" y="369" rx="10" ry="10" width="250" height="25" />
  </ContentLoader>
)