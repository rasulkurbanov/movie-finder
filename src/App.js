import React, { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Search from "./components/Search/Search";
import Movie from "./components/Movie/Movie";

const MOVIE_API_URL = "https://omdbapi.com/?s=Ali&apikey=a1a0ccac";

//Creating initial state
let initialState = {
  loading: true,
  movies: [],
  errorMsg: null
}

//Initializing reducer function
function reducer(state, action) {
  switch(action.type) {
    case "SEARCH_MOVIE_REQUEST": 
      return {
        ...state,
        loading: true,
        errorMsg: null
      }
    case "SEARCH_MOVIE_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload,
        errorMsg: null
      }
    case "SEARCH_MOVIE_ERROR":
      return {
        ...state,
        loading: false,
        errorMsg: action.error
      }
    default:
      return state  
  }
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(MOVIE_API_URL)
      const data = await response.json()
      
      if(data.Response === "True") {
        dispatch({
          type: "SEARCH_MOVIE_SUCCESS",
          payload: data.Search
        })
       
      }
      else {
        dispatch({
          type: "SEARCH_MOVIE_ERROR",
          payload: data.Error
        })
      }
    }
    fetchData()
  }, [])




  const search = async (searchValue) => {
      dispatch({
        type: "SEARCH_MOVIE_REQUEST"
      })

      const response = await fetch(
        `https://omdbapi.com/?s=${searchValue}&apikey=a1a0ccac`
      );
      const data = await response.json()

      if(data.Response === "True") {
        dispatch({
          type: "SEARCH_MOVIE_SUCCESS",
          payload: data.Search
        })
      }
      else {
        dispatch({
          type: "SEARCH_MOVIE_ERROR",
          payload: data.Error
        })
      }
  };

  const {loading, errorMsg, movies} = state

  return (
    <div className="App">
      <Header text="MOVIE-APP" />
      <Search search={search} />
      <div className="movies">
        {loading && !errorMsg ? (<span>loading...</span>) : errorMsg ? (
          <div className="errorMessage">{errorMsg}</div> ) : (
            movies.map((movie, index) => (
              <Movie key={`${index}-${movie.Title}`} movie={movie} />
            ))
        )}
      </div>
    </div>
  );
}

export default App;
