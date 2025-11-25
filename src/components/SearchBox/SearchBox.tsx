import css from './SearchBox.module.css';

interface SearchBoxProps {
  onSearch: (newValue: string) => void;
  value: string;
}

function SearchBox({ onSearch, value }: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={handleChange}
      value={value}
    />
  );
}

export default SearchBox;
