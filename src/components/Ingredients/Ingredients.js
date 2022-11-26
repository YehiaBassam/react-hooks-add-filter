import React, { useCallback, useState, useEffect, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

// Ingredients Reducer
const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.newIngredient];
    case 'DELETE':
      return currentIngredients.filter(ig => ig.id !== action.id);
    default:
      throw new Error('something went rong!')
  }
};

//httpState Reducer
const httpReducer = (currentHttp, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { loading: false, error: null };

    default:
      throw new Error('something went rong!')
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, httpDispatch] = useReducer(httpReducer, { loading: false, error: null });
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);

  // get ingredients - now come from search
  // useEffect(() => {
  //   fetch("https://react-add-search-default-rtdb.firebaseio.com/ingredients.json")
  //   .then(res => { 
  //     return res.json() 
  //   })
  //   .then(res => { 
  //     const newIngredients = [];
  //     for (const id in res) {
  //       newIngredients.push({
  //         id: id,
  //         title: res[id].title,
  //         amount: res[id].amount,
  //       })
  //     };
  //     setUserIngredients(newIngredients);
  //   })
  // }, [])

  const filterIngredients = useCallback((newIngredients) => {
    dispatch({ type: "SET", ingredients: newIngredients });
    // setUserIngredients(newIngredients)
  }, [])

  // add ingredient
  const addIngredient = (ingredient) => {
    // setIsLoading(true);
    httpDispatch({type: "SEND"})
    fetch("https://react-add-search-default-rtdb.firebaseio.com/ingredients.json", {
      method: "POSt",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ingredient)
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        // setUserIngredients(prevIngredients =>
        //   [
        //     ...prevIngredients,
        //     { id: res.name, ...ingredient }
        //   ])
        // setIsLoading(false);
        dispatch({ type: "ADD", newIngredient: { id: res.name, ...ingredient } });
        httpDispatch({type: "RESPONSE"});
      });
  }

  // remove ingredient
  const removeIngredient = useCallback((ingredientId) => {
    // setIsLoading(true);
    httpDispatch({type: "SEND"});
    fetch(`https://react-add-search-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: "DELETE"
    })
      .then(() => {
        // setUserIngredients(prevIngredients =>
        //   prevIngredients.filter(ig => ig.id !== ingredientId)
        //   )
        // setIsLoading(false);
        dispatch({ type: "DELETE", id: ingredientId });
        httpDispatch({type: "RESPONSE"});
      })
      .catch((err) => {
        // setIsLoading(false);
        // setIsError(true);
        httpDispatch({type: "ERROR", errorMessage: err})
      });
  },[]);

  const ingredientList = useMemo(() => {
    return(
    <IngredientList 
      ingredients={userIngredients} 
      onRemoveItem={removeIngredient} 
      onLoading={httpState} 
    />
    )
  }, [userIngredients, removeIngredient, httpState]);


  // UI
  return (
    <div className="App">
      {/* {isError &&
        <ErrorModal onClose={() => setIsError(false)} >
          something went wrong!
        </ErrorModal>
      } */}
      {httpState.error &&
        <ErrorModal onClose={() => httpDispatch({type: "CLEAR"})} >
          something went wrong!
        </ErrorModal>
      }

      <IngredientForm onAddIngredient={addIngredient} />

      <section>
        <Search onfilter={filterIngredients} />
        { ingredientList }
      </section>
    </div>
  );
}

export default Ingredients;
