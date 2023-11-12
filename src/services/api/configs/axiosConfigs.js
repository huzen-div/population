import axios from "axios";
import { MOVIE_SERVICE } from "../../../utils/constants";

export const client = axios.create({
  withCredentials: false,
  baseURL: `${MOVIE_SERVICE}`,
})

const errorHandler = (error) => {
  const statusCode = error.response?.status
  if(statusCode){
    if(statusCode === 400){
      alert(error.response.data.data);
    }
    else if (statusCode !== 401) {
      console.error(error)
    }
  }
  else{
    alert(error.message);
  }
  return Promise.reject(error)
}

client.interceptors.response.use(undefined, (error) => {
  return errorHandler(error)
})