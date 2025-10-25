function openEventModal() {
  document.getElementById("eventModal").classList.remove("hidden");
  updateEventButtons();
  // updateEventModal();
}

function closeEventModal() {
  document.getElementById("eventModal").classList.add("hidden");
}