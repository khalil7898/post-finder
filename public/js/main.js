var postList = document.getElementById("posts-list");
var btn = document.getElementById("btn");

btn.addEventListener("click", function() {
  console.log(document.getElementById("keyWords").value)
  var requestBody = {
    accountUrl: document.getElementById("accountUrl").value,
    numberOfPosts: document.getElementById("numberOfPosts").value,
    keyWords: document.getElementById("keyWords").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };
  var request = new XMLHttpRequest();
  var url = "http://127.0.0.1:3000/getPosts";
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(requestBody));
  request.onload = function(oEvent) {
    if (request.readyState === 4) {
      if (request.status >= 200 && request.status < 400) {
        var ourData = JSON.parse(request.responseText);
        renderHTML(ourData);
      } else {
        console.log("Error", request.statusText);
        alert("ERROR");
      }
    }
  };
  request.onerror = function() {
    console.log("Connection error");
    alert("Connexion Error !");
  };
});

function renderHTML(data) {
  document.getElementById("posts-list").innerHTML = "";
  var htmlString = "";
  if (data.status == false) {
    htmlString = "<h2> Désolé aucun post trouvé. :/</h2>";
  } else {
    var listPost = data.posts;
    htmlString += "<ul>";
    for (var i = 0; i < listPost.length; i++) {
      htmlString += "<div class='card' style='width: 18rem;'>";
      htmlString += "<img src='" + listPost[i].img + "'";
      htmlString += "class='card-img-top' alt='...'>";
      htmlString += "<div class='card-body'>";
      htmlString += "<p class='card-text'>" + listPost[i].tag + "</p>";
      htmlString +=
        "<a href='" +
        listPost[i].link +
        "' class='btn btn-primary' target='_blank'>Ouvrire dans Facebook</a>";
      htmlString += "</div></div>";
    }
    htmlString += "</ul>";
  }

  postList.insertAdjacentHTML("beforeend", htmlString);
}
