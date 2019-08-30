import axios from 'axios';

export async function getConfig() {
  return await axios.get('http://localhost:8080/config');
}

export async function saveConfig(config) {
  return await axios.post('http://localhost:8080/config', config);
}
