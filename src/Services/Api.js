import axios from "axios";

async function Api(url, method, data) {
  return await axios({
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
