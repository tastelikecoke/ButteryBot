"use strict";

function addImage(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    callback(window.URL.createObjectURL(this.response));
  };
  xhr.send();
}

var app = new Vue({
  el: '#app',
  data: {
    textbox: '',
    now: 0,
    timer: { end: 0, },
    chats: [],
    trigger: {
      timer: false,
    }
  },
  methods: {
    addChat: function(){
      this.addChatString("You: " + this.textbox);
      bot.read(this.textbox);
      this.textbox = '';
    },
    addChatString: function(string){
      this.chats.push({text: string});
    },
    addChatImage: function(url){
      addImage(url, function(objectURL){
        app.chats.push({text: 'Bot: ', image: objectURL});
      });
    },
    addTimer(duration){
      this.timer.end = Date.now() + duration;
      this.trigger.timer = true;
    }
  }
});

Vue.filter('humanize', function(value){
  var output = "";
  var mins = 0;
  while(value > 60000){
    mins += 1.0;
    value -= 60000;
  }
  var secs = value / 1000;
  if(mins != 0) output += mins.toString()+"m";
  if(secs >= 10) output += Math.floor(secs).toString();
  else output += '0'+Math.floor(secs).toString();
  output += "s";
  return output;
});

var bot = {
  init: function(){
    app.addChatString('Bot: Hi, I\'m a buttery bot!');
    setInterval(function(){
      app.now = Date.now();
      if(app.trigger.timer){
        if(app.timer.end < app.now){
          app.addChatString('Bot: Time\'s up!');
          app.trigger.timer = false;
        }
      }
    }, 100);
  },
  read: function(string){
    var strings = string.split(' ');
    if(strings[0] == 'hi'){
      app.addChatString('Bot: Hi!');
    }
    if(strings[0] == 'cat'){
      app.addChatImage('http://thecatapi.com/api/images/get?format=src&type=gif');
    }
    if(strings[0] == 'timer'){
      app.addChatString('Bot: Aye aye! counting now.');
      if(strings[2]) app.addTimer(parseInt(strings[1])*60000 + parseInt(strings[2])*1000);
      else if(strings[1]) app.addTimer(parseInt(strings[1])*1000);
      else app.addTimer(1*5*1000);
    }
  },
}
bot.init();
