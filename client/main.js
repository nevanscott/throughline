async function getData(url = '') {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

function renderMessage(message) {
  const $messages = document.getElementById('messages');
  let $message = document.createElement('li');
  $message.classList.add('message');
  $message.textContent = message;
  $messages.prepend($message);
}

async function loadMessages() {
  const messages = await getData('/api/messages');
  messages.forEach(message => {
    renderMessage(message);
  });
}

async function postMessage(e) {
  e.preventDefault();
  const $input = document.getElementById('message');
  const input = $input.value;
  const message = await postData('/api/post', input);
  renderMessage(message);
  $input.value = '';
  $input.focus();
}

document.getElementById('post').addEventListener('submit', postMessage);
