import { csrfFetch } from './csrf.js';

const GET_SPOTS = 'spots/GET_SPOTS';
const GET_SPOT  = 'spots/GET_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT'

const getSpotsAction = spots => ({
  type: GET_SPOTS,
  spots
})

const getSpotAction = spot => ({
  type: GET_SPOT,
  spot
})

const deleteSpotAction = id => ({
  type: DELETE_SPOT,
  id
})

// TODO: update method to use search params
export const getSpots = ( selection, search ) => async dispatch => {
  let response;
  if( !search ) search = '';    
 
  // tried a switch here and it didn't work. Weird.  
  if( selection === 'my-spots'){ 
    response = await csrfFetch('/api/spots/my-spots' + search)
  }else if( selection === 'favorites'){
    response = await csrfFetch('/api/spots/favorites' + search)
  } else {
    response = await csrfFetch('/api/spots' + search);
  }

  const data = await response.json();

  if( response.ok ){
    await dispatch(getSpotsAction(data.spots));
    return null; 
  } else {
    //return data?.errors;
  }
}

export const getSpot = id => async dispatch => {
  const response = await fetch(`/api/spots/${id}`);
  const data = await response.json();

  if( response.ok ){
    await dispatch(getSpotAction(data.spot))
  } else {
    return data?.errors
  }
}

export const postSpot = spotToPost => async dispatch => {
  const response = await csrfFetch('/api/spots',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(spotToPost)
  })
  const data = await response.json();
  
  if( response.ok ){
    await dispatch(getSpotAction(data.spot));
    return { errors: [], ok: true, id: data.spot.id }
  } else {
    return { errors: data.errors , ok: false, id: null, message: data.message }
  }
}

export const deleteSpot = id => async dispatch => {
  const response = await csrfFetch(`/api/spots/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();

  if( response.ok ){
    await dispatch(deleteSpotAction(id));
    return true;
  } else {
    return false;
  }
  
}

export const addReview = (spot, body) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spot.id}/reviews`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({body})
  }) 
  const data = await response.json();
  
  if( response.ok ){
    await dispatch(getSpotAction(data.spot))
    return {ok: true, reviews: data.spot.Reviews};
  } else {
    return {ok: false, errors: data.errors}
  } 

}  

export default function spotsReducer(state = null, action) {
  let newState = {};
  switch(action.type){
    case GET_SPOTS:
      action.spots.forEach( spot => newState[spot.id] = spot)
      return newState;
    case GET_SPOT:
      return {...state, [action.spot.id]: action.spot}
    case DELETE_SPOT:
      delete state[action.id];  
      return {...state};
    default:
      return state;
  }
}
