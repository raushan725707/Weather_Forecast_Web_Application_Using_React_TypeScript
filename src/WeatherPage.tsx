import { useEffect ,useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
interface WeatherInfo {
    id:string,
    temperature: string;
    weather:string;
    description: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
  }

  interface ForecastInfo{
    id:string,
    dt_txt:string,
    temp_min:string,
    temp_max:string
    description: string;
precipition:string;
feellike:string
  }


  const WeatherPage: React.FC = () => {
   // const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
    const [weatherInfo, setWeatherInfo] = useState<WeatherInfo[]>([]);
    const [forecastinfo, setForecastInfo] = useState<ForecastInfo[]>([]);


    const { cityName, lan, lat } = useParams<{ cityName: string, lan: string, lat: string }>();
const apikey:string="d74011293fa4193bdea29a5b7615e0df";
useEffect(() => {
    const fetchData = async () => {
        try {
            const [currentWeatherResponse, forecastResponse] = await Promise.all([
                axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lan}&appid=${apikey}`),
                axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lan}&appid=${apikey}`)
            ]);
            const currentWeatherData = currentWeatherResponse.data;
            console.log("Current weather data : ", currentWeatherData);
            const currentWeather: WeatherInfo = {
                id: currentWeatherData.id,
                temperature: currentWeatherData.main.temp,
                weather: currentWeatherData.weather[0].main,
                description: currentWeatherData.weather[0].description,
                humidity: currentWeatherData.main.humidity,
                windSpeed: currentWeatherData.wind.speed,
                pressure: currentWeatherData.main.pressure
            };

            // Update weatherInfo state with current weather data
            setWeatherInfo([currentWeather]);
            const  forecastdata=forecastResponse.data.list;
            console.log("check",forecastdata)
            console.log("typeof",typeof forecastdata)
            const forecasts: ForecastInfo[] = forecastdata.map((item: any) => ({
              id: item.id,
              dt_txt: item.dt_txt,
              temp_min: item.main.temp_min,
              temp_max: item.main.temp_max,
              description: item.weather[0].description, // Assuming weather is an array, so we access the first element
              precipition: item.pop,
              feellike: item.main.feels_like
            }));
            
            console.log("Forecasts:", forecasts);
           setForecastInfo(forecasts)
            console.log("Current weather response:", currentWeatherResponse);
            console.log("Forecast response:", forecastResponse);
        } catch (error:any) {
            console.log("Error:", error.response ? error.response.data.message : error.message);
        }
    };
    
    fetchData();
}, []);

  
    if (!weatherInfo) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-center text-5xl font-bold">Current Weather</h1>
<br />
<table className="w-full table-fixed" >
                <thead>
                <tr className="bg-slate-500">
                        <th className="px-4 py-2" >Temperature</th>
                        <th className="px-4 py-2" >Weather</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Humidity</th>
                        <th className="px-4 py-2">WindSpeed</th>
                        <th className="px-4 py-2">Pressure</th>


                    </tr>

                </thead>
<tbody>
  {weatherInfo.map((info: WeatherInfo) => (
    <tr key={info.id}>
      <td className="px-4 py-2 text-center" >{  (parseFloat(info.temperature) - 273.15).toFixed(2)}</td>
      <td className="px-4 py-2 text-center">{info.weather}</td>
      <td className="px-4 py-2 text-center">{info.description}</td>
      <td className="px-4 py-2 text-center">{info.humidity}%</td>
      <td className="px-4 py-2 text-center">{info.windSpeed}km/h</td>
      <td className="px-4 py-2 text-center">{info.pressure}Pa</td>
    
    </tr>
  ))}
</tbody>
</table>
<br />
<h1 className="text-center text-5xl  font-bold">Forecast Prediction For next 5 days</h1>
<br />

<table className="w-full table-fixed ">
  <thead>
  <tr className="bg-slate-500">
                        <th className="px-4 py-2" >Date</th>
                        <th className="px-4 py-2" >Max_Temp</th>
                        <th className="px-4 py-2">Min_Temp</th>
                        <th className="px-4 py-2">Feel_Like</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Precipition</th>


                    </tr>
  </thead>
  <tbody>
  {forecastinfo.map((info: ForecastInfo) => (
    <tr key={info.id}>
            <td className="px-4 py-2 text-center text-black-200">{info.dt_txt}</td>

      <td className="px-4 py-2 text-center ">{  (parseFloat(info.temp_max) - 273.15).toFixed(2)}</td>
      <td className="px-4 py-2 text-center">{  (parseFloat(info.temp_min) - 273.15).toFixed(2)}</td>
      <td className="px-4 py-2 text-center">{  (parseFloat(info.feellike) - 273.15).toFixed(2)}</td>
      <td className="px-4 py-2 text-center">{info.description}</td>
      <td className="px-4 py-2 text-center">{info.precipition}%</td>



    
      </tr>
  ))}

  </tbody>
</table>
      </div>
    );
  };
  export default WeatherPage;
  