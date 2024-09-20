/**
 * Domain Select Addition - Adds domain select input to Rapid Identity portal
 * 
 * Updated: 08/22/2024
 * Created: 06/12/2024
 * Author: Dylan Howard
*/

/* Edit these for your environment */
const selectOptions = [
  '@warren.kyschools.us',
  '@stu.warren.kyschools.us',
];

/* Functions -- Edit with care */
function createOption(option, value, selected) {

  /* Creates option element */
  const optionElement = document.createElement('option');
  optionElement.value = value;
  optionElement.disabled = value === '';
  optionElement.selected = selected;

  /* Sets option element text */
  const label = document.createTextNode(option);
  optionElement.appendChild(label);

  return optionElement;
}

function appendDomainSelect() {
  const usernameInput = document.getElementById('authn-username-input');

  if (usernameInput) {
    const domainInput = document.getElementById('domain-select');
    if (domainInput) {
      console.log('Domain already inserted...');
      setTimeout(appendDomainSelect, 2000);
      return;
    }

    /* Creates domain select element */
    const domainSelect = document.createElement('select');
    domainSelect.id = 'domain-select';
    domainSelect.classList.add('cs-login-select');

    domainSelect.appendChild(createOption('Please select', '', true));
    for (let i = 0; i < selectOptions.length; i += 1) {
      domainSelect.appendChild(createOption(selectOptions[i], selectOptions[i], false));
    }

    document.getElementById('authn-username-input')
      .appendChild(domainSelect);

    setTimeout(appendDomainSelect, 2000);
  } else {
    setTimeout(appendDomainSelect, 100);
  }
}
appendDomainSelect();

/* Updates http send request */
function handleAuthError() {
  /* Hides loading screen */
  const loadingContainer = document.getElementById('loader-cntr');
  loadingContainer.classList.add('hide');

  /* Adds error message */
  const authContainer = document.getElementById('authn-username-wrapper');
  const errorContainer = document.createElement('p');
  errorContainer.classList.add('error-message');
  errorContainer.setAttribute('role', 'alert');

  const errorText = document.createElement('span');
  errorText.classList.add('cs-error');
  errorText.textContent = 'Username is invalid'

  errorContainer.appendChild(errorText);
  authContainer.appendChild(errorContainer);
}

let selectedDomain = '';

const httpSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = async function(body) {
  const data = JSON.parse(body);

  if (data && data.username) {
    /* Appends selected domain */
    const domainInput = document.getElementById('domain-select');

    selectedDomain = domainInput ? domainInput.value : '';

    if (selectedDomain !== '') {
      /* Find the end index of the username */
      const atIndex = data.username.indexOf('@');
      const usernameEndIndex = atIndex === -1 ? data.username.length : atIndex;

      console.log(atIndex);
      console.log(usernameEndIndex);

      /* Appends the domain to the username */
      data.username = data.username.substring(0, usernameEndIndex) + selectedDomain;
      body = JSON.stringify(data);
    }

    /* Check for username existance */
    try {
      const existsResponse = await fetch('https://warren.us003-rapididentity.com/api/rest/restpoints/PortalFunctions/exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: data.username }),
      });

      if (!existsResponse.ok) {
        throw new Error(`Response status: ${existsResponse.status}`);
      }

      const { error, exists } = await existsResponse.json();

      if (error) {
        // throw new Error('Error checking username.');
        console.error('Error checking username. Allowing passthrough.');
      }

      if (!exists) {
        throw new Error('Authentication Error: Username is inavlid. No password will be accepted.');
      }
      
    } catch (error) {
      console.error(error.message);
      this.abort();
      handleAuthError();
      
      return;
    }
  }

  httpSend.apply(this, arguments);
}
