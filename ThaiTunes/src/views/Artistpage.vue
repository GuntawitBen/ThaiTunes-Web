<template>
  <div class="body">
    <router-link :to="`/artist`" class="backbtn">
          <img src="../components/icon/chevron-left.svg" alt="goback">
    </router-link>
    <div class="image-container" :style="{ backgroundImage: 'url(' + songs[0]?.artWorkURL + ')' }">
      <div class="artist-wrapper">
        
        <div class="playbtn" @click="$emit('clickedSong', songs[0].songName)">
          <img src="../components/icon/play.svg" alt="Play" />
        </div>
        <div class="artist-name">{{ songs[0]?.artistName }}</div>
        <!-- Display artist name from first song -->
        <!-- <div class="follow-btn">follow</div> -->
      </div>
    </div>
    <!-- <h1 style="margin-left: 5%"></h1> -->
    <div class="artistpage-wrapper">
      <div class="popular-container">
        <!-- <div class="headers">
          <div style="width: 5%">Order</div>
          <div style="width: 47%">Name</div>
          <div style="width: 30%">Album</div>
          <div style="width: 15%">Date Added</div>
        </div> -->
        <div v-for="(song, index) in songs" :key="song._id" class="songSegment">
          <SuiSegment class="songSuiSegment">
          <div class="song-content">
            <SuiButton circular icon="play" inverted color="teal" class="playButton"
              @click="$emit('clickedSong', song.songName)" />
            <img :src="song.artWorkURL" alt="album art" class="albumArt" />
            <div class="song-info">
              <h3>{{ song.songName }}</h3>
              <p>{{ song.artistName }}</p>
            </div>
            <div class="album-info">
              <p>{{ song.albumName }}</p>
            </div>
            <div class="option-button">
              <SuiButton circular icon="add" size="mini" class="addButton"
                @click="showForm = true; selectedSong = song.songName" />
            </div>
          </div>
        </SuiSegment>
        </div>
      </div>
    </div>
  </div>

  <!-- Form for adding a song to a playlist -->
  <SuiModal v-model="showForm">
      <SuiModalHeader>Add a song to Playlist</SuiModalHeader>
      <SuiModalContent>
        <form @submit.prevent="submitForm" class="form-container">
          <!-- <div class="user field">
            <label>User Name: </label>
            <input type="text" value="bob" disabled />
          </div> -->
          <div class="field">
            <label>Song Name: </label>
            <input type="text" v-model="selectedSong" disabled />
          </div>
          <div class="field">
            <label>Playlist Number: </label>
            <input type="number" v-model="newSong.playListNumber" min="1" max="3" required />
          </div>
          <SuiButton type="submit" color="teal">Add</SuiButton>
        </form>
      </SuiModalContent>
    </SuiModal>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import {
  SuiHeader,
  SuiSegment,
  SuiButton,
  SuiModal,
  SuiModalHeader,
  SuiModalContent,
} from 'vue-fomantic-ui';

const uniqueArtists = ref([]);
const showForm = ref(false);
const selectedSong = ref('');
const newSong = ref({
  playListNumber: null,
});
const route = useRoute();
const artistName = ref(route.params.artistName);
const songs = ref([]);

const fetchSongs = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/artist/${artistName.value}`
    );
    songs.value = response.data;
  } catch (error) {
    console.error(
      `Error fetching songs for artist ${artistName.value}:`,
      error
    );
  }
};

const playFirstSong = () => {
  if (songs.value.length > 0) {
    const firstSong = songs.value[0];
    // Emit an event to play the first song's name
    $emit("clickedSong", firstSong.songName);
  }
};

const playSong = (song) => {
  console.log(`Playing song: ${song.songName}`);
  // Logic to play the song goes here
};

//Method to make a form which adds to the playlist
const addToPlaylist = async (userName, songName, playlistNum) => {
  try {
    const response = await axios.post('http://localhost:3000/addToPlaylist', {
      user: userName,
      songName: songName,
      playListNumber: playlistNum,
    });
    if (response.status === 201) {
      showForm.value = false;
      newSong.value.playListNumber = null;
    }
    alert("Added Song Successfully");
  } catch (error) {
    console.error('Error adding to playlist:', error);
  }
  showForm.value = false;
};

//Function called when form submit button is pressed
const submitForm = () => {
  const userName = 'bob'; // Hardcoded as per the form field
  addToPlaylist(userName, selectedSong.value, newSong.value.playListNumber);
};

onMounted(() => {
  fetchSongs();
});

watch(
  () => route.params.artistName,
  (newArtistName) => {
    artistName.value = newArtistName;
    fetchSongs();
  }
);
</script>

<style scoped>
@import url("../css/artistpage.css");

.image-container {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  min-width: 800px; /* Adjust this as needed */
}

.image-container .artist-wrapper {
  text-align: center;
  /* color: white; */
}

.image-container .artist-name {
  font-size: 24px;
  margin-top: 10px;
}

.image-container .follow-btn {
  margin-top: 5px;
  padding: 8px 20px;
  border: 1px solid white;
  border-radius: 20px;
  cursor: pointer;
}
.songSegment {
  height: 90px;
  margin-top: -5px;
  width: auto;
}

.title {
  height: auto;
  margin-top: -5px;
  width: auto;
}

.song-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
}

.albumArt {
  width: 50px;
  height: 50px;
  margin-left: 20px;
}

.song-info {
  margin-left: 20px;
  padding-right: 40px;
  white-space: nowrap;
  margin-top: 0px;
  flex-basis: 500px;
}

.song-info h3,
.song-info p {
  font-size: 15px;
}

.song-info p {
  margin-top: -13px;
}

.album-info {
  white-space: nowrap;
  padding-left: 20px;
  flex-basis: 400px;
}

.option-button {
  margin-left: 300px;
}
.songSuiSegment{
  background: #f0f0f0!important;
}
/* Custom styles for the form */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1em;
  background: #f9f9f9;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-container .field {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.form-container .field label {
  font-weight: bold;
  font-size: 1.1em;
  color: #333;
}

.form-container .field input {
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-container .field input:disabled {
  background: #e9ecef;
  color: #6c757d;
}
</style>
