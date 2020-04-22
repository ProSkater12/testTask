/*Слушатели*/
//Переход на страницу регистрации
$('#newToLastPass').click(() => {
  document.location.href = "createAcc.html";
});

//Кнопка "войти"
$('#logInButton').click(() => {
  //Переменная для того, чтобы понять есть ли смысл отправлять запрос на сервер
  //булевое, переменные для того чтобы все проверить сразу
  let mailStarus;
  let passStarus;

  //верификация логина
  mailStarus = checkLogin();

  //верификация пароля
  passStarus = checkPass();

  //Если все в порядке, то отправляем запрос в фоновый скрипт
  if(mailStarus && passStarus) enterAccout();
});

//Функция для проверки того, что пользователь ввел корректный еmail
//Если email не корректный выводим это. Если email отсутствует, то пишем другое сообщение
function checkLogin(){
  let mail = document.getElementById('mail');
  //Если пользователь не ввел email
  if(!mail.value) {
    writeAlertText("alertMail", "Enter your email.");
    return false;
  }
  //Проверяем структуру email-a
  let pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
  if(pattern.test(mail.value)) return true;
  else{
    writeAlertText("alertMail", "Enter valid email.");
    return false;
  }
}

//Функция для проверки того, что пользователь ввел пароль
//Если пароль отсутствует, то выводим сообщение
function checkPass(){
  let pass = document.getElementById('pass');
  //Если пользователь не ввел email
  if(!pass.value) {
    writeAlertText("alertPass", "Please enter your password.");
    return false;
  }
}

//Функция для отправки запроса в фоновый скрипт. Функция входа
function enterAccout(){
  
}

//Функция для отображения уведомлений. принимает id элемента и текст
function writeAlertText(id, text){
  let elem = document.getElementById(id);
  let head = document.getElementById(id + 'Head');
  head.style.display = "none";
  elem.style.display = "table";
  elem.innerHTML = '<img src="/images/validation_warning_orange.png" /><div class="textBox">' + text + '</div>';
}
