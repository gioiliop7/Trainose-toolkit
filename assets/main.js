(function () {
  document.querySelector("#file").onchange = function ({
    target: {
      files: [file],
    },
  }) {
    if (file.type != "application/json") {
      alert("Please select JSON files only!");
      this.value = "";
      return;
    }
  };
  function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event) {
    var obj = JSON.parse(event.target.result);
    var data = obj.data;
    if ("status" in obj) {
      console.log("Valid Json");
    } else {
      alert("Δώσε ένα json του τύπου που υπάρχει στις οδηγίες");
      return;
    }
    if (data){
      if ("etickets" in data){
        console.log("Valid Json");
      } else {
        alert("Δώσε ένα json του τύπου που υπάρχει στις οδηγίες");
        return;
      }
    }
    let valid_tickets = data.valid_etickets;
    let total = data.totalSum;
    let uploader = document.getElementById("uploader");
    let ticket = document.getElementById("ticket");
    uploader.style.display = "none";
    ticket.style.display = "block";
    let cost = document.querySelector(".total-cost");
    cost.innerText = `Total cost : ${total}€`;
    let purchases = document.querySelector(".total-tickets");
    purchases.innerText = `Total tickets : ${valid_tickets}`;
    let etickets = data.etickets;
    let trains = [];
    etickets.forEach((element) => {
      let train = element.treno;
      trains.push(train);
    });
    var most_frequent = 1;
    var m = 0;
    var item;

    for (var i = 0; i < trains.length; i++) {
      for (var j = i; j < trains.length; j++) {
        if (trains[i] == trains[j]) m++;
        if (most_frequent < m) {
          most_frequent = m;
          item = trains[i];
        }
      }
      m = 0;
    }
    let frequency = document.querySelector(".frequency");
    frequency.innerText = `Most used train: ${item} - ${most_frequent} times`;

    let latest = document.getElementById("latest");
    latest.addEventListener(
      "click",
      function () {
        let tc = document.querySelector(".ticket-content");
        tc.style.display = "none";
        let lt = document.querySelector(".latest-ticket");
        lt.style.display = "block";
        let latest_ticket = etickets[0];
        let id = latest_ticket.id;
        let safety_code = latest_ticket.code;
        let apo = latest_ticket.apo;
        let ews = latest_ticket.ews;
        let date = latest_ticket.dbrd;
        let time = latest_ticket.tapo;
        time = time.replace(".", ":");
        let link = `https://extranet.trainose.gr/epivatikos/public_ticketing/ajax.php?c=ticket&op=get&ticket=${id}&card=${safety_code}`;

        var a = document.getElementById("latestlink");
        a.href = link;

        var tid = document.getElementById("ticket-id");
        tid.innerText = `Ticket ID: ${id}`;

        var tdate = document.getElementById("date");
        tdate.innerText = `Date: ${date}`;

        var ttime = document.getElementById("time");
        ttime.innerText = `Time: ${time}`;

        var from = document.querySelector(".from");
        from.innerText = `${apo}`;

        var to = document.querySelector(".to");
        to.innerText = `${ews}`;
      },
      false
    );
  }
  document.getElementById("file").addEventListener("change", onChange);
})();
