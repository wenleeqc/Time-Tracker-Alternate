import { useState, useEffect } from 'react'

import Chart from './Chart.js'

export default function CsvReader() {
  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);

  const processCSV = (str, delim = ',') => {
    const headers = str.slice(0, str.indexOf('\n')).split(delim);
    const rows = str.slice(str.indexOf('\n') + 1).split('\n');

    const newArray = rows.map(row => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {})
      return eachObject;
    })

    console.log('before set csv array', newArray)

    setCsvArray(newArray)

    console.log('after set csv array', csvArray)
  }

  const submit = () => {
    const file = csvFile;
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      console.log(text);
      processCSV(text)
    }

    reader.readAsText(file);
  }

  // new
  // send csv data to express
  // POST request using fetch inside useEffect React hook


  useEffect(() => {
    console.log('in CsvReader: useEffect', csvArray)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(csvArray)
    };
    fetch('http://localhost:8080/csv', requestOptions)
      //.then(res => console.log(res))
      .then(response => console.log('returned message', response));

  // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [csvArray]);

  return (
    <form id='csv-form'>
      <input
        type='file'
        accept='.csv'
        id='csvFile'
        onChange={(e) => {
          setCsvFile(e.target.files[0])
        }}
      >
      </input>
      <br />
      <button
        onClick={(e) => {
          e.preventDefault()
          if (csvFile) submit()
        }}
      >
        Submit
      </button>
      <br />
      <br />
      {csvArray.length > 0 ?
        <>
          <table>
            <thead>
              <th>Website</th>
              <th>Time</th>
              <th><Chart csvData={csvArray}/></th>
            </thead>
            <tbody>
              {
                csvArray.map((item, i) => (
                  <tr key={i}>
                    <td>{item.website}</td>
                    <td>{item.time}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </> : null}
    </form>
  );

}