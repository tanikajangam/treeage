
import * as React from 'react';
import { useState, useEffect } from 'react';
import './app.css';
import ReactMapGL from 'react-map-gl';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { SearchBox, AddressAutofill } from '@mapbox/search-js-react';
import axios from 'axios';
import logo from "./treeage.svg";

import Register from "./components/Register";
import Login from "./components/Login";
import { format } from 'timeago.js'

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidGFuaWthaiIsImEiOiJjbGc2bm9jZTMwZjJhM2xsaWhteDA2cjl6In0.yawymlSRDbMOJ8Csr8IyzA'; // Set your mapbox token here

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(null);
  const [trees, setTrees] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newTree, setNewTree] = useState(null);
  const [species, setSpecies] = useState(null);
  const [moisture, setMoisture] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPopup, setShowPopup] = React.useState(true);
  const [value, setValue] = React.useState('');
  // const CurrentUser = "john"

  useEffect(() => {
    setShowPopup(true)
    const getTrees = async () => {
      try {
        const res = await axios.get("/trees");
        setTrees(res.data);
        console.log(res.data);

      } catch (err) {
        console.log(err)
      }
    };
    getTrees();
  }, []);

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id)
  }

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat.wrap();

    setNewTree({
      lat,
      lng,
    });
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const NewTreePin = {
      species,
      moisture,
      latitude: newTree.lat,
      longitude: newTree.lng
    }

    try {
      const res = await axios.post("/trees", NewTreePin)
      setTrees([...trees, res.data]);
      setNewTree(null);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <div className="header sub-header">

        <img className="logo" src={logo}></img>

        <div className="sub-header">
          {/* <img className="weather" src={weather}></img> */}
          <div>
            <span>0 inches</span>
            <br></br>
            24 hour precipitation
          </div>
        </div>

        <div className="sub-header">
          {/* <img className="rain" src={rain}></img> */}
          <div>
            <span>0.02 inches</span>
            <br></br>
            72 hour precipitation
          </div>
        </div>

        <div className="sub-header">
          {/* <img className="weather" src={weather}></img> */}
          <div>
            <span>65 degrees</span>
            <br></br>
            Average Temperature
          </div>
        </div>


        {currentUser ? (
          <button className="button logout">Log out</button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>Log in</button>
            <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />
        )}
      </div>

      <div className="location-header-wrapper">
        <div className="location-header">
          {/* <img src={redpin}></img> */}
          Washington DC., MD

          <div className="switch-wrapper">
            <p>View Table</p>
            <label className="switch">
              <input type="checkbox"></input>
              <span className="slider round"></span>
            </label>
            <p>View Map</p>
          </div>
          <form>

          </form>
        </div>
      </div>

      <Map
        initialViewState={{
          latitude: 38.913868,
          longitude: -77.019411,
          zoom: 16
        }}
        style={{ width: "100vw", height: "90vh" }}
        mapStyle="mapbox://styles/tanikaj/clg4l1sws006n01qohnzxyw3y"
        mapboxAccessToken={MAPBOX_TOKEN}
        onDblClick={handleAddClick}

      >
        <NavigationControl position='bottom-left' />
        {/* <Marker longitude={-77.019411} latitude={38.92} anchor="bottom" color="red" /> */}

        <form className="search-bar">
          <AddressAutofill accessToken="pk.eyJ1IjoidGFuaWthaiIsImEiOiJjbGc2bm9jZTMwZjJhM2xsaWhteDA2cjl6In0.yawymlSRDbMOJ8Csr8IyzA">
            <input
              name="address" placeholder="Address" type="text"
              autoComplete="address-line1"
            />
          </AddressAutofill>

        </form>

        {trees.map((t) => (
          <>
            {console.log(t.latitude)}
            {console.log(t.longitude)}
            <Marker style={{ cursor: "pointer" }} key={t.longitude / t.latitude} longitude={t.longitude} latitude={t.latitude} color="red"
              onClick={() => handleMarkerClick(t._id)} />

            {t._id === currentPlaceId && showPopup && (
              <Popup longitude={t.longitude} latitude={t.latitude}
                anchor="top"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}>
                <div className="card">
                  <label className="species">{t.species}</label>
                  <label className="moisture">{t.moisture}</label>
                  <label className="Information">Information</label>
                  {/* <span className="username">Created by <b>{t.user}</b></span> */}
                  <span className="date">{format(t.createdAt)}</span>
                </div>
              </Popup >
            )
            }
          </>
        ))
        }
        {newTree &&
          < Popup longitude={newTree.lng} latitude={newTree.lat}
            anchor="top"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewTree(null)}>
            <div>
              <form className="addTree" onSubmit={handleSubmit}>
                <label>Add New Tree</label>
                <br></br>
                <label>Species</label>
                <input placeholder="enter a species" onChange={(e) => setSpecies(e.target.value)} />
                <br></br>
                <label>Moisture</label>
                <br></br>
                <input placeholder="enter the moisture level" onChange={(e) => setMoisture(e.target.value)} />
                <br></br>
                <button className="submitButton" type="submit">Add Tree</button>
              </form>
            </div>
          </Popup >
        }

        <div className="filters">
          <h1>Filters</h1>
          <hr></hr>
          <label>Species</label>
          <select name="cars" id="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
          <br></br>
          <label>Diameter</label>
          <select name="cars" id="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
          <br></br>
          <label>Plant Age</label>
          <select name="cars" id="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
          <br></br>
          <label>Moisture</label>
          <input type="range"></input>
          <div className="filterbtn">
            <button className="">Clear Filters</button>
            <button>Apply Filters</button>
          </div>

        </div>
      </Map >
    </div >
  );
}
export default App;