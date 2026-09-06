"use strict";

const MINUTES_PER_DAY = 1440;

const durationForm = document.getElementById("duration-form");
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");
const startNowButton = document.getElementById("start-now-button");
const endNowButton = document.getElementById("end-now-button");
const swapButton = document.getElementById("swap-button");
const dayStatus = document.getElementById("day-status");
const formError = document.getElementById("form-error");
const resultHours = document.getElementById("result-hours");
const resultMinutes = document.getElementById("result-minutes");
const totalMinutesValue = document.getElementById("total-minutes-value");
const decimalHoursValue = document.getElementById("decimal-hours-value");
const resultRange = document.getElementById("result-range");
const resultSection = document.getElementById("result-section");

function parseTimeToMinutes(timeValue) {
  const [hours, minutes] = timeValue.split(":").map(Number);
  return (hours * 60) + minutes;
}

function getCurrentTimeValue() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function calculateDuration() {
  const startValue = startTimeInput.value;
  const endValue = endTimeInput.value;

  if (!startValue || !endValue) {
    formError.textContent = "Choose both a start time and an end time.";
    return false;
  }

  formError.textContent = "";

  const startMinutes = parseTimeToMinutes(startValue);
  let endMinutes = parseTimeToMinutes(endValue);
  const isNextDay = endMinutes < startMinutes;

  if (isNextDay) {
    endMinutes += MINUTES_PER_DAY;
  }

  const durationMinutes = endMinutes - startMinutes;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const decimalHours = durationMinutes / 60;

  resultHours.textContent = String(hours);
  resultMinutes.textContent = String(minutes).padStart(2, "0");
  totalMinutesValue.textContent = String(durationMinutes);
  decimalHoursValue.textContent = decimalHours.toFixed(2);
  resultRange.textContent = `${startValue} → ${endValue}${isNextDay ? " (+1 day)" : ""}`;
  dayStatus.textContent = isNextDay ? "Next day detected automatically" : "Same day";
  dayStatus.classList.toggle("is-next-day", isNextDay);

  return true;
}

function handleSubmit(event) {
  event.preventDefault();

  if (calculateDuration()) {
    resultSection.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function handleSwap() {
  const currentStart = startTimeInput.value;
  startTimeInput.value = endTimeInput.value;
  endTimeInput.value = currentStart;
  calculateDuration();
}

function setStartToNow() {
  startTimeInput.value = getCurrentTimeValue();
  calculateDuration();
}

function setEndToNow() {
  endTimeInput.value = getCurrentTimeValue();
  calculateDuration();
}

function initializeApp() {
  durationForm.addEventListener("submit", handleSubmit);
  swapButton.addEventListener("click", handleSwap);
  startNowButton.addEventListener("click", setStartToNow);
  endNowButton.addEventListener("click", setEndToNow);
  startTimeInput.addEventListener("input", calculateDuration);
  endTimeInput.addEventListener("input", calculateDuration);
  calculateDuration();
}

initializeApp();
