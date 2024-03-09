//import necessary packages
import { useCallback, useEffect, useState } from "react";
import Map, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Source,
  Layer,
} from "react-map-gl";
// import { Icon } from '@iconify/react'
import towericon from '@iconify/icons-mdi'
import Geohash from 'latlon-geohash'

//import functions
import {FindRSRPColor} from '../assets/Color'

//import css files
import "mapbox-gl/dist/mapbox-gl.css";

//import data
import TowerInfo from "./TowerInfo";
import data from "../assets/fullData.json";
import cell_data_rsrp from '../assets/cells_with_geohashes.json'

const initialViewport = {
  latitude: 7.8731,
  longitude: 80.7718,
  zoom: 7,
  pitch: 20,
  bearing: 0,
};

// const towerLayer = {
//   id: "site-icons",
//   type: "circle",
//   layout: {
//     "circle-radius": 5,
//   },
//   paint: {
//     // Styling and interactions for site icons
//     "fill-color": "#000", // Circle color
//     "fill-opacity": 0.8, // Circle opacity
//     "circle-stroke-width": 2, // Optional stroke around the circle
//     "circle-stroke-color": "#fff", // Optional stroke color
//   },
// };
const towerLayer = {
  id: "tower-layer",
  type: "symbol",
  layout:{{
    'icon-image':{towericon}
    }}
  paint: {
    "circle-radius": 10,
    "circle-color": "#107cbf",
  },
  // maxzoom:12,
};

const sectorLayer = {
  id: "sector",
  type: "line",
  paint: {
    "line-color": ["get", "color"],
    "line-opacity": 1,
    "line-width": 2,
  },
  minzoom: 13,
};

const dataLayer = {
  id: "data",
  type: "fill",
  paint: {
    "fill-color": ["get", "color"],
    "fill-opacity": 0.8,
  },
  minzoom: 13,
};



const convertGeoHashToPolygon = (geohash) => {
  const { lon: longitude, lat: latitude } = Geohash.decode(geohash);

  const latDiff = 0.0002; // Latitude difference of 20 meters (adjust as needed)
  const lonDiff = latDiff / Math.cos((latitude * Math.PI) / 180); // Adjust for latitude distortion

  const polygon = [
    [longitude - lonDiff, latitude - latDiff],
    [longitude - lonDiff, latitude + latDiff],
    [longitude + lonDiff, latitude + latDiff],
    [longitude + lonDiff, latitude - latDiff],
    [longitude - lonDiff, latitude - latDiff],
  ];
  return polygon;
};


