import React, { useState } from "react";
import "./Search.css";
import DateTime from "./DateTime";
import axios from "axios";
import Loader from "react-loader-spinner";
import Weather from "./Weather";
import WeatherIcon from "./WeatherIcon";
import MaxMinTemps from "./MaxMinTemps";
import WeatherConditions from "./WeatherConditions";
import Temperature from "./Temperature";

export default function Search(props) {
  const [weatherData, setWeatherDate] = useState({ ready: false });
  const [city, setCity] = useState(props.defaultCity);
  const [unit, setUnit] = useState("metric");
  const [className, setClassName] = useState({
    metric: "notActive",
    imperial: "isActive",
  });

  function search() {
    let apiKey = `3fb188379e6ffcf616e7cdbd010c6434`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(handleResponse);
  }

  function handleSubmit(event) {
    event.preventDefault();
    search();
  }

  function updateCity(event) {
    setCity(event.target.value);
  }

  function convertToFarhen(event) {
    event.preventDefault();
    setUnit("imperial");
    search();
    setClassName({ metric: "isActive", imperial: "notActive" });
  }
  function convertToCelcius(event) {
    event.preventDefault();
    setUnit("metric");
    search();
    setClassName({ metric: "notActive", imperial: "isActive" });
  }

  function handleResponse(response) {
    setWeatherDate({
      ready: true,
      city: response.data.name,
      temperature: Math.round(response.data.main.temp),
      wind: response.data.wind.speed,
      feelsLike: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      date: new Date(response.data.dt * 1000),
      maxTemp: Math.round(response.data.main.temp_max),
      minTemp: Math.round(response.data.main.temp_min),
      icon: response.data.weather[0].icon,
    });
  }
  if (weatherData.ready) {
    return (
      <div className="Search">
        <div className="row">
          <form className="col-7" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-7 form-search">
                <input
                  type="search"
                  placeholder="Enter a city..."
                  className="form-control"
                  onChange={updateCity}
                />
              </div>
              <div className="col-5 search">
                <input
                  type="submit"
                  value="Search"
                  className="btn btn-control btn-primary"
                />
              </div>
            </div>
          </form>
          <div className="col-3 form-search">
            <button className="btn btn-control">Current</button>
          </div>
          <div className="col-2 clearfix">
            <WeatherIcon code={weatherData.icon} />
          </div>
        </div>
        <div className="row">
          <div className="col-6 ">
            <DateTime date={weatherData.date} />
          </div>
          <div className="col-6 maxMinTemps">
            <MaxMinTemps weatherData={weatherData} />
          </div>
        </div>
        <Weather weatherData={weatherData} />
        <div className="tempUnits">
          <div className="temp">
            <Temperature temperature={weatherData.temperature} />
          </div>
          <div className="units">
            °
            <a href="/" className={className.metric} onClick={convertToCelcius}>
              C
            </a>{" "}
            |{" "}
            <a
              href="/"
              className={className.imperial}
              onClick={convertToFarhen}
            >
              °F
            </a>
          </div>
        </div>
        <div className="weatherConditions">
          <WeatherConditions data={weatherData} />
        </div>
        <hr />
      </div>
    );
  } else {
    search();
    return (
      <div className="container row">
        <div className="col-3"></div>
        <div className="col-4">
          <Loader
            type="Puff"
            color="#757a79"
            height={200}
            width={200}
            timeout={4000}
          />
        </div>
        <div className="col-3"></div>
      </div>
    );
  }
}