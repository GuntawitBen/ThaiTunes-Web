<template>
  <body>
    <div class="page">
      <div class="header">
        <SuiHeader as="h3" floated="left">
          <h1>Hello!</h1>
          <h2>What do you want to listen to today?</h2>
        </SuiHeader>
      </div>

      <div class="Discover">
        <h2>Discover</h2>
        <div v-for="song in songs" :key="song._id" class="songSegment">
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

      <div class="MoodDiv">
        <h2>Featured Artists</h2>
      </div>
      <div class="mood-container">
        <div class="card" v-for="(artist, index) in uniqueArtists" :key="index">
          <div class="card-content">
            <router-link :to="`/artist/${artist.artistName}`" class="custom-link">
              <div>
                <img :src="artist.artWorkURL" alt="album art" class="artistArt" />
              </div>
              <h1 class="card-header">{{ artist.artistName }}</h1>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Modal Form for adding a song to a playlist -->
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
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import {
  SuiHeader,
  SuiSegment,
  SuiButton,
  SuiModal,
  SuiModalHeader,
  SuiModalContent,
} from 'vue-fomantic-ui';
import { useRoute } from "vue-router";

const uniqueArtists = ref([]);
const route = useRoute();
const songs = ref([]);
const showForm = ref(false);
const selectedSong = ref('');
const newSong = ref({
  playListNumber: null,
});

// Method to fetch songs
const fetchSongs = async () => {
  try {
    const response = await axios.get('http://localhost:3000/random/all');
    songs.value = response.data;
  } catch (error) {
    console.error('Error fetching songs:', error);
  }
};

// Method to add to playlist
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
    alert("Added Song Successfully, click \n playlist refresh button to see changes");
  } catch (error) {
    console.error('Error adding to playlist:', error);
  }
  showForm.value = false;
};

// Function called when form submit button is pressed
const submitForm = () => {
  const userName = 'bob'; // Hardcoded as per the form field
  addToPlaylist(userName, selectedSong.value, newSong.value.playListNumber);
};

// Function to fetch artists
const fetchArtists = async () => {
  try {
    const response = await axios.get("http://localhost:3000/random/artists");
    const artists = response.data;

    const uniqueArtistsMap = new Map();

    artists.forEach((artist) => {
      if (!uniqueArtistsMap.has(artist.artistName)) {
        uniqueArtistsMap.set(artist.artistName, artist);
      }
    });

    uniqueArtists.value = Array.from(uniqueArtistsMap.values());
  } catch (error) {
    console.error("Error fetching artists:", error);
  }
};

onMounted(() => {
  fetchArtists();
});

onMounted(() => {
  fetchSongs();
});
</script>

<style scoped>
@import url("../css/homepage.css");

.page {
  margin-left: 300px;
  min-width: 700px;
}

/* For screens smaller than 1400px */
@media (max-width: 1400px) {
  .page {
    margin-left: 200px;
  }
}

/* For screens smaller than 600px */
@media (max-width: 400px) {
  .page {
    margin-left: 100px;
  }
}

.header {
  margin-left: 50px;
  margin-top: 50px;
  height: 100px;
}

.header h2 {
  margin-top: -10px;
  display: block;
}

.MoodDiv h2 {
  margin-left: 50px;
  margin-top: 20px;
}

.Discover {
  margin-left: 50px;
  margin-top: 20px;
  height: auto;
}

.logout {
  margin-top: -70px;
}

.songSegment {
  height: 90px;
  margin-top: -5px;
  width: auto;
  margin-right: 50px;
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
  flex-basis: 400px;
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
  margin-left: auto;
}

.label {
  font-size: 24px;
  margin-bottom: 20px;
}

.mood-container {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  margin-left: -5px;
}

.card {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  text-align: center;
}

.card-header {
  font-size: 18px;
}

.songSuiSegment {
  background-color: rgba(255, 255, 255, 0.068) !important;
}

body {
  background: rgb(148, 187, 233);
  background: radial-gradient(circle, rgba(148, 187, 233, 1) 0%, rgba(240, 240, 240, 1) 50%);
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

.artistArt {
  width: 150px;
  height: auto;
}

.custom-link {
  text-decoration: none;
  color: inherit;
}

/* For screens smaller than 1400px */
@media (max-width: 1400px) {
  .page {
    margin-left: 200px;
  }

  .album-info {
    display: none;
  }

  .song-content {
    justify-content: space-between;
  }

  .songSegment {
    width: auto;
  }

  .artistArt {
    width: 100px;
  }

  .logout-header {
    display: inline-block;
  }
}

/* For screens smaller than 900px */
@media (max-width: 900px) {
  .full-height {
    width: 200px;
  }

  .songSegment {
    width: 400px;
  }

  .header h2 {
    font-size: 17px;
  }
}

/* For screens smaller than 450px */
@media (max-width: 450px) {
  .page {
    margin-left: 20px;
    min-width: auto;
    padding-left: 70px;
  }

  .header h1 {
    font-size: 20px;
  }

  .header h2 {
    font-size: 15px;
  }

  .songSegment {
    height: auto;
    margin-right: 0;
  }

  .song-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .albumArt {
    width: 40px;
    height: 40px;
    margin-left: 0;
  }

  .song-info {
    margin-left: 10px;
    padding-right: 10px;
    white-space: normal;
    flex-basis: auto;
  }

  .song-info h3,
  .song-info p {
    font-size: 12px;
  }

  .song-info p {
    margin-top: -8px;
  }

  .album-info {
    display: none;
  }

  .option-button {
    margin-left: 0;
    margin-top: 10px;
  }

  .artistArt {
    width: 80px;
  }

  .card {
    width: 80px;
    height: 80px;
  }

  .card-header {
    font-size: 14px;
  }
}
</style>
