import { useEffect, useState, Dispatch, SetStateAction, useRef } from "react";
import { Dropdown, SliderXWithRef, SliderXWithState, SliderY } from "./ReusableComponents";
import './App.css';

type Story = {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: string;
}

const Item = ({ item, onRemoveItem }: { item: Story, onRemoveItem: (objectId: string) => void }) => {
  return (<li>
    <span>{item.title}</span>
    <span>{item.url}</span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <button type="button" onClick={() => onRemoveItem(item.objectID)}>Remove</button>
  </li>
  )
}

const List = ({ list, onRemoveItem }: { list: Story[], onRemoveItem: (objectId: string) => void }) => {
  return <ul>
    {list.map((item) => (
      <Item item={item} key={item.objectID} onRemoveItem={onRemoveItem} />
    ))}
  </ul>;
}

type InputWithLabelProps = {
  id: string;
  value: string;
  isFocused: boolean;
  type?: string;
  onInputChange: (value: string) => void;
  children: React.ReactNode;
}

const InputWithLabel = ({
  id, value, type = 'text', onInputChange, isFocused, children
}: InputWithLabelProps) => {
  // A
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      (inputRef.current as HTMLInputElement).focus();
    }
  }, [isFocused]);

  const handleChange = async (event: { target: { value: string; }; }) => {
    onInputChange(event.target.value)
  };

  const handleBlur = () => {
    console.log('Input lost focus');
  }

  return (
    <>
      <label htmlFor={id}>{children}</label>&nbsp;
      <input id={id} ref={inputRef} type={type} onBlur={handleBlur} onChange={handleChange} value={value} />
    </>
  )
};

const useStorageState = (key: string, initialState: string): [string, Dispatch<SetStateAction<string>>] => {
  const [value, setValue] = useState<string>(localStorage.getItem(key) ?? initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}

const App = () => {
  const initialStories = [
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
  const [stories, setStories] = useState(initialStories);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  }

  const handleRemoveItem = (objectId: string) => {
    setStories(stories.filter((item) => item.objectID !== objectId));
  }

  const searchedStories = stories.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearch} >
        <strong>Search :</strong>
      </InputWithLabel>
      <hr />
      <List list={searchedStories} onRemoveItem={handleRemoveItem} />
      <hr />
      <SliderXWithRef initial={10} max={25} />
      <hr />
      <SliderY />
    </div>
  )
};

export default App
