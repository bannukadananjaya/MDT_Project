import MapLayer from './components/MapLayer'
import { MapProvider } from 'react-map-gl';
import Controls from './components/controls'

function App(){
  return(
    <>
    <MapProvider>
      <Controls/>
      <MapLayer/>
    </MapProvider>
      
    </>
   
  );
 
}

export default App;