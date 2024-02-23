
import { useRef, useState } from "react";
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
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [center, setCenter] = useState({ lat: 12.8699, lng: 80.2184 });
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [traffic, setTraffic] = useState('')
  const [elevation, setElevation] = useState('')
  const [routeIndex, setRouteIndex] = useState(0) // initially select first route
const [nnew , setNnew]= useState(0)
  const [newTraffic, setNewTraffic] = useState('');

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
              
              function convertToMinutes(durationString) {
                if (!durationString) return 0;
              
                let totalMinutes = 0;
              
                // Split the string into individual parts
                const parts = durationString.split(' ');
              
                // Iterate over the parts to accumulate total minutes
                for (let i = 0; i < parts.length; i += 2) {
                  const value = parseInt(parts[i]);
              
                  if (parts[i + 1] === "hour" || parts[i + 1] === "hours") {
                    totalMinutes += value * 60;
                  } else if (parts[i + 1] === "min" || parts[i + 1] === "mins") {
                    totalMinutes += value;
                  }
                }
              
                return totalMinutes;
              }
    
              setNnew(trafficInMinutes);
              if (trafficInMinutes > durationInMinutes) {
                setNewTraffic('Heavy traffic');
              } else if (trafficInMinutes > durationInMinutes / 2) {
                setNewTraffic('Moderate traffic');
              } else {
                setNewTraffic('Light traffic');
              }
            }
            else setTraffic(null);
        
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
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  const selectRoute = (index) => {
    if (!directionsResponse) return ;

    setDistance(directionsResponse.routes[index].legs[0].distance.text);
    setDuration(directionsResponse.routes[index].legs[0].duration.text);
    setRouteIndex(index);
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
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <Text>Elevation: {elevation} </Text>
          <Text>traffic: {newTraffic} </Text>
          <Text>traffic: {nnew} </Text>
          
          {/* <Text>
        Elevation: {elevation.map((elevationVal, index) => (
          <span key={index}>{elevationVal.elevation} </span>
        ))}
      </Text> */}
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