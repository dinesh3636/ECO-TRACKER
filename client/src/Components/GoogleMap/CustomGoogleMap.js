
import { useRef, useState } from "react";
// this global google is important to make google global
/* global google */ 
import { useEffect } from "react";

import axios from "axios";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { set, size } from "lodash";

// const center = { lat: 48.8584, lng: 2.2945 }



function CustomGoogleMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [center, setCenter] = useState({ lat: 12.8699, lng: 80.2184 });
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [traffic, setTraffic] = useState('')
  const [elevation, setElevation] = useState('')
  const [routeIndex, setRouteIndex] = useState(0) // initially select first route
const [nnew , setNnew]= useState(0)
  const [newTraffic, setNewTraffic] = useState('');
  
  const [durationInMins, setDurationInMins] = useState(0);
  const [trafficInMins, setTrafficInMins] = useState(0);

  const[fuel, setFuel]= useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [fuelTypes, setFuelTypes] = useState([]);
  const [fuelSpecifications, setFuelSpecifications] = useState({
    engineSpecs: '',
    fuelEfficiency: '',
    co2Emissions: '',
  });
  const [roadType ,setRoadType] = useState(null); 

  const [predictedEmissions, setPredictedEmissions] = useState(null);

  // Mock data (replace with actual API calls if needed)
  const vehicleTypes = ['Car', 'Bike'];

  const carBrands = ['Toyota', 'Honda', 'Volkswagen', 'Hyundai', 'Tata', 'Mahindra', 'Maruti Suzuki'];
  const carModels = {
    "Maruti Suzuki": ['Vitara Brezza', 'Ignis', 'Ciaz', 'Alto', 'Celerio'],
    "Volkswagen": ['Polo', 'Vento', 'Taigun', 'Beetle', 'Jetta', 'Golf', 'Lavida'],
    "Hyundai": ['Grand i10', 'i20', 'Aura', 'Verna', 'Venue', 'Elantra', 'Creta', 'Alcazar', 'Tucson', 'Kona Electric'],
    "Tata": ['Tigor', 'Nano', 'Zest', 'Safari', 'Harrier', 'Indigo', 'Indica', 'Bolt', 'Vista'],
    "Mahindra": ['Thar', 'XUV300', 'Bolero', 'Scorpio', 'Marazzo', 'KUV100 NXT', 'XUV500', 'TUV300', 'Alturas G4', 'e20Plus'],
    "Honda": ['Jazz', 'Amaze', 'City', 'WR-V', 'CR-V', 'Accord Hybrid'],
    "Toyota": ['Camry']
  };

  const bikeBrands = ['Yamaha','TVS','Bajaj','Honda','Suzuki','Honda','Hero','Royal Enfield','Kawasaki','KTM'];
  const bikeModels = {
    "Yamaha" : ['RX 100','FZ','MT','R15','YZF-R1','MT-15','FZS-FI Version 3.0','FZ-S V3.0 FI'],
    "TVS": ['Apache','XL','Jupiter','Star City','Scooty','Apache RTR','Apache RTR 160 4V'],
    "Bajaj":['Platina','Avenger','Hornet','CT 100','Pulsar','Discover','Pulsar NS200'],
    "Honda":['Dio','CB Hornet 160R','Activa 6G'],
    "Suzuki":['Burgman','Access','Gixxer','Gixxer SF','Access 125'],
    "Honda":['Activa','Grazia','CB Hornet 160R'],
    "Hero":['Splendor'],
    "Royal Enfield":['Classic','Classic 350'],
    "Kawasaki":['Ninja 300'],
    "KTM":['Duke 390','Duke 200']
  };

  const fuelTypesData = {
    'Vitara Brezza': ['Petrol', 'Diesel'],
  'Vento': ['Petrol', 'Diesel'],
  'Taigun': ['Petrol', 'Diesel'],
  'Beetle': ['Petrol', 'Diesel'],
  'Jetta': ['Petrol', 'Diesel'],
  'Gofl': ['Petrol', 'Diesel'],
  'Lavida': ['Petrol', 'Diesel'],
  'Tigor': ['Petrol', 'Diesel'],
  'Nano': ['Petrol', 'Diesel'],
  'Zest': ['Petrol', 'Diesel'],
  'Safari': ['Petrol', 'Diesel'],
  'Harrier': ['Petrol', 'Diesel'],
  'Indigo': ['Petrol', 'Diesel'],
  'Indica': ['Petrol', 'Diesel'],
  'Bolt': ['Petrol', 'Diesel'],
  'Vista': ['Petrol', 'Diesel'],
  'Thar': ['Petrol', 'Diesel'],
  'XUV300': ['Petrol', 'Diesel'],
  'Bolero': ['Petrol', 'Diesel'],
  'Scorpio': ['Petrol', 'Diesel'],
  'Marazzo': ['Petrol', 'Diesel'],
  'KUV100 NXT': ['Petrol', 'Diesel'],
  'XUV500': ['Petrol', 'Diesel'],
  'TUV300': ['Petrol', 'Diesel'],
  'City': ['Petrol', 'Diesel'],
  'Ignis': ['Petrol', 'Diesel'],
  'Alto': ['Petrol', 'Diesel'],
  'Celerio': ['Petrol', 'Diesel'],
  'S-Presso': ['Petrol', 'Diesel'],
  'Polo': ['Petrol', 'Diesel'],
  'Grand i10': ['Petrol', 'Diesel'],
  'Grand i10 Nios': ['Petrol', 'Diesel'],
  'i20': ['Petrol', 'Diesel'],
  'Aura': ['Petrol', 'Diesel'],
  'Verna': ['Petrol', 'Diesel'],
  'Venue': ['Petrol', 'Diesel'],
  'Elantra': ['Petrol', 'Diesel'],
  'Creta': ['Petrol', 'Diesel'],
  'Alcazar': ['Petrol', 'Diesel'],
  'Tucson': ['Petrol', 'Diesel'],
  'Jazz': ['Petrol', 'Diesel'],
  'Amaze': ['Petrol', 'Diesel'],
  'WR-V': ['Petrol', 'Diesel'],
  'CR-V': ['Petrol', 'Diesel'],
    // Add more fuel types for other models
  };



