let Fly = require('flyio/dist/npm/wx')
let fly = new Fly()

let getRequestApi = function (url, params) {
  fly.get(url, params)
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })
}

export default {getRequestApi}
