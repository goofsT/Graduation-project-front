import $api from "./index";

export const getWeather=()=>{
    return $api.get('/getWeather')
}