
import { useEffect, useRef, useState } from "react";
import axios from "axios"
// this global google is important to make google global
/* global google */ 

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

// const center = { lat: 48.8584, lng: 2.2945 }



function CustomGoogleMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [center, setCenter] = useState({ lat: 12.8699, lng: 80.2184 });
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [durationInMins, setDurationInMins] = useState(0);
  const [trafficInMins, setTrafficInMins] = useState(0);
  const [traffic, setTraffic] = useState('')
  const [elevation, setElevation] = useState('')
  const [routeIndex, setRouteIndex] = useState(0) // initially select first route
  const [newTraffic, setNewTraffic] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [models, setModels] = useState([]);
  const [searchText, setSearchText] = useState('');

  const [predictedEmissions, setPredictedEmissions] = useState(null);

  const vehicleTypes = ['Car', 'Bike'];

  const carBrands = ['Toyota', 'Honda','Volkswagen','Hyundai','Tata','Mahindra','Maruti Suzuki'];
  const carModels = {
    "Maruti Suzuki": ['Vitara Brezza', 'Ignis', 'Ciaz','Alto','Celerio'],
    "Volkswagen": ['Polo','Vento','Taigun','Beetle','Jetta','Golf','Lavida'],
    "Hyundai": ['Grand i10', 'i20', 'Aura','Verna','Venue','Elantra','Creta','Alcazar','Tucson','Kona Electric'],
    "Tata":['Tigor','Nano','Zest','Sfari','Harrier','Indigo','Indica','Bolt','Vista'],
    "Mahindra":['Thar','XUV300','Bolero','Scorpio'
    ,'Marazzo','KUV100 NXT','XUV500','TUV300','Alturas G4','e20Plus'],
    "Honda": ['Jazz','Amaze','City','WR-V','CR-V','Accord Hybrid'],
    "Toyota":['Camry']
    };

    const bikeBrands = ['Honda', 'Yamaha', 'Suzuki'];
    const bikeModels = {
      Honda: ['CBR500R', 'CBR600RR', 'CBR1000RR'],
      Yamaha: ['YZF-R1', 'MT-07', 'YZF-R6'],
      Suzuki: ['GSX-R750', 'GSX-R1000', 'Hayabusa'],
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
              setTraffic(null);
              setNewTraffic(null);
              setDurationInMins(null);
              setTrafficInMins(null);
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
      e: /*models ? models :*/ "Vitara Brezza",
      f: "Petrol",
      g:1.5,
      h: 16.8,
      i:136,
      j:"Heavy traffic",
      k:110,
      l:"Hill road"
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

  return (
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
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
        ml={4}
      >
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

        <div style={{fontSize:'12px', margin:'0px', padding:'0px'}}>
      <label>Select Vehicle Type:</label>
      <select
        value={selectedType}
        onChange={(e) => {
          setSelectedType(e.target.value);
          setSelectedBrand(''); // Reset selectedBrand when type changes
          setSearchText(''); // Reset search text when type changes
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
              setSearchText(''); // Reset search text when brand changes
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
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type to search..."
              />
              <select>
                {filteredModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Store selectedType, selectedBrand, and models in your application state or perform further actions */}
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
              <Text>Estimated CO2 Emissions: {predictedEmissions} </Text>
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <Text>Elevation: {elevation} </Text>
          
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
      </Box>
    </Flex>
  )
}

export default CustomGoogleMap;