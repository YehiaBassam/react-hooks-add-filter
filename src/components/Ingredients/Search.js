import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const { onfilter } = props;
  const [ titleFiltered, setTitleFiltered ] = useState('');
  const inputRef = useRef();

  // filter ingredients
  useEffect(() => {
    const timer = setTimeout(() => {
      if (titleFiltered === inputRef.current.value){
        const query = titleFiltered.length > 0 ? `?orderBy="title"&equalTo="${titleFiltered}"` : '';
        fetch("https://react-add-search-default-rtdb.firebaseio.com/ingredients.json" + query)
        .then(res => { 
          return res.json() 
        })
        .then(res => { 
          const newIngredients = [];
          for (const id in res) {
            newIngredients.push({
              id: id,
              title: res[id].title,
              amount: res[id].amount,
            })
          };
          onfilter(newIngredients);
        })
      }
    },500)

    // Clear fn
    return () => {
      clearTimeout(timer);
    }
  }, [titleFiltered, onfilter])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Total Title</label>
          <input
            ref={inputRef}
            type="text"
            value={titleFiltered}
            onChange={e => setTitleFiltered(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
