<template>
    <v-row align="start" dense>
        <template>
            <v-snackbar
                v-model="snackbar"
                :timeout="timeout"
                absolute
                bottom
                app
                right
                :color="snackcolor"
                >
                {{ snacktext }}
                <template v-slot:action="{ attrs }">
                    <v-btn 
                        color="@FFFFFF"
                        dark
                        vertical
                        text
                        v-bind="attrs"
                        @click="snackbar = false"
                    >
                        Cerrar
                    </v-btn>
                </template>
            </v-snackbar>
        </template>
        <v-row>
            <v-col cols="12" sm="12" md="12">
                <div v-if='timerMode'>
                    <tr>
                        <td style="width:3%">
                            <div>
                                <v-icon
                                color="secondary"
                                @click="timerMode=!timerMode"
                                :disabled="timerMode"
                                >
                                mdi-progress-clock
                                </v-icon>
                            </div>
                            <div>
                                <v-icon
                                color="secondary"
                                @click="timerMode=!timerMode"
                                :disabled="!timerMode"
                                >
                                mdi-calendar-clock
                                </v-icon>
                            </div>
                        </td>
                        <td style="width:25%">
                            <v-text-field class="ma-2"
                            dense 
                            outlined 
                            type="text" 
                            v-model="actividad" 
                            counter
                            :rules="max100chars" 
                            label="Actividad">
                            </v-text-field>
                        </td>
                        <td style="width:15%">
                            <v-select class="ma-2"
                            dense
                            outlined
                            v-model="proyectoid"
                            :items = "proyectos"
                            label = "Proyecto"
                            clearable
                            @change='filtraRegistros(proyectoid)'
                            >
                            </v-select>
                        </td>
                        <td style="width:15%">
                            <v-select class="ma-2"
                            dense 
                            outlined
                            v-model="tareaid"
                            :items = "tareas"
                            label = "Tarea"
                            clearable
                            >
                            </v-select>
                        </td>
                        <td style="width:15%">
                            <v-select class="ma-2"
                            dense
                            outlined
                            v-model="etiquetas"
                            :items = "etiquetas"
                            label = "Etiquetas"
                            clearable
                            >
                            </v-select>
                        </td>
                        <td style="width:2%">
                            <div v-if='facturable' class="ma-2"> 
                                <v-icon
                                large
                                color="secondary"
                                @click="facturable=!facturable"
                                >
                                mdi-currency-usd
                                </v-icon>
                            </div>
                            <div v-else class="ma-2">
                                <v-icon
                                large
                                color="grey"
                                @click="facturable=!facturable"
                                >
                                mdi-currency-usd-off
                                </v-icon>
                            </div>
                        </td>
                        <td style="width:5%">
                            <v-chip class="ma-2" color="secondary" tex-color="white">
                            {{elapsedTime}}
                            </v-chip>
                        </td>
                        <td style="width:5%">
                            <div v-if="!timer">
                                <v-btn
                                class="ma-2"
                                depressed
                                color="primary"
                                @click="initTimer"
                                >
                                Iniciar
                                </v-btn>
                            </div>
                            <div v-else>
                                <v-btn
                                class="ma-2"
                                depressed
                                color="error"
                                @click="stopTimer"
                                >
                                Detener
                                </v-btn>
                            </div>
                        </td>
                    </tr>
                </div>
                <div v-else>
                    <tr>
                        <td style="width:3%">
                            <div>
                                <v-icon
                                color="secondary"
                                @click="timerMode=!timerMode"
                                :disabled="!timerMode"
                                >
                                mdi-calendar-clock
                                </v-icon>
                            </div>
                            <div>
                                <v-icon
                                color="secondary"
                                @click="timerMode=!timerMode"
                                :disabled="timerMode"
                                >
                                mdi-progress-clock
                                </v-icon>
                            </div>
                        </td>
                        <td style="width:25%">
                            <v-text-field class="ma-2"
                            dense 
                            outlined 
                            type="text" 
                            v-model="actividad"
                            counter
                            :rules="max100chars" 
                            label="Actividad">
                            </v-text-field>
                        </td>
                        <td style="width:15%">
                            <v-select class="ma-2"
                            dense
                            outlined
                            v-model="proyectoid"
                            :items = "proyectos"
                            label = "Proyecto"
                            clearable
                            @change='filtraRegistros(proyectoid)'
                            >
                            </v-select>
                        </td>
                        <td style="width:15%">
                            <v-select class="ma-2"
                            dense 
                            outlined
                            v-model="tareaid"
                            :items = "tareas"
                            label = "Tarea"
                            clearable
                            >
                            </v-select>
                        </td>
                        <td style="width:15%">
                            <v-select class="ma-2"
                            dense
                            outlined
                            v-model="etiquetas"
                            :items = "etiquetas"
                            label = "Etiquetas"
                            clearable
                            >
                            </v-select>
                        </td>
                        <td style="width:2%">
                            <div v-if='facturable' class="ma-2">
                                <v-icon
                                large
                                color="secondary"
                                @click="facturable=!facturable"
                                >
                                mdi-currency-usd
                                </v-icon>
                            </div>
                            <div v-else class="ma-2">
                                <v-icon
                                large
                                color="grey"
                                @click="facturable=!facturable"
                                >
                                mdi-currency-usd-off
                                </v-icon>
                            </div>
                        </td>
                        <td style="width:5%">
                            <v-text-field class="ma-2"
                            dense
                            v-model="fecha"
                            type="date"
                            label="Fecha"
                            single-line
                            outlined
                            clearable
                            ></v-text-field>
                        </td>
                        <td style="width:5%">
                            <v-text-field class="ma-2"
                            dense
                            v-model="desde"
                            type="time"
                            label="Desde"
                            single-line
                            outlined
                            clearable
                            ></v-text-field>
                        </td>
                        <td style="width:5%">
                            <v-text-field class="ma-2"
                            dense
                            v-model="hasta"
                            type="time"
                            label="Hasta"
                            single-line
                            outlined
                            clearable
                            ></v-text-field>
                        </td>
                        <td style="width:5%">
                            <v-chip class="ma-2" color="secondary" tex-color="white">
                            {{this.getTimer(new Date, new Date)}}
                            </v-chip>
                        </td>
                        <td style="width:5%">
                            <v-btn
                            class="ma-2"
                            depressed
                            color="error"
                            >
                            Agregar
                            </v-btn>
                        </td>
                    </tr>
                </div>

            </v-col>
        </v-row>
        <v-col cols="12" md="12" sm="12">
            <v-data-table
            dense
            :headers="headers"
            :items="paises"
            :search="search"
            class="elevation-1"
            no-data-text="Nada para mostrar"
            >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <div class="ma-2">
                        <v-btn small @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                    </div>
                    <v-toolbar-title>Actividades</v-toolbar-title>
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field dense label="Búsqueda" outlined v-model="search" append-icon="search" single-line hide-details clearable ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="600px">
                        <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                        </template>
                        <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-row dense>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="nombre" label="Pais" counter="50"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="cuit" label="CUIT"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12" v-show="valida">
                                        <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                        </div>
                                    </v-col> 
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                            <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="adModal" max-width="390">
                        <v-card>
                            <v-card-title class="headline" v-if="adAccion==1">¿Activar Pais?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2">Bloquear Pais?</v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion==1">Activar </span>
                                <span v-if="adAccion==2">Bloquear </span>
                                el Pais: {{ adNombre }}
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer/>
                                <v-btn small @click="activarDesactivarCerrar">Cancel
                                <v-icon>cancel</v-icon>
                                </v-btn>
                                <v-btn small v-if="adAccion==1" @click="activar">Activar
                                <v-icon>lock_open</v-icon>
                                </v-btn>
                                <v-btn small v-if="adAccion==2" @click="desactivar">Bloquear
                                <v-icon>lock</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="recordInfo" max-width="400">
                    <v-card>
                        <v-card-title class="headline">Informacion del item</v-card-title>
                        <v-card-text>
                            <p><b>Datos creacion:</b></p>
                            {{iduseralta}}<br>
                            {{fecalta}}
                            <p/>
                            <p><b>Datos ultima modificacion':</b></p>
                            {{iduserumod}}<br>
                            {{fecumod}}<br>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn small @click="recordInfo=false">Salir
                            <v-icon>cancel</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="editItem(item)"
                            >
                            mdi-pencil
                            </v-icon>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="deleteItem(item)"
                            >
                            mdi-delete
                            </v-icon>
                        </template>
                        <span>Borrar</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <template v-if="item.activo">
                                <v-icon
                                class="mr-2"
                                v-bind="attrs"
                                v-on="on"
                                @click="activarDesactivarMostrar(2,item)"
                                >
                                mdi-eye-off
                                </v-icon>
                            </template>
                            <template v-else>
                                <v-icon
                                class="mr-2"
                                v-bind="attrs"
                                v-on="on"
                                @click="activarDesactivarMostrar(1,item)"
                                >
                                mdi-eye
                                </v-icon>
                            </template>
                        </template>
                        <span>Act/Blo</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="infoItem(item)"
                            small
                            >
                            mdi-information-outline
                            </v-icon>
                        </template>
                        <span>Info</span>
                    </v-tooltip>
            </template>
            <template v-slot:[`item.activo`]="{ item }">
                <td>
                    <div v-if="item.activo">
                        <v-chip class="ma-2" color="primary" text-color="white">Activo</v-chip>
                    </div>
                    <div v-else>
                        <v-chip class="ma-2">Inactivo</v-chip>
                    </div>
                </td>
            </template>
            <template v-slot:[`item.fecalta`]="{ item }">
                <td>{{ item.fecalta.substr(0, 16) }}</td>
            </template>
            <template v-slot:[`item.fecumod`]="{ item }">
                <td>{{ item.fecumod.substr(0, 16) }}</td>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="listar">Resetear</v-btn>
            </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>
