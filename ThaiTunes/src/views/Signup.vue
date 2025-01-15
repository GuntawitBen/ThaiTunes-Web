<template>
  <div class="ui middle aligned center aligned grid login-container">
    <div class="column" style="max-width: 450px;">
      <h2 class="ui teal image header" style="font-family: 'Montserrat', sans-serif;">
        <div class="content">
          Create Your Account
        </div>
      </h2>
      <form class="ui large form" @submit.prevent="signUp">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" name="email" placeholder="E-mail address" v-model="email">
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" name="password" placeholder="Password" v-model="password">
            </div>
          </div>
          <button type="submit" class="ui fluid large teal submit button">Sign up</button>
        </div>

     
      </form>
    </div>
  </div>
</template>


<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    signUp() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          console.log('Successfully signed up');
          console.log(auth.currentUser);
          this.$router.replace('/home');
        })
        .catch((error) => {
          this.errorMessage = error.message;
          console.error('Error signing up:', error);
        });
    }
  }
}
</script>

<style>
.login-container {
  background: rgb(240,240,240);
background: radial-gradient(circle, rgba(240,240,240,1) 0%, rgba(148,187,233,1) 100%);
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}</style>