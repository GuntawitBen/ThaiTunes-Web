<template>
  <div v-if="songMetadata" class="NowPlayingContainer">
    <img :src="songMetadata.artWorkURL" class="artwork" alt="ArtWork Image" />
    <div class="song-info">
      <h3>{{ songMetadata.songName }}</h3>
      <p>{{ songMetadata.artistName }}</p>
    </div>
    <audio ref="audioElement" controls class="controls">
      <source :src="audioSrc" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
    <div class="likeButton">
      <!-- <SuiButton circular icon="heart" inverted color="red" /> -->
    </div>
  </div>
  <div v-else class="NowPlayingContainer">
    No Song Selected
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

// Define props
const props = defineProps(['songName']);

const audioSrc = ref(null);
const songMetadata = ref(null);
const audioElement = ref(null);

const fetchSongMetadata = async (songName) => {
  try {
    const response = await axios.get(`http://localhost:3000/get/${songName}`);
    songMetadata.value = response.data;
    audioSrc.value = `http://localhost:3000/play/${songName}`;
    console.log(`Audio source set to: ${audioSrc.value}`);
    if (audioElement.value) {
      audioElement.value.load(); // Load the new source
      audioElement.value.play(); // Play the new song
    }
  } catch (error) {
    console.error('Error fetching song metadata:', error);
  }
};

// Watch the songName prop for changes
watch(() => props.songName, (newSongName) => {
  fetchSongMetadata(newSongName);
});

onMounted(() => {
  if (props.songName) {
    fetchSongMetadata(props.songName);
  }
});
</script>

<style>
.NowPlayingContainer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  background-color: #f0f0f0!important;
}

.artwork {
  width: 70px;
  height: 70px;
  margin-left: 60px;
}

.song-info {
  margin-left: 20px;
  padding-right: 40px;
  white-space: nowrap;
  margin-top: 10px;
}

.NowPlayingContainer .song-info h3,
.NowPlayingContainer .song-info p {
  font-size: 16px;
}

.NowPlayingContainer .song-info p {
  margin-top: -13px; 
}

.controls {
  flex: 1;
  display: flex;
  justify-content: center;
}

.likeButton {
  margin-right: 60px;
  padding-left: 40px;
}
</style>
