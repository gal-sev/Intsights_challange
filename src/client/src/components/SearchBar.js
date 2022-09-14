import "./searchBar.scss";
export function SearchBar(props) {

  return (
    <input className="searchBar" 
    type="search" 
    placeholder="search"
    onChange={(e) => props.setSearch(e.target.value)}>
    </input>
  );
}

export default SearchBar;
