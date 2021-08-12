import axios from "axios";

function Api(url, method, data) {
  return axios({
    method: method,
    url: `http://localhost:3001${url}`,
    data: data,
  })
    .then((Response) => Response)
    .catch((error) => {
      console.log(error);
    });
}

export default Api;
