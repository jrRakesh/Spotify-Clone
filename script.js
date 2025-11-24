let play = document.querySelector("#playButton");
let currentSong = new Audio();

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];

    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

function playMusic(track, pause = false) {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "images/pause-button.png";
  }

  document.querySelector(".songInfo").querySelector(".songName").innerHTML =
    decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00:00";
}

function secondsToMinuteSeconds(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  // Add leading zero if needed
  const mm = mins.toString().padStart(2, "0");
  const ss = secs.toString().padStart(2, "0");

  return `${mm}:${ss}`;
}

async function main() {
  let songs = await getSongs();
  playMusic(songs[0], true);

  let songsUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  // Here decodeURIComponent(songs) is used to remove the %letters from the song title

  for (const song of songs) {
    songsUL.innerHTML =
      songsUL.innerHTML +
      `<li> 
            <img class="invert" src="images/music.svg" alt="">

            <div class="info">
              <div class="name">${decodeURI(song)}</div>
              <div class="name">Rakesh</div>
            </div>
             
            <div class="playInfo">
              <div class="playNow">Play Now</div>
              <img class="invert" src="images/play-button.png" alt="">
            </div>    </li>`;
  }

  //attaching an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  //adding an event listener to play/pause a song

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause-button.png";
    } else {
      currentSong.pause();
      play.src = "images/play-button.png";
    }
  });

  //listening for timeupdate

  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${secondsToMinuteSeconds(
      currentSong.currentTime
    )} / ${secondsToMinuteSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

    //lsitening the seekbar
  document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //listening hamburger
    document.querySelector(".nav").addEventListener("click", () => {
      document.querySelector(".left").style.left = 0 + "%"
    })
    
    //listening close button
    document.querySelector(".close").addEventListener("click", () => {
      document.querySelector(".left").style.left = -120 + "%"
    })
}

main();
