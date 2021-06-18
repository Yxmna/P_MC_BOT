module.exports = {


  readDate: function(x) {
    var new_time = [];
    var text_time = [];
    var date = new Date();
    new_time = [
      date.getUTCFullYear() - x.getUTCFullYear(),
      date.getUTCMonth() - x.getUTCMonth(),
      date.getUTCDate() - x.getUTCDate(),
      date.getHours() - x.getHours(),
      date.getMinutes() - x.getMinutes(),
      date.getSeconds() - x.getSeconds()
    ]
    new_time[5] = new_time[5] + 2;
    if (new_time[5] < 0) {
      new_time[5] = new_time[5] + 60;
      new_time[4] = new_time[4] - 1;
    }
    if (new_time[4] < 0) {
      new_time[4] = new_time[4] + 60;
      new_time[3] = new_time[3] - 1;
    }
    if (new_time[3] < 0) {
      new_time[3] = new_time[3] + 23;
      new_time[2] = new_time[2] - 1;
    }
    if (new_time[2] < 0) {
      new_time[2] = new_time[2] + 30;
      new_time[1] = new_time[1] - 1;
    }
    if (new_time[1] < 0) {
      new_time[1] = new_time[1] + 12;
      new_time[0] = new_time[0] - 1;
    }
    if (new_time[5] == 0) {
      new_time[5] = "";
    } else if (new_time[5] == 1) {
      new_time[5] = "1 seconde";
    } else {
      new_time[5] = new_time[5] + " seconds";
    }
    if (new_time[4] == 0) {
      new_time[4] = "";
    } else if (new_time[4] == 1) {
      new_time[4] = "1 minute";
    } else {
      new_time[4] = new_time[4] + " minutes";
    }
    if (new_time[3] == 0) {
      new_time[3] = "";
    } else if (new_time[3] == 1) {
      new_time[3] = "1 heure";
    } else {
      new_time[3] = new_time[3] + " heures";
    }
    if (new_time[2] == 0) {
      new_time[2] = "";
    } else if (new_time[2] == 1) {
      new_time[2] = "1 jour";
    } else {
      new_time[2] = new_time[2] + " jours";
    }
    if (new_time[1] == 0) {
      new_time[1] = "";
    } else {
      new_time[1] = new_time[1] + " mois";
    }
    if (new_time[0] == 0) {
      new_time[0] = "";
    } else if (new_time[0] == 1) {
      new_time[0] = "1 an";
    } else {
      new_time[0] = new_time[0] + " ans";
    }
    new_time = new_time.filter(item => item !== "");
    if (new_time.length < 2) {
      new_time = new_time[0];
    } else {
      new_time = new_time[0] + " et " + new_time[1];
    }
    return new_time;
  },



}