const modelData={
    'Vitara Brezza': {
      'Petrol': { engineSpecs: 1.5, fuelEfficiency: 16.8, co2Emissions: 136},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 16.8, co2Emissions: 136 },
    },
  'Polo': {
      'Petrol': { engineSpecs: 1, fuelEfficiency: 20.425, co2Emissions: 131.25},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 21.425, co2Emissions: 125.95 },
    },
'Vento': {
      'Petrol': { engineSpecs: 1.6, fuelEfficiency: 18.725,co2Emissions: 141.35},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 21.425, co2Emissions: 125.95 },
    },
'Taigun':{
      'Petrol': { engineSpecs: 1.5,fuelEfficiency: 16.975,co2Emissions: 150.6},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 19.875, co2Emissions: 134.8},
    },
'Beetle':{
      'Petrol': { engineSpecs: 1.4,fuelEfficiency: 14.65,co2Emissions: 169.8},
       'Diesel': { engineSpecs: 1.6, fuelEfficiency: 18.55, co2Emissions: 143.4},
    },
'Jetta':{
      'Petrol': { engineSpecs: 1.4,fuelEfficiency: 14.75,co2Emissions: 167.10},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 19.875, co2Emissions: 134.8},
    },
'Gofl':{
      'Petrol': { engineSpecs: 1.5,fuelEfficiency: 19.2,co2Emissions: 145.792},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 19.875, co2Emissions: 134.8},
    },
'Lavida':{
      'Petrol': { engineSpecs: 1.6,fuelEfficiency: 16.9,co2Emissions: 150.6},
       'Diesel': { engineSpecs: 1.6, fuelEfficiency: 18.575, co2Emissions: 142.3},
    },
'Tigor':{
      'Petrol': { engineSpecs: 1.2,fuelEfficiency: 20,co2Emissions: 120},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 19.875, co2Emissions: 134.8},
    },
'Nano':{
      'Petrol': { engineSpecs: 0.6,fuelEfficiency: 33.3,co2Emissions: 200},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 19.875, co2Emissions: 134.8},
    },
'Zest':{
      'Petrol': { engineSpecs: 1.2,fuelEfficiency: 20,co2Emissions: 150},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 19.875, co2Emissions: 134.8},
    },
'Safari':{
      'Petrol': { engineSpecs: 2.1,fuelEfficiency: 13.5,co2Emissions: 190},
       'Diesel': { engineSpecs: 2.1, fuelEfficiency: 13.5, co2Emissions: 190},
    },
'Harrier':{
      'Petrol': { engineSpecs: 1.72,fuelEfficiency: 15.5,co2Emissions: 120},
       'Diesel': { engineSpecs: 1.72, fuelEfficiency: 15.5, co2Emissions: 120},
    },
