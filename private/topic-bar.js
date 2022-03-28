function openPage(pageName, element) {
  // Hide all elements with class="tabContent" by default */
  var i, tabContent, tabLinks;
  tabContent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  // Show the specific tab content
  document.getElementById("profile").style.display = "block";

}

// Get the element with id="defaultOpen" and click on it
document.getElementsByClassName("defaultOpen").click();
