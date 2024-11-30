import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/data");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Sensor Data</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Pressure (hPa)</th>
            <th>Altitude (m)</th>
            <th>Accel X</th>
            <th>Accel Y</th>
            <th>Accel Z</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
              <td>{item.pressure}</td>
              <td>{item.altitude}</td>
              <td>{item.acceleration_x}</td>
              <td>{item.acceleration_y}</td>
              <td>{item.acceleration_z}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
