import * as i18n from './i18n.js';


const idate = {
  format: '{day} %D de {month} del %Y %h:%m:%s',
  
  defaultIdiom: 'es_ES',
  
  now(format = idate.format, idiom = idate.defaultIdiom) {
    if (!(idiom in i18n)) throw 'not support idiom';
    
    const entry = i18n[idiom];
    const date = new Date();
    
    const hour    = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    const month = date.getMonth();
    const day   = date.getDate();
    const dayWeek   = date.getDay();
    const year  = date.getFullYear();
    
    const meridian = hour >= 12 ? 'PM' : 'AM';
    
    const out = format.replaceAll(/(\{[a-z]*\}|\%[D|M|Y|h|m|s])/g, function (repl) {
      switch (repl) {
        case '{month}': return entry.months[month];
        case '{day}': return entry.days[dayWeek];
        case '{meridian}': return meridian;
        
        case '%D': return day;
        case '%M': return month;
        case '%Y': return year;
        
        case '%h': return hour === 0 ? `0${hour}` : hour;
        case '%m': return String(minutes).length === 1 ? `0${minutes}` : minutes;
        case '%s': return String(seconds).length === 1 ? `0${seconds}` : seconds;
        
        default:
          console.error(`invalid format ${repl}`);
          return '';
      }
    });
    
    return {
      hour,
      minutes,
      seconds,
      meridian,
      month,
      day,
      year,
      time: date.getTime(),
      toDateString() {
        return out;
      }
    };
  }
}


export default idate;