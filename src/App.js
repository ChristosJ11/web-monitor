import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCallback, useEffect, useState } from "react";

const BASEURL = " https://web-bot.christosjoseph111643.workers.dev";
function App() {
  const [traffic, changeTraffic] = useState([{}]);
  const [attack, changeAttack] = useState([{}]);
  const [domains, changeDomains] = useState([{}]);
  let traffic_change_data = [{}];

  useEffect(() => {
    request_traffic();
    request_attack();
    request_domains();
  }, []);
  async function request_attack() {
    axios.get(`${BASEURL}/attack-layer3`).then((response) => {
      let attack_layer_data = [{}]
      for (let i = 0; i < response.data.data.total.timestamps.length; i++) {
        const attack_change_obj = {
          timestamps: response.data.data.total.timestamps[i],
          attack_percent: response.data.data.total.values[i],
        };
       attack_layer_data.push(attack_change_obj);
      
      }
      changeAttack(attack_layer_data);
    });
  }

  async function request_domains() {
    axios.get(`${BASEURL}/popular-domains`).then((response) => {
      // for (let i = 0; i < response.data.data.total.timestamps.length; i++) {
      //   const traffic_change_obj = {
      //     timestamps: response.data.data.total.timestamps[i],
      //     total: response.data.data.total.values[i],
      //     http: response.data.data.http.values[i],
      //   };
      //   traffic_change_data.push(traffic_change_obj);
       
      // }
      console.log(response.data);
      changeDomains(response.data);
    });
  }

  async function request_traffic() {
    axios.get(`${BASEURL}/traffic-change`).then((response) => {
      for (let i = 0; i < response.data.data.total.timestamps.length; i++) {
        const traffic_change_obj = {
          timestamps: response.data.data.total.timestamps[i],
          total: response.data.data.total.values[i],
          http: response.data.data.http.values[i],
        };
        traffic_change_data.push(traffic_change_obj);
       
      }
      changeTraffic(traffic_change_data);
    });
  }
  return (
    <div className="App" style={{height:"100vh"}}>
      <h2>Traffic Change Data</h2>
      {traffic !== [{}] ? (
        <ResponsiveContainer height={"100%"} width={"100%"}>
          <LineChart width={500} height={300} data={traffic}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamps" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="http" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div> </div>
      )}
<h2>Domain Popularity</h2>

{domains!== [{}] ? 

  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Domain</TableCell>
            <TableCell align="right">Rank</TableCell>
            <TableCell align="right">Rank Change&nbsp;(g)</TableCell>
            <TableCell align="right">Category&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {domains.map((row) => (
            <TableRow
              key={row.domain}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.domain}
              </TableCell>
              <TableCell align="right">{row.rank}</TableCell>
              <TableCell align="right">{row.rankChange}</TableCell>
              <TableCell align="right">{row.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

: <div> </div>}

<h2>Attack Layer Data</h2>
{attack !== [{}] ? (
        <ResponsiveContainer height={"100%"} width={"100%"}>
          <LineChart width={500} height={300} data={attack}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamps" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="attack_percent" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div> </div>
      )}
    </div>
  );
}

export default App;
