import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({ title, amount })
    setTitle('');
    setAmount('');
    
    // const data = { title, amount }
    // console.log("data", data)
    // ...
  };



  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
