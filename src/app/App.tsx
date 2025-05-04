import WeatherWidget from "./components/Weather";
import imgLogo from "../assets/jack-svg.svg";
import { Github } from "./components/Github";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Solución limpia y segura sin usar `any`
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const App = () => {
  return (
    <div className="w-full h-screen bg-gray-800">
      <div className="lg:w-[80%] flex items-center justify-between h-[10rem] m-auto">
        <img className="w-[9rem]" src={imgLogo} alt="" />
        <Github />
      </div>
      <div className="flex justify-center">
        <h2
          className="text-4xl font-black bg-clip-text bg-gradient-to-r 
        from-cyan-400 to-indigo-500 text-transparent"
        >
          APP - CLIMA
        </h2>
      </div>
      <div className="">
        <WeatherWidget />
      </div>
    </div>
  );
};

export default App;
