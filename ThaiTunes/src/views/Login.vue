<template>
  <div class="ui middle aligned center aligned grid login-container">
    <div class="column" style="max-width: 450px;">
      <h2 class="ui teal image header" style="font-family: 'Montserrat', sans-serif;">
        <h1>Welcome to ThaiTunes</h1>
        <div class="content">
          Log-in to your account
        </div>
      </h2>
      <form class="ui large form" @submit.prevent="SignIn">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" name="email" placeholder="E-mail address" v-model="formData.email">
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" name="password" placeholder="Password" v-model="formData.password">
            </div>
          </div>
          <button type="submit" class="ui fluid large teal submit button">Login</button>
        </div>

        
      </form>

      <div class="ui message">
        New to us? <router-link to="/signup">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>


<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  name: 'SignIn',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    SignIn() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.formData.email, this.formData.password)
        .then(() => {
          console.log(auth.currentUser);
          this.$router.replace('/home');
        })
        .catch((error) => {
          alert(error.code + '\n' + error.message);
        });
    }
  }
};

  
</script>

<style scoped>
/* Scoped styles for your Vue component */
.login-container {
  background: rgb(240,240,240);
background: radial-gradient(circle, rgba(240,240,240,1) 0%, rgba(148,187,233,1) 100%);
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ui.grid {
  margin: 0 !important;
}

.ui.segment {
  margin-top: 1rem !important;
}
</style>
