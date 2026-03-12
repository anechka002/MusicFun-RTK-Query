type Props = {
  pageSize: number;
  changePageSize: (pageSize: number) => void;
}

export const PageSizeSelector = ({pageSize, changePageSize}: Props) => {
  return (
    <label>
      Show
      <select value={pageSize} onChange={e => changePageSize(Number(e.target.value))}>
        {[2, 4, 8, 16, 32].map(size => (
          <option value={size} key={size}>
            {size}
          </option>
        ))}
      </select>
      per page
    </label>
  );
};