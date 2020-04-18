/*Уникальный индекс вошедшего пользователя*/
let active_user;
let page_num = 0;
console.log(localStorage.getItem('enter'));

//if(document.getElementById('playlists')) init_second_page();
if (localStorage.getItem('enter')) {
  if (document.getElementById('playlists')) init_second_page();
  else document.location.href = "second_page.html";
} else {
  chrome.browserAction.setIcon({
    path: {
      "19": "/images/br-icon19.png",
      "38": "/images/br-icon38.png"
    }
  });
}

//Функция для 2 страницы. Создает таблицу плейлистов
function init_second_page() {
  chrome.extension.sendMessage("setUser", function(backMessage) {
    active_user = backMessage;
    console.log(active_user);
    //Изменяем иконку расширения
    chrome.browserAction.setIcon({
      path: {
        "19": "/images/br-icon19_2.png",
        "38": "/images/br-icon38_2.png"
      }
    });
    //Создаем таблицу
    createTable(0);
  });
}

/*
 *Происходит при нажатии на заголовок. Ищется информация об используемом
 *браузере, и потом открываем окно с магазином расширений для браузера
 *пользователя
 */
$("#head-text").click(() => {
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
$('#tutorial').click(() => {
  window.open();
});
$('#facebook_enter').click(() => {
  window.open();
});
$('#google_enter').click(() => {
  window.open();
});
$('#sign-up').click(() => {
  window.open();
});
$('#registration').click(() => {
  window.open();
});
$('#forgot_pass').click(() => {
  window.open();
});

/*Кнопки перехода на другую страницу*/
$('#prev_page').click(() => {
  if (page_num > 0) {
    page_num--;
    removeTable();
    createTable(page_num);
  }
});
$('#next_page').click(() => {
  if (page_num < Math.floor(active_user.playlists.length / 10)) {
    page_num++;
    removeTable();
    createTable(page_num);
  }
});

//Кнопка добавить плейлист
$('#add_playlist').click(() => {
  //addInput();
  addPlaylist();
});

//Выйти из аккаунта
$('#logout').click(() => {
  localStorage.removeItem('enter');
  document.location.href = "popup.html";
});

/*Функция для перехода на другую страницу.
 * Активируется при нажатии кнопки sign in*/
$("#sign-in").click(() => {
  /*Получаем данные из формы*/
  let login = document.getElementById('login').value;
  let pass = document.getElementById('pass').value;

  //переходим на другую страницу
  document.location.href = "second_page.html";
  localStorage.setItem('enter', true);
  return false;
});

/*Создание списка плейлистов*/
function createTable(page) {
  let playlists_table = document.getElementById('playlist_ol');
  //for(let i = 0; i < active_user.playlists.length; i++){
  for (let i = page * 10; i < (page + 1) * 10; i++) {
    //Создаем плейлисты в html
    if (active_user.playlists[i]) playlists_table.innerHTML += '<li><div class="table_cell" id="edit_input_base_' + i + '"><a id="playlist_num_' + i + '">' + active_user.playlists[i].name + '</a><img src="/images/edit_playlist.png" class="open_playlist_img" id="open_btn_' + i + '"></div><div class="table_cell" id="edit_base_' + i + '"></div> </li>';
  }
  //Создаем инфо о показанных плейлистах
  let page_info = document.getElementById('this_playlists');
  page_info.innerHTML = (10 * page + 1) + ' - ' + (10 * (page + 1)) + ' Page: ' + (page_num + 1) + ' from ';
  document.getElementById('playlists_value').innerHTML = Math.floor(active_user.playlists.length / 10) + 1;

  //Вешаем слушатели на них
  for (let i = 0; i < active_user.playlists.length; i++) {
    $('#playlist_num_' + i).click(() => {

      //Эти строки выводят плейлист в новой вкладке
      /*var newWin = window.open(active_user.playlists[i].name, "width=200,height=200");
      newWin.document.write(active_user.playlists[i].name + ':' + '<hr>');
      for(let j = 0; j < active_user.playlists[i].objects.length; j++){
        newWin.document.write(active_user.playlists[i].objects[j] + '<hr>');
      }*/

      window.open();
    });
    $('#open_btn_' + i).click(() => {
      addEditInput(i);
    });
  }

  /**/
}

//Очищает счисок плейлистов
function removeTable() {
  let el = document.getElementById('playlist_ol');
  el.innerHTML = '';
}

/*Функция для добавления плейлиста в список*/
function addPlaylist() {
  let playlists = document.getElementById('playlist_ol');
  let name = "Playlist " + (active_user.playlists.length + 1);

  if (active_user.playlists.length >= 100) {
    alert("Вы не можете создать больше 100 плейлистов");
    return false;
  }
  let promise = new Promise((resolve, reject) => {
    chrome.extension.sendMessage({
      mes: "addPlaylist",
      name: name
    }, function(backMessage) {
      active_user = backMessage;
      console.log("Забрал из фона", active_user);
      resolve(active_user);
    });
  });

  promise.then(
    result => {

      //document.getElementById('playlists_value').innerHTML = " " + (active_user.playlists.length + 1);
      if (Math.floor((active_user.playlists.length - 1) / 10) == page_num) {
        playlists.innerHTML += '<li><div class="table_cell" id="edit_input_base_' + (active_user.playlists.length - 1) + '"><a id="playlist_num_' + (active_user.playlists.length - 1) + '">' + name + '</a><img src="/images/edit_playlist.png" class="open_playlist_img" id="open_btn_' + (active_user.playlists.length - 1) + '"></div><div class="table_cell" id="edit_base_' + (active_user.playlists.length - 1) + '"></div></li>';
        for (let i = 0; i < active_user.playlists.length; i++) {
          $('#playlist_num_' + i).click(() => {
            //editPlaylist('playlist_num_' + i);
            window.open();
          });
          $('#open_btn_' + i).click(() => {
            addEditInput(i);
          });
        }
      }
      else{
        page_num++;
        removeTable();
        createTable(page_num);
        if(Number(document.getElementById('playlists_value').innerHTML) != Math.floor(active_user.playlists.length / 10) + 1){
          document.getElementById('playlists_value').innerHTML = Math.floor(active_user.playlists.length / 10) + 1;
        }
      }

    },
    error => {
      alert("Ошибка в промисе");
    }
  );
}

/*Функция, которая убирает окно ввода в списке плейлистов*/
function removeInput() {
  let input_base = document.getElementById('input_base');
  input_base.innerHTML = '';
}

/*функция для добавления окна ввода при изменении названия плейлиста*/
function addEditInput(id) {
  let li_el = document.getElementById('edit_input_base_' + id);
  let li_el_value = li_el.innerText;
  document.getElementById("edit_base_" + id).innerHTML = '';
  li_el.innerHTML = '<input type="text" id="input_playlist_' + id + '" value="' + li_el_value + '"> <img src="/images/confirm.png" id="confirm_edit_' + id + '" /><img src="/images/cancel.png" id="cancel_edit_' + id + '" />';
  //Слушатель на кнопку "отменить"
  $('#cancel_edit_' + id).click(() => {
    li_el.innerHTML = '<a id="playlist_num_' + id + '">' + li_el_value + '</a><img src="/images/edit_playlist.png" class="open_playlist_img" id="open_btn_' + id + '">';
    console.log(document.getElementById('main-window').style.height);
    document.getElementById('main-window').style.height = (document.getElementById('main-window').style.height - 20) + "20px";
    $('#playlist_num_' + id).click(() => {
      window.open();
    });
    $('#open_btn_' + id).click(() => {
      addEditInput(id);
    });
  });
  //Слушатель на кнопку "подтвердить"
  $('#confirm_edit_' + id).click(() => {
    let new_name = document.getElementById('input_playlist_' + id).value;
    li_el.innerHTML = '<a id="playlist_num_' + id + '">' + new_name + '</a><img src="/images/edit_playlist.png" class="open_playlist_img" id="open_btn_' + id + '">';
    //Посылаем сообщение в фоновый скрипт чтобы изменить имя плейлиста в аккаунте
    chrome.extension.sendMessage({
      mes: "editPlaylist",
      name: new_name,
      id: id
    }, function(backMessage) {
      active_user = backMessage;
      console.log(active_user);
    });
    $('#playlist_num_' + id).click(() => {
      window.open();
    });
    $('#open_btn_' + id).click(() => {
      addEditInput(id);
    });
  });
}
