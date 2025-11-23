import { useEffect, useState, Dispatch, SetStateAction, useRef, useMemo, useReducer } from "react";
import { SliderXWithRef, SliderY } from "./ReusableComponents";
import './App.css';
import { Sortable } from "./components/Sortable";

type Story = {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: string;
}

const Item = ({ item, onRemoveItem }: { item: Story, onRemoveItem: (item: Story) => void }) => {
  return (<li>
    <span>{item.title} </span>
    <span>{item.url} </span>
    <span>{item.author} </span>
    <span>{item.num_comments} </span>
    <span>{item.points} </span>
    <button type="button" onClick={() => onRemoveItem(item)}>Remove</button>
  </li>
  )
}

const List = ({ list, onRemoveItem }: { list: Story[], onRemoveItem: (item: Story) => void }) => {
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

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const getAsyncStories = async () => {
  return await fetch(`${API_ENDPOINT}react`)
  .then(res => res.json());
}

const REMOVE_STORY = 'REMOVE_STORY';

const STORIES_FETCH_INIT = 'STORIES_FETCH_INIT';
const STORIES_FETCH_SUCCESS = 'STORIES_FETCH_SUCCESS';
const STORIES_FETCH_FAILURE = 'STORIES_FETCH_FAILURE';

type StoriesInitAction = {
  type: 'STORIES_FETCH_INIT';
};

type StoriesSuccessAction = {
  type: 'STORIES_FETCH_INIT' | 'STORIES_FETCH_SUCCESS' | 'STORIES_FETCH_FAILURE';
  payload: Story[];
};

type StoriesErrorAction = {
  type: 'STORIES_FETCH_FAILURE';
};

type StoriesRemoveAction = {
  type: 'REMOVE_STORY';
  payload: Story;
};

type StoriesAction = StoriesInitAction | StoriesSuccessAction | StoriesErrorAction | StoriesRemoveAction;

type StoriesState = {
  data: Story[];
  isLoading: boolean;
  isError: boolean;
}


const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case STORIES_FETCH_INIT:
      return { ...state, isLoading: true, isError: false };
    case STORIES_FETCH_SUCCESS:
      return { data: action.payload, isLoading: false, isError: false };
    case STORIES_FETCH_FAILURE:
      return { ...state, isLoading: false, isError: true };
    case REMOVE_STORY:
      return {
        ...state,
        data: state.data.filter((story) => story.objectID !== action.payload.objectID),
      };
    default:
      throw new Error();
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false });

  useEffect(() => {
    dispatchStories({ type: STORIES_FETCH_INIT });
    console.log('azdaz');
    
    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: STORIES_FETCH_SUCCESS,
          payload: result.hits
        });
      }).catch(() => {
        dispatchStories({ type: STORIES_FETCH_FAILURE });
      })
  }, [])

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  }

  const handleRemoveItem = (item: Story) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  }

  const searchedStories = useMemo(() => stories.data.filter(
    (story) => story.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [stories, searchTerm]);



  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearch} >
        <strong>Search :</strong>
      </InputWithLabel>
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (<p>Loading ...</p>) :
        <List list={searchedStories} onRemoveItem={handleRemoveItem} />
      }
      <hr />
      <SliderXWithRef initial={10} max={25} />
      <hr />
      <Sortable />
      <hr />
      <SliderY />
    </div>
  )
};

export default App
