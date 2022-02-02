module.exports = ({ messages }) => `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Throughline</title>
    <link rel="stylesheet" href="main.css">
  </head>
  <body>
    <form id="post" action="/" method="post" autocomplete="off">
      <label for="message">Message</label>
      <input type="text" id="message" name="message" value="" autofocus>
      <button type="submit">Send</button>
    </form>
    <ul id="messages" class="messages">
      ${
        messages.map(message =>
          `<li class="message">${message}</li>`
        ).join("\n      ")
      }
    </ul>
  </body>
</html>`;
