<template>
  <v-app>
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
      v-if="logueado"
    >
      <v-list dense>
        <template v-if="esAdministrador || esJefeAdministracion || esAsistAdministracion || esLiderProyecto || esConsultor || esDataentry">
          <v-list-item :to="{name:'home'}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esAdministrador || esJefeAdministracion || esAsistAdministracion || esLiderProyecto || esConsultor || esDataentry">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Registracion
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'regdiario'}">
              <v-list-item-action>
                <v-icon>mdi-timelapse</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Registro diario
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'regsemanal'}">
              <v-list-item-action>
                <v-icon>mdi-calendar-today</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Registro Semanal
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esJefeAdministracion">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Equipo
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'usuarios'}">
              <v-list-item-action>
                <v-icon>mdi-account-hard-hat</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Personas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'grupos'}">
              <v-list-item-action>
                <v-icon>mdi-account-multiple</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Grupos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'roles'}">
              <v-list-item-action>
                <v-icon>mdi-target-account</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Roles
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esJefeAdministracion || esAsistAdministracion">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Datos Maestros
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'empresas'}">
              <v-list-item-action>
                <v-icon>mdi-folder-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Empresas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'paises'}">
              <v-list-item-action>
                <v-icon>mdi-google-maps</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Paises
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'provincias'}">
              <v-list-item-action>
                <v-icon>mdi-google-maps</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Provincias
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'appconfigs'}">
              <v-list-item-action>
                <v-icon>mdi-tune</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Parametros
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>  
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
    color="blue darken-4
    "
    dark
    app
    :clipped-left="$vuetify.breakpoint.mdAndUp"
    fixed
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        style="width: 500px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">Tracker - Registro de Actividades y Tiempos</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn @click="salir" v-if="logueado">
        <v-icon>logout</v-icon> Salir
      </v-btn>
      <v-btn v-else :to="{name: 'login'}">
        <v-icon>apps</v-icon> Login
      </v-btn>      
    </v-app-bar>
    <v-main>
      <v-container
        fluid
      >
        <v-slide-y-transition mode="out-in">
          <v-layout>
            <router-view></router-view>
          </v-layout>
        </v-slide-y-transition>
      </v-container>
    </v-main>
    <v-footer app
      height="auto"
      dense
    >
      <v-col 
      color="primary"
      class="text-center"
      col="12">
        <v-card flat tile color="blue darken-4">
          <v-card-text class="white--text">
            <strong>&copy;2021 Akiel Consultoría en Gestión de Negocios. Todos los Derechos Reservados</strong>
          </v-card-text>
        </v-card>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
      clipped: false,
      drawer: true,
  }),
  computed: {
    logueado(){
      return this.$store.state.usuario;
    },
    esAdministrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol =='Administrador';
    },
    esJefeAdministracion(){
      return this.$store.state.usuario && this.$store.state.usuario.rol =='JefeAdministracion';
    },
    esAsistAdministracion(){
      return this.$store.state.usuario && this.$store.state.usuario.rol =='AsistAdministracion';
    },
    esLiderProyecto(){
      return this.$store.state.usuario && this.$store.state.usuario.rol =='LiderProyecto';
    },
    esConsultor(){
      return this.$store.state.usuario && this.$store.state.usuario.rol =='Consultor';
    },
    esDataentry(){
      return this.$store.state.usuario && this.$store.state.usuario.rol =='Dataentry';
    },
  },
  created(){
    this.$store.dispatch("autoLogin");
  },
  methods:{
    salir(){
      this.$store.dispatch("salir");
    }
  }
};
</script>
