import WeatherWidget from "./components/Weather";
import imgLogo from "../assets/jack-svg.svg";
import { Github } from "./components/Github";
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
