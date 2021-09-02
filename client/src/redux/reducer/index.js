import { GET_PRODUCTS, GET_CATEGORIES, GET_PRODUCTS_BY_NAME } from '../actions/index';

const initialState = {
  products: [], // todos los products cargados de getProducts
  categories: [],
  loading: false,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      }
    case GET_PRODUCTS_BY_NAME:
      return {
        ...state,
        products: action.payload,
      }
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      }
    default:
      return state;
  }
};

export default rootReducer;
