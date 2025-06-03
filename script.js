import {listOfTracks} from "./api.js";  // to import the music list 

// to create random colors to styling the background when song changes
const randomBg = () => {
    let code = "";
    let hex = "9876543210abcdef";
    if(code === "") {
        for(let x = 0; x < 8; x++) {
            let random = Math.floor(Math.random()*16);
            code += hex[random];
            document.querySelector(".wrapper").style.backgroundColor = `#${code}`; 
        }
    }
    code = "";
}


const music = document.createElement("audio");  // added audio tag to play music in the app

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const playPause = document.getElementById("play-pause");
const trackImage = document.querySelector(".image"); 

let isPlaying = false;
let index ;



function musicdata() {
    title.innerHTML = `<span style="font-size:18px;">${listOfTracks[index].name}</span> <br> <span style="font-size:12px;">${listOfTracks[index].artist}</span>`;
    trackImage.innerHTML = `<img src="${listOfTracks[index].image}">`;
    music.src = listOfTracks[index].url;
    music.play();
    isPlaying =true;
    randomBg();
    musicDuration();
}

// functions for button events

// to go to previous song
const prevBtn = () => {
    if(index > 0) {
        index--;
        musicdata();
        callFunction();
        playPause.src = "image/pause.png";

    }
}

// to go to next song
const nextBtn = () => {
    if(index < listOfTracks.length - 1) {
        index++
        musicdata();
        callFunction();
        playPause.src = "image/pause.png";

    }
}

// to play and pause the song
const PlayPauseBtn = () => {
    if(!isPlaying) {
        if(index >= 0){
            music.play();
            isPlaying =true;
            playPause.src = "image/pause.png";
        }
    }else{
        music.pause()
        isPlaying = false;
        playPause.src = "image/play-button.png";
    }
}

const musicList = document.querySelector(".list-items");
const title = document.querySelector(".title");

// accessing all the tracks available in api.js and storing it in lists
listOfTracks.forEach((track) => {
    const list = document.createElement("li");
    list.innerHTML = `<span id=${track.trackId} style="display:content;">
    <span style=""> <img src=${track.image} height="20px"></span>
    <span style="font-size:18px;">${track.name}</span> <br> 
    <span style="font-size:12px;">${track.artist}</span></span>`;
    music.src = `${track.url}`;
    musicList.appendChild(list);
    
})

// music list event to play music and access related information by clicking on listitem
musicList.addEventListener("click", (event) => {
    if(event.target.tagName === "LI"){
        title.innerHTML = event.target.innerHTML;
        index = event.target.childNodes[0].attributes[0].value - 1;
        music.src = listOfTracks[index].url;
        trackImage.innerHTML = event.target.childNodes[0].children[0].innerHTML;
        playPause.src = "image/pause.png";
        music.play();
        isPlaying =true;
        musicDuration();
        randomBg();
        slideFunction();
        callFunction();
    }
})

const slideBtn = document.querySelector(".slide-button");

// button events
document.addEventListener("click", (e) => {
    if(e.target === prev) {
        prevBtn();
    }
    else if(e.target === next) {
        nextBtn();
    }
    else if(e.target === playPause) {
        PlayPauseBtn();
        pauseTrackTime();
        valueStore();
    }
    else if(e.target === slideBtn) {
        slideFunction();
    }
})


// to convert miliseconds to seconds and minutes:
const totalDuration = document.querySelector(".total-duration"); 
const runningDuration = document.querySelector(".running-duration"); 
const seekBtn = document.getElementById("range");

seekBtn.disabled = true;

const musicDuration = () => {
    let durationInSec = listOfTracks[index].duration/1000;
    let minutes = Math.floor(durationInSec/60);
    let seconds = Math.floor(durationInSec - minutes*60);
    if(minutes > 9 && seconds > 9){
       return totalDuration.innerHTML = `${minutes}:${seconds}`;
    }
    else if(minutes <= 9 && seconds > 9) {
       return totalDuration.innerHTML = `0${minutes}:${seconds}`;
    }
    else if(minutes > 9 && seconds <= 9) {
       return totalDuration.innerHTML = `${minutes}:0${seconds}`;
    }
    else{
        return totalDuration.innerHTML = `0${minutes}:0${seconds}`;
    }
}

