/*Уникальный индекс вошедшего пользователя*/
let active_user;
console.log(localStorage.getItem('enter'));

//if(document.getElementById('playlists')) init_second_page();
if(localStorage.getItem('enter')){
  if(document.getElementById('playlists')) init_second_page();
  else document.location.href = "second_page.html";
}
else{
  chrome.browserAction.setIcon({path: {
    "19": "/images/br-icon19.png",
    "38": "/images/br-icon38.png"
    }
  });
}

//Функция для 2 страницы. Создает таблицу плейлистов
function init_second_page(){
  chrome.extension.sendMessage("setUser", function(backMessage){
  	active_user = backMessage;
    console.log(active_user);
    //Изменяем иконку расширения
    chrome.browserAction.setIcon({path: {
      "19": "/images/br-icon19_2.png",
      "38": "/images/br-icon38_2.png"
      }
    });
    //Создаем таблицу
    createTable(0);
    //создаем пагинацию
    createPagination();
  });
}

/*
 *Происходит при нажатии на заголовок. Ищется информация об используемом
 *браузере, и потом открываем окно с магазином расширений для браузера
 *пользователя
 */
$( "#head-text" ).click(() => {
  //Создаем объект 'user', который будет содержать информацию Detect.js
  //Вызываем detect.parse() с navigator.userAgent в качестве аргумента
/*  var user = detect.parse(navigator.userAgent);

  console.log(user.browser.family);
  switch(user.browser.family) {
    case "Chrome":
      window.open('https://chrome.google.com/webstore/category/extensions?hl=ru');
      break;
    case "Firefox":
      window.open('https://addons.mozilla.org/ru/firefox/');
      break;
  }*/

  //Имитация
  window.open();
});

//Имитации входа
$('#tutorial').click(() => { window.open(); });
$('#facebook_enter').click(() => { window.open(); });
$('#google_enter').click(() => { window.open(); });

//Кнопка добавить плейлист
$('#add_playlist').click(() => { addInput(); });

//Выйти из аккаунта
$('#logout').click(() => {
  localStorage.removeItem('enter');
  document.location.href = "popup.html";
});

/*Функция для перехода на другую страницу.
 * Активируется при нажатии кнопки sign in*/
$( "#sign-in").click(() => {
  /*Получаем данные из формы*/
  let login = document.getElementById('login').value;
  let pass = document.getElementById('pass').value;

  /*Проверяем есть ли пользователь с такими данными*/
  /*for(let i = 0; i < users.length; i++){
    alert('Есть пользователи');
    //Если логин не совпадает, то идем дальше
    if(users[i][mail] != login){
      alert(users[i][mail]);
    }
    else{
      //Если логин совпадает, то смотрим хеши паролей.
      //Если и хеши совпадают, то выполяем вход
      if(MD5(pass) == MD5(users[i][password])){
        active_user = i;
        document.location.href = "second_page.html";
        return false;
      }
      else{
        alert('Такой пользователь существует, но пароль неверный');
      }
    }
  }*/
  //Если пользователь так и не был найден, создаем новый аккаунт для него
  //переходим на другую страницу
  document.location.href = "second_page.html";
  localStorage.setItem('enter', true);
  return false;
});

/*Создание списка плейлистов*/
function createTable(page){
  let playlists_table = document.getElementById('playlist_ol');
  //for(let i = 0; i < active_user.playlists.length; i++){
  for(let i = page * 10; i < (page + 1) * 10; i++){
    //Создаем плейлисты в html
    if(active_user.playlists[i]) playlists_table.innerHTML += '<li><div class="table_cell" id="edit_input_base_' + i + '"><a id="playlist_num_' + i + '">'  + active_user.playlists[i].name + '</a><img src="/images/open_playlist.png" class="open_playlist_img" id="open_btn_' + i + '"></div><div class="table_cell" id="edit_base_' + i + '"></div> </li>';
  }
  //Вешаем слушатели на них
  for(let i = 0; i < active_user.playlists.length; i++){
    $('#playlist_num_' + i).click(() => {
      //editPlaylist('playlist_num_' + i);
      editPlaylist(i);
    });
    $('#open_btn_' + i).click(() => {
      var newWin = window.open(active_user.playlists[i].name, "width=200,height=200");
      newWin.document.write(active_user.playlists[i].name + ':' + '<hr>');
      for(let j = 0; j < active_user.playlists[i].objects.length; j++){
        newWin.document.write(active_user.playlists[i].objects[j] + '<hr>');
      }
    });
  }

    /**/
}