<script>
  import axios from 'axios'
  import jsPDF from 'jspdf'
  export default {
    data: () => ({
        snackbar:false,
        snackcolor:'',
        snacktext: '',
        timeout: 4000,
        recordInfo: false,
        max100chars: [
            v => (v.length <= 100) || 'Damasiado largo'
        ],
        max256chars: [
            v => (v.length <= 256) || 'Damasiado largo'
        ],
        required: [
            v => !!v || 'Este campo es requerido'
        ],
        usuarios: [],
        paises:[],
        dialog: false,
        headers: [
            { text: '[Opciones]', value: 'actions', align: 'center', sortable: false },
            { text: 'Pais', value: 'nombre', align: 'start', sortable: true },
            { text: 'CUIT', value: 'cuit', align: 'start', sortable: true },
            { text: 'Estado', value: 'activo', align: 'center', sortable: true  },
            //{ text: 'Creador Id', value: 'iduseralta', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Creación', value: 'fecalta', align: 'start', sortable: true },
            //{ text: 'Mod. Id', value: 'iduserumod', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Ult.Mod.', value: 'fecumod', align: 'start', sortable: true }                   
        ],
        search: '',
        editedIndex: -1,
        timerMode: false,
        actividad: '',
        proyectoid: '',
        tareaid: '',
        etiquetas: [],
        facturable: true,
        fecha:'',
        desde: '',
        hasta: '',
        horas: '',
        minutos: 0,
        timer: false,
        timerInit: new Date,
        timerEnd: new Date,
        elapsedTime: 0,
        proyectos:[],
        tareas:[],
        etiquetas:[],
        id:'',
        nombre:'',
        cuit:'',
        iduseralta:'',
        fecalta:'',
        iduserumod:'',
        fecumod:'',
        activo:false,
        valida: 0,
        validaMensaje:[],
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: ''             
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo país' : 'Actualizar país'
      },
    },

    watch: {
        dialog (val) {
            val || this.close()
        },
    },

    created () {
        this.listar()
        this.select()
    },

    methods: {
        getTimer: function () {
            var msec = new Date().getTime() - new Date(this.timerInit).getTime();
            var secs =   Math.floor(msec / 1000);
            var mins = Math.floor(secs / 60);
            var hrs = Math.floor(mins / 60);
            var days = Math.floor(hrs / 24);
            secs = secs % 60;
            mins = mins % 60;
            hrs = hrs % 24;
            this.elapsedTime =  ((days?(days.toString() + "D "):"") + ('0' + hrs).slice(-2) + ":" + ('0' + mins).slice(-2) + ":" + ('0' + secs).slice(-2));
        },
        initTimer() {
            let me=this;
            me.timer = true;
            me.timerId = setInterval(() => me.getTimer(),1000);
            me.timerInit = new Date();
            me.timerEnd = me.timerInit
        },
        stopTimer() {
            let me=this;
            me.timer = false;
            clearInterval(me.timerId);
            me.timerEnd = new Date();
        },
        crearPDF(){
            var columns = [
                    {title: "Id", dataKey: "id"},
                    {title: "Pais", dataKey: "nombre"},
                    {title: "CUIT", dataKey: "cuit"},
                    {title: "Estado", dataKey: "activo"},
            ];
            var rows = [];

            this.paises.map(function(x){
                    rows.push({id:x.id,nombre:x.nombre, cuit:x.cuit,activo:x.activo ? "Activo" : "Inactivo"});
            });

            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            doc.autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () => {
                    doc.text("Listado de Paises", 40, 30);
                }
            });
            doc.save('Paises.pdf');
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Paises/Listar',configuracion).then(function(response){
                //console.log(response);
                me.paises=response.data;
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor='error';
                me.snackbar = true;
                console.log(error);
            });
        },
        select(){
            let me=this;
            var usuariosArray=[];
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Usuarios/Listar',configuracion).then(function(response){
                usuariosArray=response.data;
                usuariosArray.map(function(x){
                    me.usuarios.push({iduseralta: x.iduseralta, iduserumod: x.iduserumod,text: x.iniciales, imgusuario: x.imgusuario, colfondo: x.colfondo, coltexto: x.coltexto, 
                    email: x.email, iniciales: x.iniciales, userid: x.userid, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
        },            
        editItem (item) {
            this.id=item.id;
            this.provinciaId=item.provinciaId;
            this.paisId=item.paisId;
            this.nombre=item.nombre;
            this.cuit=item.cuit;
            this.direccion=item.direccion;
            this.localidad=item.localidad;
            this.cpostal=item.cpostal;
            this.telefono=item.telefono;
            this.email=item.email;
            this.webpage=item.webpage;
            this.iduseralta=item.iduseralta;
            this.fecalta=item.fecalta;
            this.iduserumod=item.iduserumod;
            this.fecumod=item.fecumod;
            this.activo=item.activo;                
            this.editedIndex=1;
            this.dialog = true
        },
        deleteItem (item) {
            var me=this;
            var resulta = confirm('Esta seguro de querer borrar el registro?');
            if (resulta) {
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Paises/Eliminar/'+item.id,configuracion).then( () => {
                    me.snacktext = 'Eliminacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackcolor='error';
                    me.snackbar = true;
                    console.log(error);
                });
            }
        },
        infoItem(item){
            var index = this.usuarios.findIndex(x => x.iduseralta === item.iduseralta);
            this.iduseralta=this.usuarios[index].email + ' ' + this.usuarios[index].iniciales +' '+ this.usuarios[index].userid;
            this.fecalta=item.fecalta;
            this.iduserumod=this.usuarios[index].email + ' ' + this.usuarios[index].iniciales +' '+ this.usuarios[index].userid;
            this.fecumod=item.fecumod;
            this.recordInfo = true;
        },
        closeInfo(){
            this.iduseralta='';
            this.fecalta='';
            this.iduserumod='';
            this.fecumod='';
            this.recordInfo = false;
        },
        close () {
            this.dialog = false
            this.limpiar();

        },
        limpiar(){
            this.id="";
            this.nombre="";
            this.cuit="";
            this.iduseralta = "";
            this.fecalta = "";
            this.iduserumod = "";
            this.fecumod = "";
            this.activo = false;
            this.editedIndex=-1;
        },
        guardar () {
            if (this.validar()){
                return;
            }
            var date = new Date();                
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            if (this.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                let me=this;
                axios.put('api/Paises/Actualizar',{
                    'id':me.id,
                    'nombre': me.nombre,
                    'cuit':me.cuit,
                    'iduseralta': me.iduseralta,
                    'fecalta': me.fecalta,
                    'iduserumod': me.$store.state.usuario.idusuario,
                    'fecumod': new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()                             
                },configuracion).then( () => {
                    me.snacktext = 'Modificacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                    me.limpiar();                        
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackcolor = 'error';
                    me.snackbar = true;
                    console.log(error);
                });
            } else {
                //Código para guardar
                let me=this;
                axios.post('api/Paises/Crear',{
                    'nombre': me.nombre,
                    'cuit': me.cuit,
                    'iduseralta': me.$store.state.usuario.idusuario                         
                },configuracion).then( () => {
                    me.snacktext = 'Creacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                    me.limpiar();                        
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackcolor = 'error';
                    me.snackbar = true;
                    console.log(error);
                });
            }
        },
        validar(){
            this.valida=0;
            this.validaMensaje=[];

            if (this.nombre.length<3 || this.nombre.length>50){
                this.validaMensaje.push("El nombre del pais no debe tener menos de 3 caracteres y mas de 50 caracteres.");
            }
            if (this.validaMensaje.length){
                this.valida=1;
            }
            return this.valida;
        },
        activarDesactivarMostrar(accion,item){
            this.adModal=1;
            this.adNombre=item.nombre;
            this.adId=item.id;                
            if (accion==1){
                this.adAccion=1;
            }
            else if (accion==2){
                this.adAccion=2;
            }
            else{
                this.adModal=0;
            }
        },
        activarDesactivarCerrar(){
            this.adModal=0;
        },
        activar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.put('api/Paises/Activar/'+this.adId,{},configuracion).then( () => {
                me.snacktext = 'Activacion exitosa';
                me.snackcolor = "success";
                me.snackbar = true;
                me.adModal=0;
                me.adAccion=0;
                me.adNombre="";
                me.adId="";
                me.listar();                       
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
        },
        desactivar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.put('api/Paises/Desactivar/'+this.adId,{},configuracion).then( () => {
                me.snacktext = 'Desactivacion exitosa';
                me.snackcolor = "success";
                me.snackbar = true;
                me.adModal=0;
                me.adAccion=0;
                me.adNombre="";
                me.adId="";
                me.listar();                       
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
        }
    },
  }
</script>
