import { useEffect, useState } from "react";

const Item = ({ item }) => {
return (<li>
  <span>{item.title}</span>
  <span>{item.url}</span>
  <span>{item.author}</span>
  <span>{item.num_comments}</span>
  <span>{item.points}</span>
</li>
)
}

const List = ({ list }) => {
  return <ul>
    {list.map((item) => (
      <Item item={item} key={item.objectID} />
    ))}
  </ul>;
}

const Search = ({onSearch, search}) => {

  const handleChange = async (event) => {
    onSearch(event.target.value)
  };

  const handleBlur = () => {
    console.log('Input lost focus');
  }

  return (
    <div>
      <label htmlFor="inputField">Input Field</label>
      <input id="inputField" type="text" onBlur={handleBlur} onChange={handleChange} value={search}/>
      <p>
        Searching for <strong>{search}</strong>
      </p>

    </div>
  )
};

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialState);
  
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}

const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://react.dev/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: '0',
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: '1',
    },
  ];

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  }

  const searchedStories = stories.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search onSearch={handleSearch} search={searchTerm} />
      <hr />
      <List list={searchedStories} />
    </div>
  )
};

export default App
