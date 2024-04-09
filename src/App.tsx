import React from 'react'
import CitiesTable from './CitiesTable'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import WeatherPage from './WeatherPage'
function App() {
  return (
    <BrowserRouter>
    <Routes>
<Route path="/" element={<CitiesTable />}></Route>
<Route path="/weatherinfo/:lan/:lat/:cityname" element={<WeatherPage />} />

    </Routes>
     
    </BrowserRouter>
  )
}

export default App
