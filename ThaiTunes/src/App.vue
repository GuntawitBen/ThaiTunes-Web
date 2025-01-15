<template>
    <RouterView @clickedSong="getClickedSong"/>
    <div class="ui secondary menu" v-if="!isLoginPage && !isSignupPage">
    <SideBar @clickedSong="getClickedSong"/>
    <!-- <SearchBar />  -->
    <NowPlaying :songName="songName" />
    </div>

</template>

<script setup>
import SideBar from './components/SideBar.vue';
import NowPlaying from './components/NowPlaying.vue';
import { ref, onMounted, watch } from 'vue';
 import { useRoute} from 'vue-router';
import axios from 'axios';

// FOR NOT SHOWING SIDEBAR SEARCHBAR NOWPLAYING ON LOGIN AND SIGNUP PAGE
const isLoginPage = ref(false);
const isSignupPage = ref(false);
const route = useRoute();
const checkRoute = () => {
  isLoginPage.value = route.path === '/login';
  isSignupPage.value = route.path === '/signup';
};
onMounted(checkRoute);
watch(route, checkRoute);

// // FOR PLAYING SONG ON EVERY PAGE
// const songName = ref(route.query.songName || route.params.songName);
// watch(route, (newRoute) => {
//   songName.value = newRoute.query.songName || newRoute.params.songName;
// });

// FOR PLAYING SONG ON EVERY PAGE
// const songName = ref(route.query.songName || route.params.songName);
const songName = ref('');
// watch(route, (newRoute) => {
//   songName.value = newRoute.query.songName || newRoute.params.songName;
// });

//FOR RECIEVING WHICH SONG WAS CLICKED ON ALL SONGS PAGE
// Data for receiving which song was clicked on the All Songs page
const clickedSong = ref('');

const getClickedSong = (value) => {
  songName.value = value;
};

// Watch for changes in clickedSong to update songName
watch(clickedSong, (newClickedSong) => {
  songName.value = newClickedSong;
})

</script>


<style scoped>
  /* @import url("./styles.css"); */
  
  .centered {
    text-align: center;
    margin: 0 auto;
    width: 100%;
  }
  
  .now-playing {
    vertical-align: top;
    top: 10%;
    right: 0;
    float: right;
    padding: 20px;
    width: 300px;
    max-width: 20%;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 10px;
    pointer-events: all;
    position: fixed;
  }
  
  @media (max-width: 768px) {
    .now-playing {
      width: 80%;
      left: 10%;
      right: 10%;
      top: 5%;
    }
  }
</style>
