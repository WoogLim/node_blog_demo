Date.prototype.YYYYMMDDHHMMSS = function() {
  let YYYY = this.getFullYear().toString();
  let MM = pad(this.getMonth() + 1,2);
  let DD = pad(this.getDate(), 2);
  let hh = pad(this.getHours(), 2);
  let mm = pad(this.getMinutes(), 2)
  let ss = pad(this.getSeconds(), 2)

  return YYYY+'-'+MM+'-'+DD+' '+hh+'-'+mm+'-'+ss
}

function pad(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

module.exports = { Date };