//Создание пагинации
function createPagination(){
  let pagination = document.getElementById('pagination');
  for(let i = 0; i < active_user.playlists.length / 10; i++){
    pagination.innerHTML += '<div id="pag_' + i + '" class="pagi-link">' + (i+1) + '</div>';
  }
  for(let i = 0; i < active_user.playlists.length / 10; i++){
    $('#pag_' + i).click(() => {
      removeTable();
      createTable(i);
      let el = document.getElementById('pag_' + i);
      el.style += 'active';
    });
  }
}

//Очищает счисок плейлистов
function removeTable(){
  let el = document.getElementById('playlist_ol');
  el.innerHTML = '';
}

/*Функция создания окна input-a*/
function addInput(){
  let input_base = document.getElementById('input_base');
  if(!input_base.innerHTML) input_base.innerHTML += '<input type="text" id="adding_playlist" value="Playlist ' + (active_user.playlists.length + 1) + '"> <button id="adding_playlist_btn">Create</button>';
  //Добавим слушатель на кнопку создания плейлиста
  /*Нажатие на кпопку создания плейлиста*/
  $('#adding_playlist_btn').click(() => {
    addPlaylist();
    removeInput();
  });
}

/*Функция для добавления плейлиста в список*/
function addPlaylist(){
  let playlists = document.getElementById('playlist_ol');
  let name = document.getElementById('adding_playlist');
  if(active_user.playlists.length >= 100) {
    alert("Вы не можете создать больше 100 плейлистов");
    return false;
  }
  if(!name.value) {
    alert('Введите имя плейлиста');
  }
  else{
    //active_user.playlists[active_user.playlists.length] = new playlist(name.value);
    chrome.extension.sendMessage({mes: "addPlaylist", name: name.value}, function(backMessage){
      active_user = backMessage;
      console.log(active_user);
    });

    playlists.innerHTML += '<li><div class="table_cell" id="edit_input_base_' + (active_user.playlists.length - 1) + '"><a id="playlist_num_' + (active_user.playlists.length - 1) + '">' + name.value + '</a><img src="/images/open_playlist.png" class="open_playlist_img" id="open_btn_' + (active_user.playlists.length - 1) + '"></div><div class="table_cell" id="edit_base_' + (active_user.playlists.length - 1) + '"></div></li>';
    for(let i = 0; i < active_user.playlists.length; i++){
      $('#playlist_num_' + i).click(() => {
        //editPlaylist('playlist_num_' + i);
        editPlaylist(i);
      });
      $('#open_btn_' + i).click(() => {
        var newWin = window.open(active_user.playlists[i].name, "width=200,height=200");
        for(let j = 0; j < active_user.playlists[i].objects.length; j++){
          newWin.document.write(active_user.playlists[i].objects[j] + '<hr>');
        }
      });
    }
  }
}

/*Функция, которая убирает окно ввода в списке плейлистов*/
function removeInput(){
  let input_base = document.getElementById('input_base');
  input_base.innerHTML = '';
}

/*Функция для изменения имени плейлиста*/
function editPlaylist(id) {
  let edit_base = document.getElementById("edit_base_" + id);
  if(!edit_base.innerHTML) {
    edit_base.innerHTML += '<button id="edit_playlist_' + id + '" class="edit_btn">Edit</button>';
    $("#edit_playlist_" + id).click(() => {
      addEditInput(id);
    });
  }
  else{ edit_base.innerHTML = ''; }

}

/*функция для добавления окна ввода при изменении названия плейлиста*/
function addEditInput(id) {
  let li_el = document.getElementById('edit_input_base_' + id);
  let li_el_value = li_el.innerText;
  document.getElementById("edit_base_" + id).innerHTML = '';
  li_el.innerHTML = '<input type="text" id="input_playlist_' + id + '" value="' + li_el_value + '"> <button id="confirm_edit_' + id + '">Corfirm</button><button id="cancel_edit_' + id + '">Cancel</button>';
  $('#cancel_edit_' + id).click(() => {
    li_el.innerHTML =  '<a id="playlist_num_' + id + '">' + li_el_value + '</a><img src="/images/open_playlist.png" class="open_playlist_img" id="open_btn_' + id + '">';
    for(let i = 0; i < active_user.playlists.length; i++){
      $('#playlist_num_' + i).click(() => {
        //editPlaylist('playlist_num_' + i);
        editPlaylist(i);
      });
    }
  });
  $('#confirm_edit_' + id).click(() => {
    let new_name = document.getElementById('input_playlist_' + id).value;
    li_el.innerHTML =  '<a id="playlist_num_' + id + '">' + new_name + '</a><img src="/images/open_playlist.png" class="open_playlist_img" id="open_btn_' + id + '">';
    for(let i = 0; i < active_user.playlists.length; i++){
      $('#playlist_num_' + i).click(() => {
        //editPlaylist('playlist_num_' + i);
        editPlaylist(i);
      });
    }
    active_user.playlists[id].name = new_name;
    console.log(active_user);
  });
}
