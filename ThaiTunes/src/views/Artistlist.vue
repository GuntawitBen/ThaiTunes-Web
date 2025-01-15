<template>
  <div class="frame">
    <!-- <label :style="{fontSize:'16pt'}">Artists</label> -->
    <div class="card_container">
    <div class="card" v-for="(song, index) in songs" :key="index">
      <!-- link from the image to the artist name -->
      <router-link :to="`/artist/${song.artistName}`">
        <div
          class="image-container"
          :style="{ backgroundImage: 'url(' + song.artWorkURL + ')' }"
        ></div>
        <h1 :style="{ fontSize: '12pt', color: 'black'}">{{ song.artistName }}</h1>
      </router-link>
      <div class="play-button" @click="$emit('clickedSong', song.songName)">
        <img src="../components/icon/play.svg" alt="Play" />
      </div>
    </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const songs = ref([]);

const fetchArtists = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/artists");
    const artists = response.data;

    // Create a map to store unique artists by name
    const uniqueArtistsMap = new Map();

    artists.forEach((artist) => {
      // Use artistName as the key to ensure uniqueness
      if (!uniqueArtistsMap.has(artist.artistName)) {
        uniqueArtistsMap.set(artist.artistName, artist);
      }
    });

    // Convert map values back to array (if you need to preserve array format)
    const uniqueArtists = Array.from(uniqueArtistsMap.values());

    // Optionally, update the songs.value with unique artists
    songs.value = uniqueArtists;
  } catch (error) {
    console.error("Error fetching artists:", error);
    // Optionally handle error feedback to the user
  }
};

onMounted(() => {
  fetchArtists();
});
</script>

<style scoped>
@import url("../css/artistlist.css");

.image-container {
  position: relative;
  width: 100%;
  /* height: 500px; */
  aspect-ratio: 1/1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  margin-bottom: 15px;
}

.frame {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  width: 100%;
  max-width: 300px; /* Adjust based on your design */
  border: 1px;
  background: rgba(240, 240, 240, 0.3);
  overflow: hidden;
}

.img-cover {
  width: 100%;
  height: 0;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background-color: #ddd; /* Placeholder color */
}

.play-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  height: 45px;
  width: 45px;
}
</style>
