<template>
  <div class="page">
    <SuiSegment>
      <div class="title">
          <!-- Search Bar Below  -->
          <div class="ui input" style="max-width: 100%; ">
            <input type="text" placeholder="Searching for Title..." v-model="searchQuery" @input="handleSearch" />
          </div>
        </div>
      <!-- V-For to populate the page with all of the songs in the database -->
      <div v-for="song in displayedSongs" :key="song._id" class="songSegment">
        <SuiSegment>
          <div class="song-content">

            <!-- Play button for each song, emits the song name so that app.vue can recieve and play the song -->
            <SuiButton circular icon="play" inverted color="teal" class="playButton"
              @click="$emit('clickedSong', song.songName)" />
            <img :src="song.artWorkURL" alt="album art" class="albumArt" />
            <!-- Display the songs info in each card -->
            <div class="song-info">
              <h3>{{ song.songName }}</h3>
              <p>{{ song.artistName }}</p>
            </div>
            <div class="album-info">
              <p>{{ song.albumName }}</p>
            </div>
            <!-- Add to playlist button. Clicking this shows an add to playlist for to confirm your actions -->
            <div class="option-button">
              <SuiButton circular icon="add" size="mini" class="addButton"
                @click="showForm = true; selectedSong = song.songName" />
            </div>
          </div>
        </SuiSegment>
      </div>
    </SuiSegment>

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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { Dropdown } from 'vue-fomantic-ui';
import {
  SuiHeader,
  SuiSegment,
  SuiButton,
  SuiModal,
  SuiModalHeader,
  SuiModalContent,
} from 'vue-fomantic-ui';

const showForm = ref(false); //Set form visibility to false until add to playlist button is clicked
const selectedSong = ref('');
const newSong = ref({
  playListNumber: null,
});

const songs = ref([]);
const searchQuery = ref('');
const displayedSongs = ref([]);
const selected = ref();
const options = [
  { text: 'Add to a Playlist', icon: 'layer group' },
];

//Function to get all songs with the appropriate server.js backend api call
const fetchSongs = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/all');
    songs.value = response.data; //Store the result in songs
    displayedSongs.value = songs.value;
  } catch (error) {
    console.error('Error fetching songs:', error);
    alert('Failed to fetch songs.');
  }
};

let debounceTimeout;
const debounce = (func, delay) => {
  return (...args) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func(...args), delay);
  };
};

//Search bar function to filter all songs based on what's input into the search bar. 
const handleSearch = debounce(async () => {
  if (searchQuery.value) {
    try {
      //Calling the approprate backend API based on the characters in the seach bar
      const response = await axios.get('http://localhost:3000/api/search', { params: { q: searchQuery.value } });
      const results = response.data.map(song => ({
        _id: song._id,
        songName: song.songName,
        albumArt: song.albumArt,
        artistName: song.artistName,
        artWorkURL: song.artWorkURL,
      }));
      displayedSongs.value = results;
    } catch (error) {
      console.error('Error fetching search results:', error);
      alert('Failed to fetch search results.');
    }
  } else {
    displayedSongs.value = songs.value;
  }
}, 300);

//Function to add a song to the playlist
const addToPlaylist = async (userName, songName, playlistNum) => {
  try {
    //Calling the appropriate backend API with data for the song to add and appropriate playlist
    const response = await axios.post('http://localhost:3000/addToPlaylist', {
      user: userName,
      songName: songName,
      playListNumber: playlistNum,
    });
    if (response.status === 201) {
      showForm.value = false;
      newSong.value.playListNumber = null;
    }
    // Let the user know their song has been added
    alert("Added Song Successfully, click \n playlist refresh button to see changes");
  } catch (error) {
    console.error('Error adding to playlist:', error);
  }
  showForm.value = false;
};

// Function to handle form submission and update the playlist
const submitForm = () => {
  const userName = 'bob'; 
  addToPlaylist(userName, selectedSong.value, newSong.value.playListNumber);
};

onMounted(fetchSongs);

// Watch for changes to the searchbar
watch(searchQuery, handleSearch);
</script>

<style scoped>
/* Offset the page so it doesn't overlap with the side bar */
.page {
  margin-left: 300px;
  padding: 20px;
}

.songSegment {
  height: auto;
  margin-top: -5px;
  width: auto;
}

.title {
  height: 50px;
  margin-top: -5px;
  width: auto;
}

.song-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  flex-wrap: wrap;
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
  flex: 1 1 200px;
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
  flex: 1 1 200px;
}

.option-button {
  margin-left: auto; /* Pushes the button to the right */
  flex: 0 1 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Responsive adjustments to encorperate responsive design */
@media (max-width: 400px) {
  .page {
    margin-left: 20px;
    min-width: auto;
    padding-left: 70px;
    /* margin-left: 40;
    padding: 10px; */
  }

  /* .song-content {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
  } */

  .song-info,
  .song-content,
  .album-info {
    flex: 1 1 auto;
    margin-left: 0;
    /* padding-top: 10px; */
  }

  .option-button {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
    justify-content: flex-end;
  }
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
