
const Item = ({ item }) =>
(<li>
  <span>{item.title}</span>
  <span>{item.url}</span>
  <span>{item.author}</span>
  <span>{item.num_comments}</span>
  <span>{item.points}</span>
</li>
)


const List = ({ list }) =>
  <ul>
    {list.map((item) => (
      <Item item={item} key={item.objectID } />
    ))}
  </ul>;

const Search = () => {
  const handleChange = (event) => {
    console.log(event);

    console.log(event.target.value);
  }

  const handleBlur = () => {
    console.log('Input lost focus');
  }

  return (
    <div>
      <label htmlFor="inputField">Input Field</label>
      <input id="inputField" type="text" onBlur={handleBlur} onChange={handleChange} />
    </div>
  )
};

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

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search />
      <hr />
      <List list={stories} />
    </div>
  )
};

export default App
