import AchexWs from './AchexWs.js';

let username = 'k26';
window.log = console.log.bind(console);
window.get$ = el => el.querySelector.bind(el);
window.get$$ = el => el.querySelectorAll.bind(el);
window.$ = get$(document);
window.$$ = get$$(document);

let achexWs = new AchexWs({
  url: 'ws://achex.ca:4010',
  setID: 'CRNZYCF9WG0VQT69',
  passwd: 'k9Hi3WXPhx61YlMt1doaQZJMBH',
  onPayload,
});

function onPayload(payload) {
  log('onPayload:', payload);

  let node = $('#__template_message_unit').content.cloneNode(true);
  {
    let $ = get$(node);

    let isSelf = payload.username === username;
    if (!isSelf) {
      $('.message_unit').classList.add('message_unit--not_self');
    }
  }
  $('#inbox').appendChild(node);
}

$('#chat_form').addEventListener('submit', event => {
  event.preventDefault();
  let message = $('#chat_input').value;
  achexWs.send({
    to: 'CRNZYCF9WG0VQT69',
    payload: {
      message,
      username,
    },
  });
});