'Indigo':{
      'Petrol': { engineSpecs: 1.32,fuelEfficiency: 17.3,co2Emissions: 124},
       'Diesel': { engineSpecs: 1.32, fuelEfficiency: 17.3, co2Emissions: 124},
    },
'Indica':{
      'Petrol': { engineSpecs: 1.3,fuelEfficiency: 16.6,co2Emissions: 109.33},
       'Diesel': { engineSpecs: 1.3, fuelEfficiency: 16.6, co2Emissions: 109.33},
    },
'Bolt':{
      'Petrol': { engineSpecs: 1.33,fuelEfficiency: 20,co2Emissions: 95},
       'Diesel': { engineSpecs: 1.33, fuelEfficiency: 20, co2Emissions: 95},
    },
'Vista':{
      'Petrol': { engineSpecs: 1.3,fuelEfficiency: 18,co2Emissions: 107.5},
       'Diesel': { engineSpecs: 1.3, fuelEfficiency: 18, co2Emissions: 107.5},
    },
'Thar':{
      'Petrol': { engineSpecs: 1.5,fuelEfficiency: 12.5,co2Emissions: 187.5},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 19.875, co2Emissions: 134.8},
    },
'XUV300':{
      'Petrol': { engineSpecs: 1.344,fuelEfficiency: 18.3,co2Emissions: 112.5},
       'Diesel': { engineSpecs: 1.344, fuelEfficiency: 18.3, co2Emissions: 112.5},
    },
'Bolero':{
      'Petrol': { engineSpecs: 1.5,fuelEfficiency: 16.975,co2Emissions: 150},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 16.975, co2Emissions: 150},
    },
'Scorpio':{
      'Petrol': { engineSpecs: 1.5,fuelEfficiency: 16.975,co2Emissions: 150.6},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 19.875, co2Emissions: 134.8},
    },
'Marazzo':{
      'Petrol': { engineSpecs: 1.5,fuelEfficiency: 18,co2Emissions: 140},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 18, co2Emissions: 140},
    },
'KUV100 NXT':{
      'Petrol': { engineSpecs: 1.2,fuelEfficiency: 21.5,co2Emissions: 107.5},
       'Diesel': { engineSpecs: 1.2, fuelEfficiency: 21.5, co2Emissions: 134.8},
    },
'XUV500':{
      'Petrol': { engineSpecs: 2.1,fuelEfficiency: 13.96,co2Emissions: 178.08},
       'Diesel': { engineSpecs: 2.1, fuelEfficiency: 13.96, co2Emissions: 173.08},
    },
'TUV300':{
      'Petrol': { engineSpecs: 1.35,fuelEfficiency: 14.56,co2Emissions: 171.6},
       'Diesel': { engineSpecs: 1.35, fuelEfficiency: 14.56, co2Emissions: 171.6},
    },
'City':{
      'Petrol': { engineSpecs: 1.5,fuelEfficiency: 21.12,co2Emissions: 105},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 21.12, co2Emissions: 105},
    },

  };

  const bikefuelTypes = {
    'Platina': {
      'Petrol': { engineSpecs: 125, fuelEfficiency: 61.3, co2Emissions: 78.4},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 16.8, co2Emissions: 136 },
    },
'Dio':{
      'Petrol': { engineSpecs: 109,fuelEfficiency: 55.8,co2Emissions: 74.125},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 21.12, co2Emissions: 105},
    },
'XL':{
      'Petrol': { engineSpecs: 99,fuelEfficiency: 57.86,co2Emissions: 92.64},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 21.12, co2Emissions: 105},
    },
'Avenger':{
      'Petrol': { engineSpecs: 160,fuelEfficiency: 33,co2Emissions: 189.8},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 21.12, co2Emissions: 105},
    },
'Hornet':{
      'Petrol': { engineSpecs: 160,fuelEfficiency: 33,co2Emissions: 189.8},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 21.12, co2Emissions: 105},
    },
'CT 100':{
      'Petrol': { engineSpecs: 1.5,fuelEfficiency: 21.12,co2Emissions: 105},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 21.12, co2Emissions: 105},
    },
'Burgman':{
      'Petrol': { engineSpecs: 125,fuelEfficiency: 30.16,co2Emissions: 196.64},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 21.12, co2Emissions: 105},
    },
'Activa':{
      'Petrol': { engineSpecs: 110,fuelEfficiency: 40.96,co2Emissions: 90.176},
       'Diesel': { engineSpecs: 110, fuelEfficiency: 40.96, co2Emissions: 90.176},
    },
