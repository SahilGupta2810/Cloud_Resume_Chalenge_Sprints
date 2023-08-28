/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

fetch('https://gu37v84h1l.execute-api.ap-south-1.amazonaws.com/dev/visitor')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      return response.json();
    }
  })
  .then(data => {
    //Here you can access the single digit data that was returned from the API
    let container = document.getElementById("data");
    data = data.Item.CounterValue
    container.innerHTML = data;
  })
  .catch(error => console.log(error))

