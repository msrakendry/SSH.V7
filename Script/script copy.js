  ///////////////////////////////////////////////////////start  bigger////////////////////////////////////////////////////////


let h = 0;

function poymer() {
  const frgmagj = document.getElementsByClassName("gallery-cell");
  const frsldebtu = document.getElementsByClassName("dotgo");

  for (let a = 0; a < frgmagj.length; a++) {
    frgmagj[a].style = "display:none";
  }
  for (let a = 0; a < frsldebtu.length; a++) {
    frsldebtu[a].className = frsldebtu[a].className.replace(" activeo", "");
  }

  h++;
  if (h > frgmagj.length) {
    h = 1;
  }

  frgmagj[h - 1].style = "display: block;   ";
  frsldebtu[h - 1].className += " activeo";

  setTimeout(poymer, 3000);
}

poymer();

  ///////////////////////////////////////////////////////end BIGGER////////////////////////////////////////////////////////
  


  ///////////////////////////////////////////////////////end BIGGER////////////////////////////////////////////////////////
  

  let sglideIng = 1;
  guwSlides(sglideIng);
  
  // Next/previous controls
  function plugoi(U) {
    guwSlides(sglideIng += U);
  }
  
  // Thumbnail image controls
  function currbikl(U) {
    guwSlides(sglideIng = U);
  }
  
  function guwSlides(U) {
    let d;
    let snmcdes = document.getElementsByClassName("gallery-cell");
    let djits = document.getElementsByClassName("dotgo");
    if (U > snmcdes.length) {sglideIng = 1}
    if (U < 1) {sglideIng = snmcdes.length}
    for (d = 0; d < snmcdes.length; d++) {
      snmcdes[d].style.display = "none";
    }
    for (d = 0; d < djits.length; d++) {
      djits[d].className = djits[d].className.replace(" activeo", "");
    }
    snmcdes[sglideIng-1].style.display = "block";
    djits[sglideIng-1].className += " activeo";
  }
  
  
  