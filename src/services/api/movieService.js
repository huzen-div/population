import { client } from './configs/axiosConfigs';
import { MOVIE_API_KEY } from "../../utils/constants";
export const movieService = {
    searchMovie: async (keyword) => {
        try {
            let response = await client.get(`/search/movie?api_key=${MOVIE_API_KEY}&query=${keyword}`);
            if(!response.status){
                console.log(response);
            }
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
}
