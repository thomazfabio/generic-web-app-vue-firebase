<template>
  <v-row no-gutters justify="center">
    <v-col sm="4">
      <h2 class="primary--text text--accent-4">Registro de novo usuário</h2>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="firstname"
              :rules="nameRules"
              label="Nome"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <v-text-field
              v-model="lastname"
              :rules="nameRules"
              label="Sobrenome"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              :rules="emailRules"
              label="Senha"
              required
              @click:append="show = !show"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <router-link style="text-decoration: none" to="register">
              <v-btn
                large
                block
                elevation="4"
                depressed
                style="color: white"
                color="blue-grey darken-3"
                @click="register()"
                >Cadastrar</v-btn
              ></router-link
            >
          </v-col>
        </v-row>
        <p class="d-flex justify-center" style="margin: 0">ou</p>
        <v-row>
          <v-col>
            <router-link style="text-decoration: none" to="login">
              <v-btn
                large
                style="color: white"
                block
                elevation="4"
                depressed
                color="red lighten-1"
                >Cancelar</v-btn
              ></router-link
            >
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    show: false,
    valid: false,
    firstname: "",
    lastname: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 10 || "Name must be less than 10 characters",
    ],
    password: "",
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
  }),
  methods: {
    async register() {
      const { firstname, lastname, password, email } = this;
      this.$firebase
        .auth()
        .createUserWithEmailAndPassword(email, password, firstname, lastname)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          var userId = userCredential.user.uid;
          console.log(userId);
          // Guardar dados de perfil
          this.$firebase
            .database()
            .ref("users/" + userId)
            .set({
              id: userId,
              firstname: firstname,
              email: email,
            })
            .then(() => {
              this.$store.dispatch("logarUser", user);
              this.$router.replace({ name: "home" });
            });
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
          // ..
        });
    },
  },
};
</script>