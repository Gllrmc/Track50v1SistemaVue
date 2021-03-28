<template>
    <v-row align="start">
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
                        color="#FFFFFF"
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
        <v-col cols="12" md="9" sm="9">
            <v-data-table
            dense
            :headers="headers"
            :items="empresas"
            :search="search"
            class="elevation-1"
            no-data-text="Nada para mostrar"
            >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <div class="ma-2">
                        <v-btn small @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                    </div>
                    <v-toolbar-title>Empresas</v-toolbar-title>
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
                                        <v-text-field v-model="nombre" label="Empresa" counter="50">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-switch dense v-model="aceptacargalapsos"
                                        flat
                                        label="Permite cargar lapsos?"
                                        ></v-switch>                                    
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-switch dense v-model="aceptacargatiempos"
                                        flat
                                        label="Permite carga tiempos?"
                                        ></v-switch>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-switch dense v-model="facturabledefault"
                                        flat
                                        label="Es Facturable por omision?"
                                        ></v-switch>                                    
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-switch dense v-model="reservadodefault"
                                        flat
                                        label="Es Privado por omision?"
                                        ></v-switch>                                    
                                    </v-col>
                                    <v-col cols="12" sm="3" md="6">
                                        <v-text-field v-model="tarifadefault" type="number" label="Tarifa por omision">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="3" md="6">
                                        <v-select v-model="monedadefault" :items="monedas" attach label="Moneda">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="2" md="2">
                                        <v-layout column>
                                            <div class="ml-2" style="font-size : 12px">Logo</div>
                                            <v-avatar  size=40>
                                                <v-img :src="imageUrl" aspect-ratio="2" contain></v-img>
                                            </v-avatar>
                                            <input v-show="false" ref="inputUpload1" type="file" @change="onFilePicked" >
                                        </v-layout>
                                    </v-col>
                                    <v-col cols="12" sm="4" md="4">
                                        <v-btn class="mx-2" small fab color="primary" @click="$refs.inputUpload1.click()">
                                            <v-icon dark>
                                                mdi-plus
                                            </v-icon>    
                                        </v-btn>
                                        <v-btn class="mx-2" small fab color="primary" @click="clearImagen">
                                            <v-icon dark>
                                                mdi-delete
                                            </v-icon>    
                                        </v-btn>
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
                            <v-card-title class="headline" v-if="adAccion==1">¿Activar Empresa?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2">Bloquear Empresa?</v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion==1">Activar </span>
                                <span v-if="adAccion==2">Bloquear </span>
                                la Empresa: {{ adNombre }}
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
            <template v-slot:[`item.nombre`]="{ item }">
                <v-chip class="ma-2">{{item.nombre}}</v-chip>
            </template>
            <template v-slot:[`item.logo`]="{ item }">
                <td>
                    <div v-if="item.logo">
                        <v-avatar size=50>
                            <v-img :src="item.logo" aspect-ratio="2" contain></v-img>
                        </v-avatar>
                    </div>
                    <div v-else>
                        <v-avatar  size=40>
                            <span style="color:black">n/d</span>
                        </v-avatar>
                    </div>
                </td>
            </template>
            <template v-slot:[`item.aceptacargalapsos`]="{ item }">
                <td>
                    <div v-if="item.aceptacargalapsos">
                        <v-chip class="ma-2" color="primary" text-color="white">Si</v-chip>
                    </div>
                    <div v-else>
                        <v-chip class="ma-2">No</v-chip>
                    </div>
                </td>
            </template>
            <template v-slot:[`item.aceptacargatiempos`]="{ item }">
                <td>
                    <div v-if="item.aceptacargatiempos">
                        <v-chip class="ma-2" color="primary" text-color="white">Si</v-chip>
                    </div>
                    <div v-else>
                        <v-chip class="ma-2">No</v-chip>
                    </div>
                </td>
            </template>
            <template v-slot:[`item.facturabledefault`]="{ item }">
                <td>
                    <div v-if="item.facturabledefault">
                        <v-chip class="ma-2" color="primary" text-color="white">Si</v-chip>
                    </div>
                    <div v-else>
                        <v-chip class="ma-2">No</v-chip>
                    </div>
                </td>
            </template>
            <template v-slot:[`item.reservadodefault`]="{ item }">
                <td>
                    <div v-if="item.reservadodefault">
                        <v-chip class="ma-2" color="primary" text-color="white">Si</v-chip>
                    </div>
                    <div v-else>
                        <v-chip class="ma-2">No</v-chip>
                    </div>
                </td>
            </template>
            <template v-slot:[`item.tarifadefault`]="{ item }">
                        <v-chip class="ma-2">{{formatPrice(item.tarifadefault)}}</v-chip>
            </template>
            <template v-slot:[`item.monedadefault`]="{ item }">
                        <v-chip class="ma-2">{{item.monedadefault}}</v-chip>
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
  import autoTable from 'jspdf-autotable';
  export default {
    data: () => ({
        snackbar: false,
        snackcolor: '',
        snacktext: '',
        timeout: 4000,
        recordInfo:0,
        usuarios: [],
        empresas:[],
        paises: [],
        monedas: ["ARS","USD","EUR","GBP"],
        imageUrl: '',
        dialog: false,
        headers: [
            { text: '[Opciones]', value: 'actions', align: 'center', sortable: false },
            { text: 'Logo', value: 'logo', align: 'start', sortable: true  },
            { text: 'Razon Social', value: 'nombre', align: 'start', sortable: true },
            { text: 'Carga lapsos?', value: 'aceptacargalapsos', align: 'start', sortable: true },
            { text: 'Carga tiempos?', value: 'aceptacargatiempos', align: 'start', sortable: true },
            { text: 'Facturable?', value: 'facturabledefault', align: 'start', sortable: true },
            { text: 'Privados?', value: 'reservadodefault', align: 'start', sortable: true },
            { text: 'Tarifa base', value: 'tarifadefault', align: 'start', sortable: true  },
            { text: 'Moneda', value: 'monedadefault', align: 'start', sortable: true  },
            { text: 'Estado', value: 'activo', align: 'start', sortable: true  },
            //{ text: 'Creador Id', value: 'iduseralta', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Creación', value: 'fecalta', align: 'start', sortable: true },
            //{ text: 'Mod. Id', value: 'iduserumod', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Ult.Mod.', value: 'fecumod', align: 'start', sortable: true }                   
        ],
        search: '',
        searchpa: '',
        searchpr: '',
        editedIndex: -1,
        id: '',
        nombre: '',
        aceptacargalapsos: false,
        aceptacargatiempos: false,
        facturabledefault: false,
        reservadodefault: false,
        tarifadefault: 0,
        monedadefault: '',
        logo: '',
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
        return this.editedIndex === -1 ? 'Nueva empresa' : 'Actualizar empresa'
      },
    },

    watch: {
        dialog (val) {
            val || this.close()
        },
    },

    created () {
        this.select();
        this.listar()
    },

    methods: {
        pickFile () {
            this.$refs.image.click ()
        },
        onFilePicked (e) {
            const files = e.target.files
            if (files[0] !== undefined) {
                this.imageName = files[0].name
                if (this.imageName.lastIndexOf('.') <= 0) {
                return
                }
                const fr = new FileReader ()
                fr.readAsDataURL(files[0])
                fr.addEventListener('load', () => {
                    this.imageUrl = fr.result
                    this.imageFile = files[0] // this is an image file that can be sent to server...
                    this.logo = this.imageUrl;
                })
            } else {
                this.imageName = ''
                this.imageFile = ''
                this.imageUrl = ''
            }
        },
        clearImagen(){
            this.imageUrl = ''
            this.logo = ''
        },
        crearPDF(){
            var columns = [
                    {title: "Razon Social", dataKey: "nombre"},
                    {title: "Carga lapsos", dataKey: "aceptacargalapsos"},
                    {title: "Carga diaria", dataKey: "aceptacargatiempos"}, 
                    {title: "Facturable?", dataKey: "facturabledefault"}, 
                    {title: "Privados?", dataKey: "reservadodefault"},
                    {title: "Tarifa base", dataKey: "tarifadefault"}, 
                    {title: "Moneda", dataKey: "monedadefault"}, 
                    {title: "Activo", dataKey: "activo"}
            ];
            var rows = [];

            this.empresas.map(function(x){
                    rows.push({nombre:x.nombre,cuit:x.cuit,direccion:x.direccion,localidad:x.localidad,cpostal:x.cpostal,provincia:x.provincia,pais:x.pais,
                    telefono:x.telefono,email:x.email,webpage:x.webpage,activo:x.activo});
            });

            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () =>  {
                    doc.text("Listado de Empresas", 40, 30);
                }
            });
            doc.save('Empresas.pdf');
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Empresas/Listar',configuracion).then(function(response){
                //console.log(response);
                me.empresas=response.data;
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error';
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
            this.id = item.id;
            this.nombre = item.nombre;
            this.aceptacargalapsos = item.aceptacargalapsos;
            this.aceptacargatiempos = item.aceptacargatiempos;
            this.facturabledefault = item.facturabledefault;
            this.reservadodefault = item.reservadodefault;
            this.tarifadefault = item.tarifadefault;
            this.monedadefault = item.monedadefault;
            this.logo = item.logo;
            this.imageUrl = item.logo;
            this.iduseralta = item.iduseralta;
            this.fecalta = item.fecalta;
            this.iduserumod = item.iduserumod;
            this.fecumod = item.fecumod;
            this.activo = item.activo;                
            this.editedIndex = 1;
            this.dialog = true
        },
        deleteItem (item) {
            var me=this;
            var resulta = confirm('Esta seguro de querer borrar el registro?');
            if (resulta) {
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Empresas/Eliminar/'+item.id,configuracion).then( () => {
                    me.snacktext = 'Eliminacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackcolor = 'error';
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
            this.id = "";
            this.nombre = "";
            this.aceptacargalapsos = false;
            this.aceptacargatiempos = false;
            this.facturabledefault = false;
            this.reservadodefault = false;
            this.tarifadefault = 0;
            this.monedadefault = "";
            this.logo = "";
            this.imageUrl = "";
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
                axios.put('api/Empresas/Actualizar',{
                    'Id':me.id,
                    'nombre': me.nombre,
                    'logo':me.logo,
                    'aceptacargalapsos':me.aceptacargalapsos,
                    'aceptacargatiempos': me.aceptacargatiempos,
                    'facturabledefault': me.facturabledefault,
                    'reservadodefault': me.reservadodefault,
                    'tarifadefault': me.tarifadefault,
                    'monedadefault': me.monedadefault,
                    'iduserumod': me.$store.state.usuario.idusuario,
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
                axios.post('api/Empresas/Crear',{
                    'nombre': me.nombre,
                    'logo':me.logo,
                    'aceptacargalapsos':me.aceptacargalapsos,
                    'aceptacargatiempos': me.aceptacargatiempos,
                    'facturabledefault': me.facturabledefault,
                    'reservadodefault': me.reservadodefault,
                    'tarifadefault': me.tarifadefault,
                    'monedadefault': me.monedadefault,
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
                this.validaMensaje.push("La empresa debe tener más de 3 caracteres y menos de 50 caracteres.");
            }
            if (!this.monedadefault){
                this.validaMensaje.push("Ingrese una moneda.");
            }
            if (!this.tarifadefault){
                this.validaMensaje.push("Ingrese una tarifa.");
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
            axios.put('api/Empresas/Activar/'+this.adId,{},configuracion).then( () => {
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
                me.snackcolor = 'error';
                me.snackbar = true;
                console.log(error);
            });
        },
        desactivar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.put('api/Empresas/Desactivar/'+this.adId,{},configuracion).then( () => {
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
                me.snackcolor = 'error';
                me.snackbar = true;
                console.log(error);
            });
        }
    },
  }
</script>