// to create the running time duration of song
let playTime; // this variable is made to store the current playing time of music do not change or assign value to it
let sec = 0;
let min = 0;
const onseek = () => {
playTime = setInterval(() =>{
    if(sec < 59) {
            if(sec < 9 && min < 10) {
                sec++;
                runningDuration.innerHTML = `0${min}:0${sec}`;
            }
            else if(sec >= 9 && min < 10) {
                sec++;
                runningDuration.innerHTML = `0${min}:${sec}`;
            }
            else if(sec < 10 && min > 10) {
                sec++;
                runningDuration.innerHTML = `${min}:0${sec}`;
            }else{
                sec++;
                runningDuration.innerHTML = `${min}:${sec}`;
            }
        }else{
            if(min < 10) {
                min++;
                runningDuration.innerHTML = `0${min}:00`;
                sec = 0;
            }else{
                min++;
                runningDuration.innerHTML = `${min}:00`;
                sec = 0
            }
        }
        
    },1000)

    setTimeout(() => {
        clear();
    },listOfTracks[index].duration);
}


// to clear the current played time of the music  
const clear = () => {
    clearInterval(playTime);
    sec = 0;
    min = 0;
    runningDuration.innerHTML = `0${min}:0${sec}`;
}
    
// to create silde function for music lists it works only in moblie version
const listArea = document.querySelector(".lists");

const slideFunction = () => {
    listArea.classList.toggle("slideFunction"); 
    slideBtn.classList.toggle("rotateBtn");
}

// to call out stack of functions in one go
const callFunction = () => {
    clear();
    clearRange();
    onseek();
    seekValue();
}

//  this is the function to pause the track play time when the playPauseBtn is clicked

const pauseTrackTime = () => {
    let storeTime;
    let timeElapsed;
    if(!isPlaying) {
        if(min < 10 && sec < 10){
            storeTime = `0${min}:0${sec}`;
        }
        else if(min > 9 && sec < 10){
            storeTime = `${min}:0${sec}`;
        }
        else if(min < 10 && sec > 9){
            storeTime = `0${min}:${sec}`;
        }
        else if(min > 9 && sec > 9){
            storeTime = `${min}:${sec}`;
        }
        timeElapsed = (min*60 + sec)*1000;
        clearInterval(playTime);
        runningDuration.innerHTML = storeTime;    
    }
    else if(isPlaying) {
        if(timeElapsed >= 1000) {
            sec = timeElapsed/1000;
            if(sec >= 58){
                min = Math.floor(sec/60);
            }
        }
        
        if(min < 10 && sec < 10){
            runningDuration.innerHTML = `0${min}:0${sec}`;
        }
        else if(min > 9 && sec < 10){
            runningDuration.innerHTML = `${min}:0${sec}`;
        }
        else if(min < 10 && sec > 9){
            runningDuration.innerHTML = `0${min}:${sec}`;
        }
        else if(min > 9 && sec > 9){
            runningDuration.innerHTML = `${min}:${sec}`;
        }
        onseek();
    }
}


// to attach the range value to the running time duration of song
let rangeInterval;  // this variable is made to store the current playing time of music do not change or assign value to it
let val = 0;
let store = 0;
const seekValue = () => {
    rangeInterval = setInterval(() =>{
        val++
        if(seekBtn.value <=100){
            seekBtn.value = store + val;
        }
    },listOfTracks[index].duration/100);

    setTimeout(() => {
        clearRange();    
    },listOfTracks[index].duration)
}
   
// to clear the current played time of the music on rangebar 
const clearRange = () => {
       clearInterval(rangeInterval);
       val = 0;
       seekBtn.value = val;
}

const valueStore = () => {
    if(!isPlaying) {
        store = val;
        clearRange();
        seekBtn.value = store;
        console.log(store);
    }else if(isPlaying) {
        seekBtn.value = store + val; 
        console.log(store);
        seekValue();
        console.log(seekBtn.value);
    }
}


// END OF CODE.
