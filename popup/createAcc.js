/*Слушатели*/
//Открыть "I prefer not to receive promotional emails."
$('#chooseOtherwise').click(() => {
  document.getElementById('PremissionContainer').style.display = "block";
});

//Кнопка создания аккаунта с текущим email
$('#okButton').click(() => {
  let mail = document.getElementById('createAccountEmail');
  //Проверяем структуру email
  let pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
  //Отправляем запрос в фоновый скрипт, чтобы узнать есть ли такой email в БД
  //true - такого email в БД нет
  if(pattern.test(mail.value)){
      chrome.extension.sendMessage({
        mes: "checkMail",
        mail: mail
      }, function(backMessage) {
        if(backMessage){
          //если email не существует, отправляем написанный email в фоновый скрипт и сохраняем
          //Дальше переходим на страницу добавления пароля
        }
        else{
          //Если такой email существует, выводим предупреждение
          writeAlert('Email address already in use', '<a class="pull-right recovery-link" href="https://lastpass.com/forgot.php" target="_blank">Recovery Help</a>');
        }
      });
  }
  else{
    //Если почта не соответствует шаблону, выводим предупреждение
    writeAlert('Use a real email address');
  }
});

//Переход на страницу входа
$('#sign_in').click(() => {
  document.location.href = "extensionLogin.html";
});

/*Функции*/

//Функция для вывода предупреждения о некорректном email над формой
function writeAlert(text, href){

}
