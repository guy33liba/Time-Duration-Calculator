"use strict";

const MINUTES_PER_DAY = 1440;

const durationForm = document.getElementById("duration-form");
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");
const overnightToggle = document.getElementById("overnight-toggle");
const swapButton = document.getElementById("swap-button");
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

function formatTimeLabel(timeValue) {
  return timeValue || "--:--";
}

function calculateDuration() {
  const startValue = startTimeInput.value;
  const endValue = endTimeInput.value;

  if (!startValue || !endValue) {
    formError.textContent = "Please choose both a start time and an end time.";
    return false;
  }

  formError.textContent = "";

  const startMinutes = parseTimeToMinutes(startValue);
  let endMinutes = parseTimeToMinutes(endValue);

  if (overnightToggle.checked) {
    endMinutes += MINUTES_PER_DAY;
  } else if (endMinutes < startMinutes) {
    formError.textContent = "End time is earlier than start time. Select “Ends next day” for an overnight duration.";
    return false;
  }

  const durationMinutes = endMinutes - startMinutes;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const decimalHours = durationMinutes / 60;

  resultHours.textContent = String(hours);
  resultMinutes.textContent = String(minutes);
  totalMinutesValue.textContent = String(durationMinutes);
  decimalHoursValue.textContent = decimalHours.toFixed(2);
  resultRange.textContent = `${formatTimeLabel(startValue)} → ${formatTimeLabel(endValue)}${overnightToggle.checked ? " (+1 day)" : ""}`;

  return true;
}

function handleSubmit(event) {
  event.preventDefault();

  const didCalculate = calculateDuration();
  if (!didCalculate) {
    return;
  }

  resultSection.scrollIntoView({ behavior: "smooth", block: "center" });
}

function handleSwap() {
  const currentStart = startTimeInput.value;
  startTimeInput.value = endTimeInput.value;
  endTimeInput.value = currentStart;

  if (parseTimeToMinutes(endTimeInput.value) < parseTimeToMinutes(startTimeInput.value)) {
    overnightToggle.checked = true;
  } else {
    overnightToggle.checked = false;
  }

  calculateDuration();
}

function handleTimeChange() {
  formError.textContent = "";
}

function initializeApp() {
  durationForm.addEventListener("submit", handleSubmit);
  swapButton.addEventListener("click", handleSwap);
  startTimeInput.addEventListener("input", handleTimeChange);
  endTimeInput.addEventListener("input", handleTimeChange);
  overnightToggle.addEventListener("change", handleTimeChange);
  calculateDuration();
}

initializeApp();
