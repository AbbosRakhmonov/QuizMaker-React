import axios from "axios";

function Api(url, method, data) {
  return axios({
    method: method,
    url: `https://quiz-maker-uz-default-rtdb.firebaseio.com${url}.json`,
    data: data,
  })
    .then((Response) => Response)
    .catch((error) => {
      console.log(error);
    });
}

export default Api;
