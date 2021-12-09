// importing and setting up express
const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use(express.json());

// route handlers
app.get('/api', (req, res) => {
  //console.log('in express', res)
  // read data from json file and send back to component
  let rawData = fs.readFileSync('exampleJson.json');
  let data = JSON.parse(rawData);
  console.log('data',data);
  res.json(data);
});

app.post('/csv', (req, res) => {
  //const fs = require('fs');
  // const csv = req.body;
  // console.log('in express: csv', csv);
  // const dataStore = csv;
  // get csv data and write to json file
  console.log('in express: data store', JSON.stringify(req.body));
  
  fs.writeFile('./exampleJson.json', JSON.stringify(req.body), error => {
    if (error) {
      console.log(error);
    } else {
      console.log('write successful');
    }
  })
  res.send('received');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
