import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Rol from '../components/Rol.vue'
import Usuario from '../components/Usuario.vue'
import Grupo from '../components/Grupo.vue'
import Proyecto from '../components/Proyecto.vue'
import Cliente from '../components/Cliente.vue'
import Tarea from '../components/Tarea.vue'
import Concepto from '../components/Concepto.vue'
import Etiqueta from '../components/Etiqueta.vue'
import Appconfig from '../components/Appconfig.vue'
import Empresa from '../components/Empresa.vue'
import Pais from '../components/Pais.vue'
import Provincia from '../components/Provincia.vue'
import Timesheet from '../components/Timesheet.vue'
import Actividad from '../components/Actividad.vue'
import Gasto from '../components/Gasto.vue'
import store from '../store'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta:{
      libre: true
    }
  },
  {
    path: '/proyectos',
    name: 'proyectos',
    component: Proyecto,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/actividades',
    name: 'actividades',
    component: Actividad,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/timesheets',
    name: 'timesheets',
    component: Timesheet,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/gastos',
    name: 'gastos',
    component: Gasto,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: Cliente,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/tareas',
    name: 'tareas',
    component: Tarea,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/concceptos',
    name: 'conceptos',
    component: Concepto,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/etiquetas',
    name: 'etiquetas',
    component: Etiqueta,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/paises',
    name: 'paises',
    component: Pais,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/provincias',
    name: 'provincias',
    component: Provincia,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },   
  {
    path: '/empresas',
    name: 'empresas',
    component: Empresa,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/roles',
    name: 'roles',
    component: Rol,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: Usuario,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/grupos',
    name: 'grupos',
    component: Grupo,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },
  {
    path: '/appconfigs',
    name: 'appconfigs',
    component: Appconfig,
    meta: {
      administrador: true,
      jefeadministracion: true,
      liderproyecto:true, 
      consultor: true,
      asistadministracion: true,
      dataentry: true
    }
  },   
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)) {
      next();
  } else if (store.state.usuario && store.state.usuario.rol == 'Administrador') {
      if (to.matched.some(record => record.meta.administrador)) {
          next();
      }
  } else if (store.state.usuario && store.state.usuario.rol == 'JefeAdministracion') {
      if (to.matched.some(record => record.meta.jefeadministracion)) {
          next();
      }
  } else if (store.state.usuario && store.state.usuario.rol == 'AsistAdministracion') {
      if (to.matched.some(record => record.meta.asistadministracion)) {
          next();
      }
  } else if (store.state.usuario && store.state.usuario.rol == 'LiderProyecto') {
      if (to.matched.some(record => record.meta.liderproyecto)) {
          next();
      }
    } else if (store.state.usuario && store.state.usuario.rol == 'Consultor') {
      if (to.matched.some(record => record.meta.consultor)) {
          next();
      }
  } else if (store.state.usuario && store.state.usuario.rol == 'Dataentry') {
      if (to.matched.some(record => record.meta.dataentry)) {
          next();
      }
  } else {
      next({
        name: 'login'
    });
  }
});

export default router