'splendor':{
      'Petrol': { engineSpecs: 97,fuelEfficiency: 70,co2Emissions: 140},
       'Diesel': { engineSpecs: 97, fuelEfficiency: 70, co2Emissions: 140},
    },
'Jupiter':{
      'Petrol': { engineSpecs: 110,fuelEfficiency: 40.96,co2Emissions: 89},
       'Diesel': { engineSpecs: 110, fuelEfficiency: 40.96, co2Emissions: 89},
    },
'CT 100':{
      'Petrol': { engineSpecs: 1.5,fuelEfficiency: 21.12,co2Emissions: 105},
       'Diesel': { engineSpecs: 1.5, fuelEfficiency: 21.12, co2Emissions: 105},
    },
'Access'	:{
'petrol':{engineSpecs: 125,fuelEfficiency: 50 ,co2Emissions: 100},
'Diesel': { engineSpecs: 125, fuelEfficiency: 50, co2Emissions: 100},
},
'FZ':{
      'Petrol': { engineSpecs: 149,fuelEfficiency: 45,co2Emissions: 120},
       'Diesel': { engineSpecs: 149, fuelEfficiency: 45, co2Emissions: 120},
    },
'Pulsar':{
      'Petrol': { engineSpecs: 150,fuelEfficiency: 45,co2Emissions: 85},
       'Diesel': { engineSpecs: 150, fuelEfficiency: 45, co2Emissions: 85},
    },
'Classic':{
      'Petrol': { engineSpecs: 500,fuelEfficiency: 25,co2Emissions: 120},
       'Diesel': { engineSpecs: 500, fuelEfficiency: 25, co2Emissions: 120},
    },
'MT':{
      'Petrol': { engineSpecs: 321,fuelEfficiency: 22.6,co2Emissions: 252.93},
       'Diesel': { engineSpecs: 321, fuelEfficiency: 22.6, co2Emissions: 252.93},
    },
'Grazia':{
      'Petrol': { engineSpecs: 125,fuelEfficiency: 35,co2Emissions: 427.7},
       'Diesel': { engineSpecs: 125, fuelEfficiency: 35, co2Emissions: 427.7},
    },
'Star City':{
      'Petrol': { engineSpecs: 110,fuelEfficiency: 11.217,co2Emissions: 192.60},
       'Diesel': { engineSpecs: 110, fuelEfficiency: 11.217, co2Emissions: 192.60},
    },
'R15':{
      'Petrol': { engineSpecs: 155,fuelEfficiency: 41.7,co2Emissions: 166.68},
       'Diesel': { engineSpecs: 155, fuelEfficiency: 41.7, co2Emissions: 166.68},
    },
'Scooty':{
      'Petrol': { engineSpecs: 110,fuelEfficiency:41.6 ,co2Emissions: 166.67},
       'Diesel': { engineSpecs: 110, fuelEfficiency: 41.6, co2Emissions: 166.27},
    },
'Ninja 300':{
      'Petrol': { engineSpecs: 301.57,fuelEfficiency: 27.19,co2Emissions: 122.77},
       'Diesel': { engineSpecs: 301.57, fuelEfficiency: 27.19, co2Emissions: 122.77},
    },
'Discover':{
      'Petrol': { engineSpecs: 138.5,fuelEfficiency: 52.55,co2Emissions: 97.75},
       'Diesel': { engineSpecs: 138.5, fuelEfficiency: 52.55, co2Emissions: 97.75},
    },
'Gixxer':{
      'Petrol': { engineSpecs: 158,fuelEfficiency: 50,co2Emissions: 101.25},
       'Diesel': { engineSpecs: 158, fuelEfficiency: 50, co2Emissions: 101.25},
    },
'Apache RTR':{
      'Petrol': { engineSpecs: 188,fuelEfficiency: 39.85,co2Emissions: 120.6},
       'Diesel': { engineSpecs: 188, fuelEfficiency: 39.85, co2Emissions: 120.6},
    },
'YZF-R1':{
      'Petrol': { engineSpecs: 998,fuelEfficiency: 21.95,co2Emissions: 149.55},
       'Diesel': { engineSpecs: 998, fuelEfficiency: 21.95, co2Emissions: 149.55},
    },
'Duke 390':{
      'Petrol': { engineSpecs: 373,fuelEfficiency: 30.9,co2Emissions: 427.7},
       'Diesel': { engineSpecs: 125, fuelEfficiency: 35, co2Emissions: 427.7},
    },
