import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IoFilterSharp } from "react-icons/io5";


interface City {
    id:any;
  name: string;
  country: string;
  timezone: string;
  lon:string;
  lat:string;
  weather?: WeatherInfo;
}

interface WeatherInfo {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
}


const CitiesTable: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'country' | 'timezone' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchdata= async ()=>{

try{
    const response =await axios.get("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100")
console.log("response",response.data.results)
setCities(response.data.results.map((city: any) => ({
    id:city.geoname_id,
    name: city.name,
    country: city.cou_name_en,
    timezone: city.timezone,
    lon:city.coordinates.lon,
    lat:city.coordinates.lat
  })));


}


catch(error:any){
console.log(error.response.data.message)
}
    }
    fetchdata();
  }, []);

  const handleCityClick = (cityName: string,lan:string,lat:string) => {
    navigate(`/weatherinfo/${lan}/${lat}/${cityName}`);
};


  const handleSort = (column: 'name' | 'country' | 'timezone') => {
    if (sortBy === column) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
        setSortBy(column);
        setSortOrder('asc');
    }
};

const sortedCities = [...cities].sort((a, b) => {
    if (sortBy) {
        const comparison = a[sortBy].localeCompare(b[sortBy]);
        return sortOrder === 'asc' ? comparison : -comparison;
    }
    return 0;
});

const filteredCities = sortedCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
);



const kelvinToCelsius = (tempKelvin:string) => {
    return parseFloat(tempKelvin) - 273.15;
};

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className='text-center text-lime-500  text-4xl font-bold'>Weather Forecast Web Application</h1>
           <div className='flex'> <input
                type="text"
                placeholder="Search city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
            /><IoFilterSharp size={30} /></div>


            <table className="w-full table-fixed">
                <thead>
                <tr className="bg-gray-200">
                        <th className="px-4 py-2 bg-slate-600" >City Name</th>
                        <th className="px-4 py-2  bg-slate-600" >Country</th>
                        <th className="px-4 py-2  bg-slate-600">Timezone</th>

                    </tr>

                </thead>
                <tbody>
                {cities.filter(city => city.name.toLowerCase().includes(searchTerm.toLowerCase())).map(city => (
                        <tr key={city.id} className="border-b border-gray-200 hover:pointer">
                            <td className="px-4 py-2 text-center hover:pointer" onClick={() => handleCityClick(city.name,city.lon,city.lat)}>{city.name}</td>

                            <td className="px-4 py-2 text-center">{city.country}</td>
                            <td className="px-4 py-2 text-center">{city.timezone}</td>

                        </tr>
                    ))}
                    {/* {filteredCities.map(city => (
                        <tr key={city.id} className="border-b border-gray-200">
                            <td className="px-4 py-2 text-center" onClick={() => handleCityClick(city.name)}>{city.name}</td>
                            <td className="px-4 py-2 text-center">{city.country}</td>
                            <td className="px-4 py-2 text-center">{city.timezone}</td>
                        </tr>
                    ))} */}
                </tbody>
            </table>
        </div>
  );
};



export default CitiesTable;
