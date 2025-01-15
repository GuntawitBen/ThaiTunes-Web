<template>
  <div class="full-height">
    <SuiSegment raised class="full-height">
      <RouterLink to="/home">
    <div class="logo">
      <SuiIcon name="music" color="teal" />
      <span class="title">ThaiTunes</span>
      <RouterLink to="/" :style="{ paddingLeft: '10px' }">Logout</RouterLink>
    </div>
  </RouterLink>

      <Menu vertical secondary class="menu">
        <div class="spacer"></div>
        <RouterLink to="/home" class="menu-item">
          <SuiIcon name="home" />
          <MenuItem class="button">Home</MenuItem>
        </RouterLink>
        <RouterLink to="/songs" class="menu-item">
          <SuiIcon name="search" />
          <MenuItem class="button">Search</MenuItem>
        </RouterLink>
        <RouterLink to="/artist" class="menu-item">
          <SuiIcon name="user" />
          <MenuItem class="button">Artists</MenuItem>
        </RouterLink>
      </Menu>
      <SuiDivider />
      <div class="playlistHeader">
        <SuiIcon name="layer group" />
        <h3 class="playlists">Playlists</h3>
        <SuiButton circular icon="refresh" size="mini" class="refreshButton" @click="fetchPlaylists" />
      </div>
      <div class="ui styled accordion">
        <div v-for="(songs, playlistNumber) in groupedPlaylists" :key="playlistNumber">
          <div class="title" @click="toggleAccordion(playlistNumber)">
            <i class="dropdown icon"></i>
            Playlist {{ playlistNumber }}
          </div>
          <div :class="['content', { active: activePlaylist === playlistNumber }]">
            <div class="content-wrapper">
              <div v-for="(song, index) in songs" :key="index">
                <p class="PLSongText">
                  <span class="songName">{{ song.songName }}</span>
                  <SuiButton
                    compact
                    circular
                    icon="play"
                    inverted
                    color="teal"
                    class="playButton"
                    @click="$emit('clickedSong', song.songName)"
                  />
                  <SuiButton
                    compact
                    circular
                    icon="trash"
                    inverted
                    color="red"
                    class="playButton"
                    @click="handleDeleteSong(song.songName, song.playListNumber)"
                  />
                </p>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuiSegment>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Menu, MenuItem, SuiIcon, SuiDivider, SuiButton, SuiSegment } from 'vue-fomantic-ui';

const playlists = ref([]);
const userId = 'bob';
const groupedPlaylists = ref({});
const activePlaylist = ref(null);

const fetchPlaylists = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/usersPlaylists/${userId}`);
    playlists.value = response.data;

    const grouped = {};
    for (const playlist of playlists.value) {
      if (!grouped[playlist.playListNumber]) {
        grouped[playlist.playListNumber] = [];
      }
      grouped[playlist.playListNumber].push(playlist);
    }
    groupedPlaylists.value = grouped;

    activePlaylist.value = null;
  } catch (error) {
    console.error('Error fetching playlists:', error);
  }
};

const toggleAccordion = (playlistNumber) => {
  activePlaylist.value = activePlaylist.value === playlistNumber ? null : playlistNumber;
};

onMounted(() => {
  fetchPlaylists();
});

const addToPlaylist = async (userName, songName, playlistNum) => {
  try {
    const response = await axios.post('http://localhost:3000/addToPlaylist', {
      user: userName,
      songName: songName,
      playListNumber: playlistNum,
    });
    if (response.status === 201) {
      await fetchPlaylists();
      newSong.value.playListNumber = null;
      showForm.value = false;
      alert("Added Song Successfully");
    }
  } catch (error) {
    console.error('Error adding to playlist:', error);
  }
};

const submitForm = () => {
  const userName = 'bob';
  addToPlaylist(userName, selectedSong.value, newSong.value.playListNumber);
};

async function handleDeleteSong(songName, playListNumber) {
  try {
    const response = await axios.delete(`http://localhost:3000/removeFromPlaylist`, {
      data: {
        songName: songName,
        playListNumber: playListNumber,
      },
    });

    if (response.status === 200) {
      alert('Song deleted successfully');
      fetchPlaylists();
    } else {
      console.error('Failed to delete song:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
</script>

<style scoped>
.refreshButton {
  width: 50px !important;
  font-size: 0.8em;
  padding-left: -100px;
  margin-left: -100px;
}

.playButton {
  max-height: 30px;
  max-width: 30px;
}

.spacer {
  height: 50px;
}

.full-height {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 300px;
  background-color: rgba(255, 255, 255, 0.068) !important;
  background: #f0f0f0 !important;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease-in-out;
}

@media (max-width: 1400px) {
  .full-height {
    width: 200px;
  }
}

@media (max-width: 400px) {
  .full-height {
    width: 100px;
  }
}

.scrollable {
  overflow-y: auto;
}

.logo {
  margin-top: 10px;
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.logo .title {
  margin-left: 10px;
  color: teal;
}

.menu {
  margin-left: 50px;
}

.menu-item {
  font-size: medium;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-left: 20px;
}

.button {
  width: 200px;
  margin-left: -50px;
}

.playlistHeader {
  font-size: medium;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-left: 20px;
}

.playlists {
  margin-top: 13px;
  padding-right: 110px;
  margin-left: 10px;
}

@media (max-width: 1400px) {
  .playlists {
    padding-right: 20px;
  }
}

.refreshButton {
  margin-left: 10px;
}

@media (max-width: 1400px) {
  .refreshButton {
    margin-left: 5px;
    width: 40px;
    font-size: 0.7em;
  }
}

@media (max-width: 600px) {
  .refreshButton {
    margin-left: 3px;
    width: 35px;
    font-size: 0.6em;
  }
}

.addButton {
  width: auto;
  height: auto;
  margin-top: -20px;
}

.playlistMenu {
  margin-top: -10px;
  width: auto;
  height: auto;
}

.playlist-icon {
  width: 40px;
  height: 40px;
}

.content-wrapper {
  max-height: 150px;
  overflow-y: auto;
  font-size: large;
}

.ui.styled.accordion {
  background-color: rgba(255, 255, 255, 0.068) !important;
}

.ui.styled.accordion .title {
  cursor: pointer;
  padding: 10px;
  font-size: 16px;
  margin: 5px 0;
  display: flex;
  align-items: center;
}

.ui.styled.accordion .content {
  padding: 10px;
  font-size: 14px;
  border-top: none;
  margin-bottom: 5px;
}

.ui.styled.accordion .content p {
  margin: 0;
}

.ui.styled.accordion .content.active {
  display: block;
}

.ui.styled.accordion .content:not(.active) {
  display: none;
}

.PLSongText {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.songName {
  flex: 1;
}

.playButton {
  margin-left: auto;
}

@media (max-width: 650px) {
  .menu-item {
    font-size: small;
    margin-bottom: 10px;
    margin-left: 10px;
  }

  .button {
    max-width: 40px;
    margin-left: -40px;
  }

  .playlistHeader, h3 {
    /* font-size: small; */
    font-size: clamp(1rem, 2vw, 3rem);
    margin-bottom: 10px;
    margin-left: 10px;
  }

  .playlists {
    margin-top: 8px;
    padding-right: 50px;
    margin-left: 5px;
  }

  .refreshButton {
    margin-left: 0px;
    max-width: 25px;
    font-size: 0.5em;
  }

  .PLSongText {
    font-size: 10px;
  }

  .playButton {
    max-height: 20px;
    max-width: 20px;
  }
}
</style>