'CB Hornet 160R':{
      'Petrol': { engineSpecs: 162,fuelEfficiency: 48.8,co2Emissions: 104.2},
       'Diesel': { engineSpecs: 162, fuelEfficiency: 48.8, co2Emissions: 104.2},
    },
'MT-15':{
      'Petrol': { engineSpecs: 155,fuelEfficiency: 41.25,co2Emissions: 112.3},
       'Diesel': { engineSpecs: 155, fuelEfficiency: 41.25, co2Emissions: 112.3},
    },
'Gixxer SF':{
      'Petrol': { engineSpecs: 155,fuelEfficiency: 37,co2Emissions: 115.2},
       'Diesel': { engineSpecs: 155, fuelEfficiency: 37, co2Emissions: 115.2},
    },
'Pulsar NS200':{
      'Petrol': { engineSpecs: 199,fuelEfficiency: 37.2,co2Emissions: 115.25},
       'Diesel': { engineSpecs: 199, fuelEfficiency: 37.2, co2Emissions: 115.25},
    },
'CB Hornet 160R':{
      'Petrol': { engineSpecs: 162,fuelEfficiency: 39.65,co2Emissions: 113.25},
       'Diesel': { engineSpecs: 162, fuelEfficiency: 39.65, co2Emissions: 113.25},
    },
'Apache RTR 160': {
    'Petrol': { engineSpecs: 159.7, fuelEfficiency: 45.85714286, co2Emissions: 105.0952381 },
    'Diesel': { engineSpecs: 159.7, fuelEfficiency: 45.85714286, co2Emissions: 105.0952381 },
  },
'CB Unicorn 160': {
    'Petrol': { engineSpecs: 162.71, fuelEfficiency: 54.9, co2Emissions: 94 },
    'Diesel': { engineSpecs: 162.71, fuelEfficiency: 54.9, co2Emissions: 94 },
  },
'Classic 350': {
    'Petrol': { engineSpecs: 346, fuelEfficiency: 39.65, co2Emissions: 113 },
    'Diesel': { engineSpecs: 346, fuelEfficiency: 39.65, co2Emissions: 113 },
  },
'FZ-S V3.0 FI': {
    'Petrol': { engineSpecs: 149, fuelEfficiency: 47.95, co2Emissions: 101.1 },
    'Diesel': { engineSpecs: 149, fuelEfficiency: 47.95, co2Emissions: 101.1 },
  },
'Access 125': {
    'Petrol': { engineSpecs: 124, fuelEfficiency: 62.93181818, co2Emissions: 84.34090909 },
    'Diesel': { engineSpecs: 124, fuelEfficiency: 62.93181818, co2Emissions: 84.34090909 },
  },
'Activa 6G': {
    'Petrol': { engineSpecs: 109.51, fuelEfficiency: 67.5952381, co2Emissions: 79.11904762 },
    'Diesel': { engineSpecs: 109.51, fuelEfficiency: 67.5952381, co2Emissions: 79.11904762 },
  },
'Apache RTR 160': {
    'Petrol': { engineSpecs: 159, fuelEfficiency: 47, co2Emissions: 101.7 },
    'Diesel': { engineSpecs: 159, fuelEfficiency: 47, co2Emissions: 101.7 },
  },
'CB Unicorn 150': {
    'Petrol': { engineSpecs: 149, fuelEfficiency: 58.3, co2Emissions: 91.6 },
    'Diesel': { engineSpecs: 149, fuelEfficiency: 58.3, co2Emissions: 91.6 },
  },
'Duke 200': {
    'Petrol': { engineSpecs: 200, fuelEfficiency: 37.2, co2Emissions: 115.25 },
    'Diesel': { engineSpecs: 200, fuelEfficiency: 37.2, co2Emissions: 115.25 },
  },
'Gixxer SF': {
    'Petrol': { engineSpecs: 155, fuelEfficiency: 44.45, co2Emissions: 106.05 },
    'Diesel': { engineSpecs: 155, fuelEfficiency: 44.45, co2Emissions: 106.05 },
  },
'FZS-FI Version 3.0': {
    'Petrol': { engineSpecs: 149, fuelEfficiency: 47, co2Emissions: 101.7 },
    'Diesel': { engineSpecs: 149, fuelEfficiency: 47, co2Emissions: 101.7 },
  },