const MapLayer = () => {
  const [allData, setAllData] = useState(null);
  const [siteData, setSiteData] = useState({});
  const [siteInfo, setSiteInfo] = useState({});
  const [cellInfo, setCellInfo] = useState(null);
  const [hoverLayer, setHoverLayer] = useState(null);
  const [clickedInfo, setClickedInfo] = useState(null);

  const findValueByKey = (key) => {
    if (cell_data_rsrp && !cell_data_rsrp.hasOwnProperty(key)) {
      return;
    }
    return cell_data_rsrp && cell_data_rsrp[key];
  }

  const findColor = (cellId, geohash) => {
    if (geoh && geoh.hasOwnProperty(geohash)) {
      const index = geoh[geohash][0].indexOf(cellId);
      if (index !== -1) {
        // console.log(selection)
      
          const rsrp = geoh[geohash][2][index];
          return FindRSRPColor(rsrp);
        }
      }
    
      if (geoh && geoh.hasOwnProperty(geohash)) {
        const index = geoh[geohash][0].indexOf(cellId);
        if (index !== -1) {
          const  rsrp = geoh[geohash][1][index];
          return FindRSRPColor(rsrp);
        }
      }

    return;
  };

  const getCoordinatesByGlobalCell = useCallback(
    (globalCell) => {
      // Find the feature that matches the global_cell
      const feature =
        allData &&
        allData.features.find(
          (feature) => feature.properties.global_cel === globalCell
        );
      if (feature) {
        const polygonCenter = centroid(feature);
        if (polygonCenter) {
          const [lon, lat] = polygonCenter.geometry.coordinates;
          return { lat, lon };
        }
      }
      return null;
    },
    [allData]
  );


  const onClick = useCallback(
    (event) => {
      const { features, lngLat } = event;
      console.log("hi")
      console.log(features,lngLat)
      const clickedFeature = features && features[0];
      if (!clickedFeature) {
        setClickedInfo(null);
        console.log("nodata")
      }
      //setLineInfo(null);

      if (clickedFeature) {
        const { id: layerID } = clickedFeature.layer;
        console.log(clickedFeature.layer)
        if (layerID === "data") {
          setClickedInfo(null);
          const _geohash = findValueByKey(
            clickedFeature.properties["global_cel"].toString()
          );
          console.log("jo")
          console.log(_geohash)
          setClickedInfo(
            _geohash && {
              type: "FeatureCollection",
              features: _geohash["geohash"].map((hash) => {
                const coordinates = convertGeoHashToPolygon(hash);
                const color = findColor(
                  clickedFeature.properties["global_cel"],
                  hash,
                  selection
                );
                // const interferer = findInterferer(
                //   clickedFeature.properties["global_cel"],
                //   hash
                // );

                return {
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: [coordinates],
                  },
                  properties: {
                    color: color,
                    // interferer: selection === "overlapping" ? interferer : null,
                  },
                };
              }),
            }
          );

        } 
      }
      console.log(clickedInfo)
    },
    []
  );
 
  const handleClick = (event) => {
    setSiteInfo(null);
    const { features } = event;
    console.log(features);
    const clickedFeature = features && features[0];
    if (clickedFeature) {
      const { station, vendor } = clickedFeature.properties;
      setSiteInfo({ station, vendor });
      console.log("Clicked");
      console.log("siteInfo:", { station, vendor }); // Logging the updated siteInfo object
    }
  };

  const handleHover = useCallback((event) => {
    setCellInfo(null);
    const {
      features,
      point: { x, y },
    } = event;

    const hoveredFeature = features && features[0];
    if (hoveredFeature) {
      const { id: layerID } = hoveredFeature.layer;
      setCellInfo(hoveredFeature && { feature: hoveredFeature, x, y });
      // if (layerID === "data") {
      //   setHoverLayer("data");
      // } else if (layerID === "geoh-data") {
      //   setHoverLayer("geo-data");
      // }
    }
    // console.log(features)
    // console.log(hoveredFeature)
  }, []);

  //const towerData = useCallback(() => {

  //  }, [allData]);

  useEffect(() => {
    setAllData(data);

    sectorLayer.paint = {
      "line-color": "#3abeff",
      "line-opacity": 1,
      "line-width": 5,
    };

    dataLayer.paint = {
      "fill-color": ["get", "color"],
      "fill-opacity": 0,
    };

    // towerLayer.paint={
    //   "fill-color":"#107cbf"
    // }
  }, []);

  // const towerData = useCallback(() => {
  //   const processedSiteData = {};
  //   if (allData) {
  //     allData.features.forEach((feature) => {
  //       const siteId = feature.properties["Site ID"];
  //       if (!processedSiteData[siteId]) {
  //         processedSiteData[siteId] = {
  //           latitude: feature.properties.latitude, // Access latitude from geometry
  //           longitude: feature.properties.longitude, // Access longitude from geometry
  //         };
  //       }
  //     });
  //   }
  //   console.log(processedSiteData);
  //   return processedSiteData;

  // }, [allData]);

  //get Site Datainto statevariable siteData
  useEffect(() => {
    if (allData) {
      const processedSiteData = {};
      allData.features.forEach((feature) => {
        const siteId = feature.properties["Site ID"];
        if (!processedSiteData[siteId]) {
          processedSiteData[siteId] = {
            station: feature.properties.BaseStatio,
            vendor: feature.properties.vendor,
            latitude: feature.properties.latitude,
            longitude: feature.properties.longitude,
          };
        }
      });
      setSiteData(processedSiteData);
      console.log("hi");
      console.log(siteData);
    }
  }, [allData]);

  //make geoJson for show tower data
  const geojsonSiteData = {
    type: "FeatureCollection",
    features: Object.values(siteData).map((site) => ({
      type: "Feature",
      properties: {
        siteId: site.siteId,
        ...site,
      },
      geometry: {
        type: "Point",
        coordinates: [site.longitude, site.latitude],
      },
    })),
  };

  // console.log("All Data");
  // console.log(allData);
  // console.log("site Data");
  // console.log(siteData);

  return (
    // <div>Map</div>
    <Map
      id="mymap"
      initialViewState={{ ...initialViewport }}
      style={{ height: "100vh" }}
      projection="globe"
      mapStyle={"mapbox://styles/mapbox/satellite-streets-v12"}
      mapboxAccessToken={
        "pk.eyJ1IjoiYmFudWthZHMiLCJhIjoiY2xzMW53cDhjMDl1ejJpbWVmNnhjYTVuZCJ9.2XSVx6ji6RNaeiVCtxQPJA"
      }
      terrain={{ source: "mapbox-dem", exaggeration: 1 }}
      //onClick={handleClick}
      onClick={onClick}
      onMouseMove={handleHover}
      interactiveLayerIds={["tower", "sector", "geoh-data"]}
    >
      <Source type="geojson" data={allData}>
        <Layer {...sectorLayer} />
        <Layer {...dataLayer} />

        {/* {Object.keys(siteData).map((siteId) => (
          <Layer
            key={siteId}
            id={`site-${siteId}-circle`}
            type="circle"
            paint={{
              "circle-radius": 5,
              "circle-color": "#000", // Circle color
              "circle-opacity": 0.8, // Circle opacity
              "circle-stroke-width": 2, // Optional stroke around the circle
              "circle-stroke-color": "#fff", // Optional stroke color
            }}
          />
        ))} */}
      </Source>
      <Source id="my-data" type="geojson" data={geojsonSiteData}>
        <Layer {...towerLayer} />
      </Source>
      <div>
        {/* Render the TowerInfo component and pass siteInfo as props */}
        {siteInfo && <TowerInfo siteInfo={siteInfo} />}
        {/* Other JSX elements */}
      </div>
      {cellInfo && (
        <div
          className="cell-tooltip"
          style={{ left: cellInfo.x, top: cellInfo.y }}
        >
          {
            <>
              <div>Cell Name: {cellInfo.feature.properties["Cell Name"]}</div>
              <div>Cell Label: {cellInfo.feature.properties["Cell Lable"]}</div>
              <div>vendor: {cellInfo.feature.properties.vendor}</div>
              <div>Band: {cellInfo.feature.properties.Band}</div>
            </>
          }
        </div>
      )}

      {/* {clickedInfo && (
        <TowerPopup
          feature={clickedInfo.feature}
          x={clickedInfo.x}
          y={clickedInfo.y}
        />
      )} */}
      <Source
        id="mapbox-dem"
        type="raster-dem"
        url="mapbox://mapbox.mapbox-terrain-dem-v1"
        tileSize={512}
        // maxzoom={14}
      />

      <GeolocateControl position="top-left" />
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
      <ScaleControl />
    </Map>
  );
};

export default MapLayer;
