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

function updateRequestHandler() {
  const httpSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.send = function(body) {
    const data = JSON.parse(body);

    /* Appends the domain to the username */
    if (data && data.username) {
      const domainInput = document.getElementById('domain-select');

      if (domainInput && domainInput.value != '') {
        const atIndex = data.username.indexOf('@');
        const usernameEndIndex = atIndex === -1 ? data.username.length : atIndex;

        data.username = data.username.substring(0, usernameEndIndex) + domainInput.value;
      }
    }

    httpSend.apply(this, arguments);
  }
}

/* Calls functions */
appendDomainSelect();
updateRequestHandler();