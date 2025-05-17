//counters
const yearCounter = document.getElementById("year-counter");
const weekCounter = document.getElementById("week-counter");
const dayCounter = document.getElementById("day-counter");
const hourCounter = document.getElementById("hour-counter");
const minutesCounter = document.getElementById("minutes-counter");
const secondCounter = document.getElementById("second-counter");

const percent = document.getElementById("percent");

//date fields
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");

startDateInput.onchange = (e) => {
  let date = startDateInput.value
  setDates(date, endDateString);
}

endDateInput.onchange = (e) => {
  let date = endDateInput.value
  setDates(startDateString, date);
}

//loading bar
const bar = document.getElementById("bar");

//canvas rendering
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//canvas variables
const halfWidth = canvas.width/2;
const halfHeight = canvas.height/2;

const thickness = 21;
const shadow = 10;
const offset = 10;

//date varibales
let startDateString = null;
let endDateString = null;

let endDate = new Date();
let startDate = new Date();

startDateString = getLocalData("startDate");
endDateString = getLocalData("endDate");

if(startDateString != null)
  startDateInput.value = startDateString;
if(endDateString != null)
  endDateInput.value = endDateString;

setDates(startDateString, endDateString);

console.log(startDate);
console.log(endDate);

setInterval(() => {
  const currentDate = new Date();
  const maxDifference = endDate - startDate;

  let currentDifference = endDate - currentDate;

  updateText(secondCounter, currentDifference, maxDifference, millisecondsToSeconds);
  updateText(minutesCounter, currentDifference, maxDifference, millisecondsToMinutes);
  updateText(hourCounter, currentDifference, maxDifference, millisecondsToHours);
  updateText(dayCounter, currentDifference, maxDifference, millisecondsToDays);
  updateText(weekCounter, currentDifference, maxDifference, millisecondsToWeeks);
  updateText(yearCounter, currentDifference, maxDifference, millisecondsToYears);

  updateBar(bar, currentDifference, maxDifference);
  updateBarText(percent, currentDifference, maxDifference);

  clearCanvas();

  //CENTER
  drawTimeArc(7, "#FFFFFF", "#F6FBE4", () => {
    return (-Math.PI * 2);
  })

  //second
  drawTimeArc(6, "#d9ed92", "#b5e48c", () => {
    let unit = currentDifference % 1000;
    return (unit/1000) * (-Math.PI * 2);
  })

  //minute
  drawTimeArc(5, "#99d98c", "#76c893", () => {
    let unit = millisecondsToSeconds(currentDifference) % 60;
    return (unit/60) * (-Math.PI * 2);
  })

  //hour
  drawTimeArc(4, "#52b69a", "#34a0a4", () => {
    let unit = millisecondsToMinutes(currentDifference) % 60;
    return (unit/60) * (-Math.PI * 2);
  })

  //day
  drawTimeArc(3, "#168aad", "#1a759f", () => {
    let unit = millisecondsToHours(currentDifference) % 24;
    return (unit/24) * (-Math.PI * 2);
  })

  //week
  drawTimeArc(2, "#28658E", "#35557D", () => {
    let unit = millisecondsToDays(currentDifference) % 7;
    return (unit/7) * (-Math.PI * 2);
  })

  //year
  drawTimeArc(1, "#42456C", "#493D63", () => {
    let unit = millisecondsToWeeks(currentDifference) % 52;
    return (unit/52) * (-Math.PI * 2);
  })

  //total
  drawTimeArc(0, "#4C395F", "#4F345A", () => {
    percentDone = (currentDifference)/maxDifference
    return percentDone * (-Math.PI * 2);
  })

}, 1);

function setDates(start, end){
  startDateString = start ?? startDateString;
  endDateString = end ?? endDateString;
  
  console.log(startDateString != "null");
  console.log(endDateString);
  
  let hasStartDate = startDateString != null && startDateString != 'null';
  let hasEndDate = endDateString != null && endDateString != 'null';

  if(hasStartDate)
  {
    startDate = new Date(startDateString);
  }

  if(hasEndDate && hasStartDate)
  {
    endDate = new Date(endDateString);
  }
  else if(!hasEndDate && hasStartDate)
  {
    endDate = new Date(startDateString);
    let year = endDate.getFullYear() + 1;

    endDate.setFullYear(year);
  }
  else
  {
    endDate = new Date();
    let year = endDate.getFullYear() + 1;

    endDate.setFullYear(year);
  }

  setLocalData("startDate", startDateString);
  setLocalData("endDate", endDateString);
}

function updateBar(bar, currentDifference, maxDifference){
  let percentDone = (maxDifference - currentDifference)/maxDifference;
  
  bar.style.width = `${percentDone * 100}%`;
}

function updateBarText(barText, currentDifference, maxDifference){
  let percentDone = (maxDifference - currentDifference)/maxDifference;
  
  barText.textContent = `${(percentDone * 100).toFixed(6)}%`;
}


function updateText(counter, currentDifference, maxDifference, conversionFunction){
  current = currentDifference;
  max = maxDifference;

  if(conversionFunction != null)
  {
    current = conversionFunction(current);
    max = conversionFunction(max);
  }
  
  counter.textContent = `${numberWithCommas(Math.floor(current))} / ${numberWithCommas(Math.floor(max))}`;
}

function drawTimeArc(order, color, shadowColor, angleFunction){
  let radius = halfWidth - (offset * order) - (thickness * (order + 1));
  let angle = 0;

  angle = angleFunction();

  for(let i = 0; i < shadow; i++)
  {
    drawArc(halfWidth, halfHeight+i + 1, radius, thickness, shadowColor, angle);
  }
  
  drawArc(halfWidth, halfHeight, radius, thickness, color, angle);
}

function millisecondsToYears(milliseconds) {
  const seconds = milliseconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days/ 7;
  const years = weeks/ 52;

  return years;
}

function millisecondsToWeeks(milliseconds) {
  const seconds = milliseconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days/ 7;

  return weeks;
}

function millisecondsToDays(milliseconds) {
  const seconds = milliseconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  return days;
}

function millisecondsToHours(milliseconds) {
  const seconds = milliseconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;

  return hours;
}

function millisecondsToMinutes(milliseconds) {
  const seconds = milliseconds / 1000;
  const minutes = seconds / 60;

  return minutes;
}

function millisecondsToSeconds(milliseconds) {
  const seconds = milliseconds / 1000;

  return seconds;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function clearCanvas(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawArc(x, y, r, thickness, color, angle){
  ctx.lineWidth = thickness;
  ctx.strokeStyle = color;

  ctx.beginPath();
  ctx.arc(x, y, r, 0, angle); 
  ctx.stroke();
}

function setLocalData(key, value){
  localStorage.setItem(key, value);
}

function getLocalData(key, value){
  return localStorage.getItem(key);
}