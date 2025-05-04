import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
  MapContainerProps,
  TileLayerProps,
} from "react-leaflet";
import { LatLngExpression, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Coords {
  lat: number;
  lng: number;
}

interface CurrentWeather {
  temperature: number | null;
  windSpeed: number | null;
}

interface HourlyPoint {
  time: string;
  temperature: number;
  humidity: number;
  wind: number;
}

interface LocationSelectorProps {
  onSelect: (coords: Coords) => void;
}

// Componente para seleccionar coordenadas en el mapa
const LocationSelector: React.FC<LocationSelectorProps> = ({ onSelect }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const WeatherWidget: React.FC = () => {
  const [coords, setCoords] = useState<Coords>({ lat: 52.52, lng: 13.41 });
  const [current, setCurrent] = useState<CurrentWeather>({
    temperature: null,
    windSpeed: null,
  });
  const [hourlyData, setHourlyData] = useState<HourlyPoint[]>([]);

  const fetchWeather = useCallback(async ({ lat, lng }: Coords) => {
    try {
      const { data } = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude: lat,
            longitude: lng,
            current_weather: true,
            hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m",
          },
        }
      );

      const { current_weather, hourly } = data;
      setCurrent({
        temperature: current_weather.temperature,
        windSpeed: current_weather.windspeed,
      });

      const formatted: HourlyPoint[] = hourly.time.map(
        (t: string, i: number) => ({
          time: t.split("T")[1].slice(0, 5),
          temperature: hourly.temperature_2m[i],
          humidity: hourly.relative_humidity_2m[i],
          wind: hourly.wind_speed_10m[i],
        })
      );
      setHourlyData(formatted);
    } catch (error) {
      console.error("Weather API error:", error);
    }
  }, []);

  useEffect(() => {
    fetchWeather(coords);
  }, [coords, fetchWeather]);

  const handleSelect = (newCoords: Coords) => {
    setCoords({
      lat: parseFloat(newCoords.lat.toFixed(4)),
      lng: parseFloat(newCoords.lng.toFixed(4)),
    });
  };

  // Convierte coords a LatLngExpression para tipado correcto
  const centerPosition: LatLngExpression = [coords.lat, coords.lng];

  return (
    <div className=" m-auto md:w-[80%] flex flex-col lg:flex-row items-center justify-start  p-4">
      <div className="w-full max-w-lg mb-4 rounded-2xl overflow-hidden shadow-lg">
        <MapContainer
          {...({
            center: centerPosition,
            zoom: 6,
            style: { height: "300px" },
          } as MapContainerProps)}
        >
          <TileLayer
            {...({
              attribution: "&copy; OpenStreetMap contributors",
              url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            } as TileLayerProps)}
          />
          <LocationSelector onSelect={handleSelect} />
          <Marker position={centerPosition}>
            <Popup>
              <span>
                Lat: {coords.lat}, Lng: {coords.lng}
              </span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="w-full max-w-md mx-auto p-6 bg-gray-900 rounded-2xl shadow-lg text-white font-sans">
        <h2 className="text-2xl mb-4 font-semibold tracking-widest uppercase text-cyan-400">
          Clima en ({coords.lat}, {coords.lng})
        </h2>
        <div className="flex justify-around mb-6">
          <div className="text-center">
            <p className="text-sm uppercase text-gray-400">Temperatura</p>
            <p className="text-3xl font-bold">
              {current.temperature ?? "--"}°C
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm uppercase text-gray-400">Viento</p>
            <p className="text-3xl font-bold">
              {current.windSpeed ?? "--"} km/h
            </p>
          </div>
        </div>
        <h3 className="text-xl mb-2 font-medium tracking-wide text-cyan-300">
          Pronóstico Horario
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={hourlyData.slice(0, 24)}>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#888" }} />
            <YAxis tick={{ fontSize: 10, fill: "#888" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ color: "#9ca3af" }} />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#facc15"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="wind"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherWidget;