'Apache RTR 160 4V': {
    'Petrol': { engineSpecs: 159, fuelEfficiency: 47, co2Emissions: 101.7 },
    'Diesel': { engineSpecs: 159, fuelEfficiency: 47, co2Emissions: 101.7 },
  }
};

  useEffect(() => {
    // Update models when the selectedBrand or selectedType changes
    if (selectedBrand && selectedType === 'Car') {
      setModels(carModels[selectedBrand] || []);
    } else if (selectedBrand && selectedType === 'Bike') {
      setModels(bikeModels[selectedBrand] || []);
    }
  }, [selectedBrand, selectedType]);

  const filteredModels = models.filter(model =>
    model.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    // Ensure selected model is available in fuelTypesData before accessing
    if (fuelTypesData[model]) {
      setFuelTypes(fuelTypesData[model]);
    } else {
      console.error(`Fuel types not available for ${model}`);
    }
  };

  const handleFuelTypeSelect = (fuelType) => {
    // You can access fuel specifications here based on the selected model and fuel type
    // setSelectedFuelType(fuelTypesData[selectedModel][fuelType]);
    setSelectedType(fuelType);
  };

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }


  // component => used to display buttons for each of the routes of a given vehicle type
  const RouteButtons = () => {
    return (
      <>
        {
          directionsResponse && directionsResponse.routes.map((route, index) => {
            //console.log(route);
            return (
              <Button key={index} colorScheme='red' type='submit' onClick={() => selectRoute(index)}>
                {index + 1}
              </Button>
            )
          }) 
        }
      </>
    )
  }

  function convertToMinutes(durationString) {
    if (!durationString) return 0;
  
    let totalMinutes = 0;
  
    // Split the string into individual parts
    const parts = durationString.split(' ');
    console.log(parts)
    // Iterate over the parts to accumulate total minutes
    for (let i = 0; i < parts.length; i += 2) {
      const value = parseInt(parts[i]);
  
      if (parts[i + 1] === "hour" || parts[i + 1] === "hours") {
        totalMinutes += value * 60;
      } else if (parts[i + 1] === "min" || parts[i + 1] === "mins") {
        totalMinutes += value;
      }
    }
    console.log(totalMinutes);
  
    return totalMinutes;
  }

  function determineRoadType(distance, elevationChange) {
    const thresholdHill = 100; // Adjust based on your scenario
    const thresholdHighwayDistance = 50; // Adjust based on your scenario
    const thresholdHighwayElevation = 50; // Adjust based on your scenario

    if (elevationChange > thresholdHill) {
      return "Hill road";
    } else if (distance > thresholdHighwayDistance && elevationChange < thresholdHighwayElevation) {
      return "Highway";
    } else {
      return "Local road";
    }
  }

  async function calculateRoute(routeType) {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }

    
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const departureTime = new Date();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: routeType,
      provideRouteAlternatives: true,
      drivingOptions: {
        trafficModel: google.maps.TrafficModel.BEST_GUESS, // Specify the traffic model
        departureTime: departureTime
      }
    })
    setCenter({lat: results.routes[0].legs[0].start_location.lat(), lng: results.routes[0].legs[0].start_location.lng()})
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
    setRouteIndex(0);
    const elevator = new google.maps.ElevationService();
    const path = results.routes[0].overview_path;
    elevator.getElevationAlongPath(
      {
        path: path,
        samples: path.length,
      },
      (elevationResults, status) => {
        if (status === 'OK') {
          // Elevation results are in elevationResults[i].elevation
          console.log('Elevation Data:', elevationResults);
          // setElevation(elevationResults);
          let sumOfElevations = 0;
          
          for (let i = 0; i < elevationResults.length-1; i++) {
            const elivationDiff= elevationResults[i+1].elevation-elevationResults[i].elevation;
            if(elivationDiff > 0){
            sumOfElevations += elivationDiff;
            }
          }
          // if(sumOfElevations<0)
          // sumOfElevations=0;
          setElevation(sumOfElevations);
          setRoadType(determineRoadType(distance, elevation));

          //data creating to feed model heavy traffic, modratetraffic, lesstraffic

          if (routeType == "DRIVING") {
            setTraffic(results.routes[0].legs[0].duration_in_traffic.text);
            const durationInMinutes = convertToMinutes(duration);
            const trafficInMinutes = convertToMinutes(traffic);
            setDurationInMins(durationInMinutes);
            setTrafficInMins(trafficInMinutes);

            if (trafficInMinutes > durationInMinutes) {
              setNewTraffic('Heavy traffic');
            } else if (trafficInMinutes > durationInMinutes / 2) {
              setNewTraffic('Moderate traffic');
            } else {
              setNewTraffic('Light traffic');
            }
          }
          else {
            setTraffic("");
            setNewTraffic("");
            setDurationInMins("");
            setTrafficInMins("");
            setRoadType("")
          }
        
        } else {
          console.error('Elevation Service failed:', status);
          // Handle error as needed
        }
      }
    );
    /*
    if (routeType == "car") { 

      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destiantionRef.current.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
      })
      console.log(results);
      setCenter({lat: results.routes[0].legs[0].start_location.lat(), lng: results.routes[0].legs[0].start_location.lng()})
      setDirectionsResponse(results)
      setDistance(results.routes[0].legs[0].distance.text)
      setDuration(results.routes[0].legs[0].duration.text)
      setRouteIndex(0);

    } else if (routeType == "Transit") {

        const results = await directionsService.route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.TRANSIT,
          provideRouteAlternatives: true
        })
        console.log(results);
        setCenter({lat: results.routes[0].legs[0].start_location.lat(), lng: results.routes[0].legs[0].start_location.lng()})
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
        setRouteIndex(0);

    } else if (routeType == "cycle") {

        const results = await directionsService.route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.BICYCLING,
          provideRouteAlternatives: true
        })
        console.log(results);
        setCenter({lat: results.routes[0].legs[0].start_location.lat(), lng: results.routes[0].legs[0].start_location.lng()})
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
        setRouteIndex(0);

    } else if (routeType == "walking") {
        
        const results = await directionsService.route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.WALKING,
          provideRouteAlternatives: true
        })
        console.log(results);
        setCenter({lat: results.routes[0].legs[0].start_location.lat(), lng: results.routes[0].legs[0].start_location.lng()})
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
        setRouteIndex(0);
    }
    */

  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    setDurationInMins(0)
    setTrafficInMins(0)
    setElevation("")
    setNewTraffic("");
    setTraffic("");
    setRoadType("")
    setRouteIndex(0);
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  const selectRoute = (index) => {
    if (!directionsResponse) return ;

    setDistance(directionsResponse.routes[index].legs[0].distance.text);
    setDuration(directionsResponse.routes[index].legs[0].duration.text);
    setTrafficInMins(convertToMinutes(traffic));
    setDurationInMins(convertToMinutes(duration));
    setRouteIndex(index);

    // MACHINE LEARNING REQUEST

    let updatedDistance = distance.replace(' km', ''); 
    const featuresObj = {
      a: updatedDistance ? parseFloat(updatedDistance) : 38,
      b: durationInMins ? parseFloat(durationInMins) : 57,
      c: selectedType ? selectedType : "Car",
      d: selectedBrand ? selectedBrand : "Maruti Suzuki",
      e: selectedModel ? selectedModel : "Vitara Brezza",
      f: selectedFuelType ? selectedFuelType : "Petrol",
      g: modelData[selectedModel][selectedFuelType].engineSpecs ? modelData[selectedModel][selectedFuelType].engineSpecs : 1.5,
      h: modelData[selectedModel][selectedFuelType].engineSpecs ? modelData[selectedModel][selectedFuelType].fuelEfficiency : 16.8,
      i: modelData[selectedModel][selectedFuelType].engineSpecs ? modelData[selectedModel][selectedFuelType].co2Emissions : 136,
      j: newTraffic ? newTraffic :"Heavy traffic",
      k: elevation ? parseFloat(elevation) : 110,
      l: roadType ? roadType : "Hill road"
    }

    // const featuresObj = {
    //   a: 38,
    //   b: 57,
    //   c: "Car",
    //   d: "Maruti Suzuki",
    //   e: "Vitara Brezza",
    //   f: "Petrol",
    //   g: 1.5,
    //   h: 16.8,
    //   i: 136,
    //   j: "Heavy traffic",
    //   k: 110,
    //   l: "Hill road"
    // }

    axios.post(process.env.REACT_APP_FLASK_SERVER_DOMAIN + "/predict", featuresObj )
    .then(response => {
      console.log("Predictions:", parseFloat(response.data));
      setPredictedEmissions(parseFloat(response.data));
    })
    .catch(error => {
      console.error("Error:", error);
    });

  }

 
  return (<>
<div style={{display:'flex'}}>
    
    <Flex
    
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} routeIndex={routeIndex} />
          )}
        </GoogleMap>
      </Box>
     
      <Box
