import './App.css';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import React from 'react';

//define the tottlat state as we need to compute the total
const cartTotalState = selector({
  key:"cartTotalState",
  get:({get} ) => {
    const cart = get(cartState)

    const total = cart.reduce(( prev, curr) => prev + curr.price, 0)
    return{
      total
    }
  }
})

//fetching the data using the selector in recoil
const productsQuery = selector({
  key: 'products',
  get: async () => {
    try {
      const res = await axios('https://fakestoreapi.com/products');
      return res.data || [];
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  },
});

//creating a view to display the fetched data
const FakeProducts = ({ onAddCartItem }) => {
  //set the state like react usestate
  const [cart, setCart] = useRecoilState(cartState);
  
  //get the product list from recoil state
  const dummyProducts = useRecoilValue(productsQuery);
  return (
    <>
      <div className="dummy">
        <div className="dummy-content">
          {dummyProducts.map((product) => (
            <div className="card" key={product.id}>
              <img src={product.image} alt="" />
              <div className="card-body">
                <h2>{product.title}</h2>
                <h5>{product.category}</h5>
                <p>{product.description}</p>
                <h5>
                  (${product.price})
                  <button onClick={() => onAddCartItem(product)}>
                    Add to cart
                  </button>
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

//view for shopping basket
const Basket =({products, onRemoveCartItem, total}) => {
  return(
    <>
    <div className='title'>Your Basket {!products.length ? "" : products.length}</div>
    <div className='basket'>
      {
        !products.length
        ? "No Item"
        : products.map((product) => (
          <p key={product.id}>
            {product.title} (${product.price})
            <button onClick={() => onRemoveCartItem(product) }>Remove</button>
          </p>
        ))
        //changed below product to products
      }
      {!products.length ? " " : <div className="total">TOTAL: ${total}</div>}
    </div>
  </>
  )
}


//define cart stsate using atom
const cartState = atom({
  key: 'cartState',
  default: [],
});


function App() {
  //set the state like react usestate
  const [cart, setCart] = useRecoilState(cartState);

  //set the cart total 
  const [{total}, setTotalFromSelector] = useRecoilState(cartTotalState)
  
  //add product to basket
  const AddCartItem = () => {
    setCart((cart) => {
      cart.find((item) => item.id === product.id)
      ? cart 
      : [...cart,product]
    });
  };

  //remove product from cart
  const removeCartItem = (product) => {
    setCart((cart) => cart.filter((item) => item.id !== product.ID))
  }
  
  return (
    <div>
      <React.Suspense fallback={<div>Loading ...</div>}>
        <FakeProducts onAddCartItem={AddCartItem}></FakeProducts>
      </React.Suspense>
       
      <div className="floatcart">
        <Basket total={total} setCart={setTotalFromSelector} products={cart} onRemoveCartItem={removeCartItem}/>
      </div>
    </div>
  );
}

export default App;

// const client = new QueryClient();
// <QueryClientProvider client={client}>
//   <div className="App">
//     <Fetch />
//   </div>
// </QueryClientProvider>
