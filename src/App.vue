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
            <v-list-item :to="{ name: 'actividades'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-timelapse</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Diaria
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'timesheets'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-calendar-today</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Semanal
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'gastos'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-receipt</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Gasto
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esJefeAdministracion || esAsistAdministracion || esLiderProyecto || esConsultor || esDataentry">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Analisis
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'dashboard'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-view-dashboard</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Dashboard
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'pivotal'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-cube</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Pivot Tables
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esJefeAdministracion || esAsistAdministracion || esLiderProyecto || esConsultor || esDataentry">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Administracion
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'proyectos'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-sprout</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Proyectos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'clientes'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-account-cash</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Clientes
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'tareas'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-file-tree</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Tareas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'conceptos'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-food-fork-drink</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Conceptos Gasto
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'etiquetas'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-tag</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Etiquetas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'empresas'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-folder-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Unidad de Negocio
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
                <v-icon color="primary">mdi-account-hard-hat</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Personas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'grupos'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-account-multiple</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Grupos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'roles'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-target-account</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Roles
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'appconfigs'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-tune</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Parametros
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-if="esAdministrador || esJefeAdministracion || esAsistAdministracion">
          <!-- <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Configuracion
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item> -->
            <!-- <v-list-item :to="{ name: 'paises'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-google-maps</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Paises
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'provincias'}">
              <v-list-item-action>
                <v-icon color="primary">mdi-google-maps</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Provincias
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item> -->
          <!-- </v-list-group>   -->
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
      <div class="mr-10" v-if="logueado">
        <div v-if="this.$store.state.userinfo.imgusuario">
            <v-avatar size=50>
                <v-img :src="this.$store.state.userinfo.imgusuario" aspect-ratio="2" contain></v-img>
            </v-avatar>
        </div>
        <div v-else>
            <v-avatar v-if="this.$store.state.userinfo.coltexto=='black'" :color="this.$store.state.userinfo.colfondo" size=50>
                <span style="color:black">{{ this.$store.state.userinfo.iniciales }}</span>
            </v-avatar>
            <v-avatar v-else :color="this.$store.state.userinfo.colfondo" size=50>
                <span style="color:white">{{ this.$store.state.userinfo.iniciales }}</span>
            </v-avatar>
        </div>
      </div>
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
import axios from 'axios'
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
    this.buscarUserinfo();
  },
  methods:{
    salir(){
      this.$store.dispatch("salir");
    },
    buscarUserinfo(){
        let me=this;
        let header={"Authorization" : "Bearer " + me.$store.state.token};
        let configuracion= {headers : header};
        axios.get('api/Usuarios/Traer/'+me.$store.state.usuario.idusuario,configuracion)
        .then(respuesta => {
            return respuesta.data
        })
        .then(data => {
            this.$store.dispatch("guardarUserinfo", data)
        })
        .catch(function(error){
            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
            me.snackcolor = 'error'
            me.snackbar = true;
            console.log(error);
        });
    }
  }
};
</script>