p={4}
      borderRadius='lg'
      m={4}

      shadow='base'
      minW='container.md'
      zIndex='1'
      ml={4}
      position='absolute'
      top='0'
      left='0'

      >
        <div style={{position:'absolute', left:'0', background:'white', padding:'7px 7px'}}>
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input 
                type='text'
                placeholder='Destination'
                ref={destiantionRef}
              />
            </Autocomplete>
          </Box>
        </HStack>


        <div style={{ fontSize: '12px', margin: '0px', padding: '0px' }}>
      <label>Select Vehicle Type:</label>
      <select
        value={selectedType}
        onChange={(e) => {
          setSelectedType(e.target.value);
          setSelectedBrand('');
          setSelectedModel('');
          setSearchText('');
          setFuelTypes([]); // Reset fuel types when type changes
        }}
      >
        <option value="">Select Type</option>
        {vehicleTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {selectedType && (
        <div>
          <label>Select {selectedType === 'Car' ? 'Car' : 'Bike'} Brand:</label>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel('');
              setSearchText('');
              setFuelTypes([]); // Reset fuel types when brand changes
            }}
          >
            <option value="">Select Brand</option>
            {selectedType === 'Car'
              ? carBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))
              : bikeBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
          </select>

          {selectedBrand && (
            <div>
              <label>Search Model:</label>
              {/* <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type to search..."
              /> */}
              <select
                value={selectedModel}
                onChange={(e) => handleModelSelect(e.target.value)}
              >
                <option value="">Select Model</option>
                {filteredModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedModel && (
            <div>
              <label>Select Fuel Type:</label>
              <select
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
              >
                <option value="">Select Fuel Type</option>
                {fuelTypes.map((fuelType) => (
                  <option key={fuelType} value={fuelType}>
                    {fuelType}
                  </option>
                ))}
              </select>

              {selectedFuelType && (
                <div>
                  <h3>Fuel Specifications</h3>
                  <p>Engine Specs: {modelData[selectedModel][selectedFuelType].engineSpecs}</p>
                  <p>Fuel Efficiency (km/L): {modelData[selectedModel][selectedFuelType].fuelEfficiency}</p>
                  <p>CO2 Emissions (g/km): {modelData[selectedModel][selectedFuelType].co2Emissions}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
        <HStack spacing={2} mt={4} justifyContent='space-between'>
          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={() => calculateRoute("DRIVING")}>
              Car
            </Button>
            <Button colorScheme='pink' type='submit' onClick={() =>{ calculateRoute("DRIVING")}}>
              Bike
            </Button>
            <Button colorScheme='pink' type='submit' onClick={() => calculateRoute("TRANSIT")}>
              Bus
            </Button>
            <Button colorScheme='pink' type='submit' onClick={() => calculateRoute("WALKING")}>
              Walking 
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
            {/* <Button onClick={fetchElevationData}>Fetch Elevation Data</Button> */}
          </ButtonGroup>
        </HStack>
        {directionsResponse && <Text mt={4}>Available Routes: </Text>}
        <HStack spacing={2} mt={2} justifyContent='space-between'>
          <ButtonGroup>
            <RouteButtons />
            {
              predictedEmissions ?
             <Text>Estimated CO2 Emissions: {predictedEmissions} </Text>
             : ""
            }
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
        <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <Text>Elevation: {elevation} </Text>
          <Text>roadType: {roadType} </Text>
          
          {newTraffic && <Text>traffic: {newTraffic} </Text>}
          {
            traffic && 
            <Text>Traffic in mins: {trafficInMins} </Text>
          }
          {
            traffic && 
            <Text>Traffic: {traffic} </Text>
          }
          <IconButton 
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => { 
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>

        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>selectedFuelType: {selectedFuelType} </Text>
          <Text>selectedType: {selectedType} </Text>
          <Text>selectedBrand: {selectedBrand} </Text>
          <Text>selectedModel: {selectedModel} </Text>
          {
            selectedModel && selectedFuelType && 
            <Text>engineSpecs: {modelData[selectedModel][selectedFuelType].engineSpecs} </Text>
          }
          {
            selectedModel && selectedFuelType && 
            <Text>Fuel Efficiency: {modelData[selectedModel][selectedFuelType].fuelEfficiency} </Text>
          }
          {
            selectedModel && selectedFuelType && 
            <Text>Co2 Emissions: {modelData[selectedModel][selectedFuelType].co2Emissions} </Text>
          }

        </HStack>
        </div>
      </Box>
      
    </Flex>
    </div>
    </>
  )
}

export default CustomGoogleMap;