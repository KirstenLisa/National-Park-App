'use strict';

const apiKey = 'HPB702ZDye9bkrViozZgfxn2lT5Hh0ynrMNchjgu'; 
const baseUrl = 'https://api.nps.gov/api/v1/parks';

// searchURL looks like: https://developer.nps.gov/api/v1/parks?stateCode=CA&stateCode=NY&limit=11&api_key=

//converts input to param=value and connects them with &
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  $('js-error-message').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // full name, description, website url, address
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p>${responseJson.data[i].url}</p>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getParks(searchTerm, maxResults=10) {
  const params = {
    stateCode: searchTerm,
    limit: maxResults,
    key: apiKey
  };
  const queryString = formatQueryParams(params)
  const searchUrl = baseUrl + '?' + queryString;

  console.log(searchUrl);

  fetch(searchUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const stateCode = $('#js-search-term').val().split(",");
    const maxResults = $('#js-max-results').val();
    console.log("Parks: "+stateCode);
    console.log("results to get: "+maxResults);
    getParks(stateCode, maxResults);
  });
}

$(watchForm);