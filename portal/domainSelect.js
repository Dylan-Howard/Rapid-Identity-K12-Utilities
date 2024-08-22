/**
 * Domain Select Addition - Adds domain select input to Rapid Identity portal
 * 
 * Updated: 08/22/2024
 * Created: 06/12/2024
 * Author: Dylan Howard
*/

function addAuthButtonHandler() {
  const authnButton = document.getElementById('authn-go-button');

  if (authnButton) {
    authnButton.addEventListener("click", () => appendDomain());
  } else {
    setTimeout(addAuthButtonHandler, 100);
  }
}

function appendDomain() {
  const usernameInput = document.getElementById('identification');
  const domainInput = document.getElementById('domain-select');

  if (usernameInput && domainInput) {
    if (domainInput.value != '') {
      /* Find the end index of the username */
      const atIndex = usernameInput.value.indexOf('@');
      const usernameEndIndex = atIndex === -1 ? usernameInput.value.length : atIndex;
      
      /* Appends the domain to the username */
      usernameInput.value = usernameInput.value.substring(0, usernameEndIndex) + domainInput.value;

      /* Handles textbox update */
      usernameInput.focus();
      usernameInput.blur();
    }
  }
}

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
    /* Guards from repeat domain select insertions */
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
    domainSelect.appendChild(createOption('@warren.kyschools.us', '@warren.kyschools.us', false));
    domainSelect.appendChild(createOption('@stu.warren.kyschools.us', '@stu.warren.kyschools.us', false));

    document.getElementById('authn-username-input')
      .appendChild(domainSelect);

    addAuthButtonHandler();

    setTimeout(appendDomainSelect, 2000);
  } else {
    setTimeout(appendDomainSelect, 100);
  }
}

console.log('On load hook...');

/* Calls functions */
appendDomainSelect();