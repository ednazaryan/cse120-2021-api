function deleteData(id) {

    var r = confirm("Are you sure you want to delete the item with the following ID? " + id);
    if (r == false) {
        return;
    }

    var tmp = {
        "id": id
    }

    $.ajax({
        type: 'POST',
        url: "https://cse120-2021-api-ed.herokuapp.com/data/delete",
        data: tmp,
        cache: false,
        dataType : 'json',
        success: function (data) {
            console.log("success");
            document.getElementById("div" + id).style.display = "none";
        },
        error: function (xhr) {
            console.error("Error in post", xhr);
        },
        complete: function () {
            console.log("Complete");  
        }
    });
}

function saveData() {
	var tmp = {
		"test": "Data"
	}

    $.ajax({
        type: 'POST',
        url: "https://cse120-2021-api-ed.herokuapp.com/data",
        data: tmp,
        cache: false,
        dataType : 'json',
        success: function (data) {
        	console.log("success");
        },
        error: function (xhr) {
            console.error("Error in post", xhr);
        },
        complete: function () {
            console.log("Complete");  
        }
    });
}

function updateData(e) {
  e.preventDefault();
  var updatedPoker = {};
  updatedPoker.id = document.getElementById("_id").value;
  updatedPoker.name = document.getElementById("name").value;
  updatedPoker.email = document.getElementById("email").value;
  updatedPoker.unique = document.getElementById("unique").value;
  updatedPoker.pset = document.getElementById("pset").value;
  updatedPoker.fplayer = document.getElementById("fplayer").value;
  updatedPoker.comb = document.getElementById("comb").value;
  updatedPoker.money = document.getElementById("money").value;
  updatedPoker.lplay = document.getElementById("lplay").value;
  updatedPoker.holdem = document.getElementById("holdem").value;
  updatedPoker.omaha = document.getElementById("omaha").value;
  updatedPoker.chips = document.getElementById("chips").value;
  updatedPoker.sblind = document.getElementById("sblind").value;
  updatedPoker.bblind = document.getElementById("bblind").value;

  $.ajax({
    type: 'POST',
    url: "https://cse120-2021-api-ed.herokuapp.com/data/update",
    data: updatedPoker,
    cache: false,
    dataType: 'json',
    success: function (data) {
      console.log("success");
    },
    error: function (xhr) {
      console.error("Error in post", xhr);
    },
    complete: function () {
      console.log("Complete");
    }
  });

}

function loadExistingData() {
  myPokerData = [];
  myBookData = [];
  otherData = [];
  $.ajax({
      type : "GET",
      url : "https://cse120-2021-api-ed.herokuapp.com/data",
      dataType : "json",
      success : function(data) {
        console.log("success", data);
        loadedData = data.data;
        data.data.forEach(elem => {
          if (elem["owner"] == "Edmon Nazaryan") {
            if (elem["project"] == "Hobby") {
              myPokerData.push(elem);
            } else {
              myBookData.push(elem);
            }
          } else {
            otherData.push(elem);
          }
        })
        displayData(myPokerData, "pokerDataContainer");
        displayData(myBookData, "bookDataContainer");
        displayData(otherData, "otherDataContainer");
      },
      error : function(data) {
          console.log("Error")
      }
  });
}

function displayData(data, containerDivName) {
    document.getElementById(containerDivName).innerHTML = "";
    data.forEach(elem => {
        var item = document.createElement("div");
        item.id = "div" + elem["_id"];
        item.className = "item";
        if (Object.keys(elem).length == 1) {
            var span = document.createElement("span");
            span.innerHTML = "<i>Empty Element with autogenerated ID: </i>" + elem["_id"];
            item.appendChild(span);
        }
        Object.keys(elem).forEach(key => {
            if (key != "_id") {
              var span = document.createElement("span");

              var b = document.createElement("b");
                b.innerHTML = key + ": ";
                span.appendChild(b);
                
                span.className = "item";
                if (elem[key]) {
                    span.innerHTML += elem[key];
                } else {
                    var span1 = document.createElement("span");
                    span1.className = "undefined";
                    span1.innerHTML = "N/A";
                    span.appendChild(span1)
                }
                item.appendChild(span);

              var br = document.createElement("br");
                item.appendChild(br);
            }
        })

        if (elem["owner"] == "Edmon Nazaryan") {
          var button2 = document.createElement("button");
          button2.innerHTML = "Edit";
          button2.className = "editButton";
          button2.id = "edit_"+ elem["_id"];
          button2.addEventListener("click", function(e){
          editData(e, e.target.id);
          }, false);
          item.appendChild(button2);
        }

        if (elem["owner"] == "Edmon Nazaryan" || (elem["name"] && elem["name"].indexOf("Edmon Nazaryan") > -1)) {
          var button = document.createElement("button");
          button.innerHTML = "Delete";
          button.id = elem["_id"];
          button.addEventListener("click", function(e){
          deleteData(e.target.id);
          }, false);
          item.appendChild(button);
         }
         document.getElementById(containerDivName).appendChild(item);
     
    })


    document.querySelectorAll("#" + containerDivName +" div.item").forEach(div => {
      div.addEventListener("click", function(e){
        if (this.style.height == "auto") {
          this.style.height = "30px";
        } else {
          this.style.height = "auto";
        }
      })        
    })
}


function toggleotherData() {
  var otherData = document.getElementById("otherDataContainer");
  if (otherData.style.display == "block") {
    otherData.style.display = "none";
    document.getElementById("otherDataToggle").checked = false;
  } else {
    otherData.style.display = "block";
    document.getElementById("otherDataToggle").checked = true;
  }
}


var loadedData = [];

function editData(e, id){
  e.stopImmediatePropagation();
 var tmp = id.split("edit_");
 var item_id = tmp[1];
 console.log(item_id);

loadedData.forEach(item => {
    if (item._id == item_id && item["owner"] == "Edmon Nazaryan") {
        console.log(item); 
        localStorage = window.localStorage;
        localStorage.setItem('editItem', JSON.stringify(item));
        if (item["project"] == "Hobby") {
          document.location  = "edit_hobby.html"; 
        } else {
         
        }
    }
  })
}

function loadpokerItemForEdit() {
  localStorage = window.localStorage;
  editItem = JSON.parse(localStorage.getItem("editItem"));
  console.log(editItem);
  document.getElementById("_id").value = editItem["_id"];
  document.getElementById("name").value = editItem["name"]; 
  document.getElementById("email").value = editItem["email"];  
  document.getElementById("unique").value = editItem["unique"];
  document.getElementById("pset").value = editItem["pset"]; 
  document.getElementById("fplayer").value = editItem["fplayer"]; 
  document.getElementById("comb").value = editItem["comb"]; 
  document.getElementById("money").value = editItem["money"]; 
  document.getElementById("lplay").value = editItem["lplay"]; 
  document.getElementById("holdem").value = editItem["holdem"]; 
  document.getElementById("omaha").value = editItem["omaha"]; 
  document.getElementById("chips").value = editItem["chips"];
  document.getElementById("sblind").value = editItem["sblind"];
  document.getElementById("bblind").value = editItem["bblind"];
  
}

