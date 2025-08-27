function changeView(activeID) {
  const IDs = ["loading-screen", "loading-error"];
  for (id of IDs) {
    document.getElementById(id).style.display = "none";
  }

  document.getElementById(activeID).style.display = "block";
}
