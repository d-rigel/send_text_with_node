const inputNumber = document.getElementById("number");
const inputText = document.getElementById("msg");
const button = document.getElementById("button");
const response = document.querySelector(".response");

//Add eventListener
button.addEventListener("click", send, false);
const socket = io();

socket.on("smsStatus", (data) => {
  response.innerHTML = `Message successfully sent to ${data.number}`;
});

function send() {
  const number = inputNumber.value.replace(/\D/g, "");
  const text = inputText.value;
  fetch("/", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ number, text }),
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  inputNumber.value = " ";
  inputText.value = " ";
  inputNumber.focus();
}
