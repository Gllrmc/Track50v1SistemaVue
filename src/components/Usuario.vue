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
        <v-col cols="12" md="8" sm="6">
            <v-data-table
            :headers="headersusuarios"
            :items="usuarios"
            :searchu="searchu"
            class="elevation-1"
            no-data-text="Nada para mostrar"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <div class="ma-2">
                            <v-btn small @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                        </div>
                        <v-toolbar-title>Personas</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field label="Búsqueda" outlined v-model="searchu" append-icon="search" single-line hide-details></v-text-field>
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

                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="userid" label="Userid">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-select v-model="rolId"
                                            :items="roles" label="Rol">
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="iniciales" v-mask="up3" label="Iniciales" ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="telefono" label="Teléfono">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="email" label="Email">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field type="password" v-model="password" label="Password">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols=12 sm=6 md=6>
                                            <v-select v-model="coltexto" :items="textos" label="Color texto"></v-select>
                                        </v-col>
                                        <v-col cols=12 sm=6 md=6>
                                            <v-select v-model="colfondo" :items="colores" label="Color fondo"></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="3">
                                            <v-layout column>
                                                <div v-if="imageUrl">
                                                    <v-avatar  size=40>
                                                        <img :src="imageUrl" aspect-ratio="2" contain>
                                                    </v-avatar>
                                                </div>
                                                <div v-else>
                                                    <v-avatar v-if="coltexto=='black'" :color="colfondo" size=40>
                                                        <span style="color:black">{{ iniciales }}</span>
                                                    </v-avatar>
                                                    <v-avatar v-else :color="colfondo" size=40>
                                                        <span style="color:white">{{ iniciales }}</span>
                                                    </v-avatar>
                                                </div>
                                                <input v-show="false" ref="inputUpload1" type="file" @change="onFilePicked" >
                                                <div class="subheading">Avatar</div>
                                            </v-layout>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="3">
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
                                        <v-col cols="12" sm="12" md="6">
                                            <v-switch v-model="pxch" class="mx-2" label="Solicitar Password"></v-switch>
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
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Miembro?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">Bloquear Miembro?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Bloquear </span>
                                    esta Persona: {{ adNombre }}
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
                    <v-icon
                    class="mr-2"
                    @click="editItem(item)"
                    >
                    mdi-pencil
                    </v-icon>
                    <v-icon
                    class="mr-2"
                    @click="tratarGrupos(item)"
                    >
                    mdi-account-multiple
                    </v-icon>
                    <v-icon
                    @click="deleteItem(item)"
                    >
                    mdi-delete
                    </v-icon>
                    <template v-if="item.activo">
                        <v-icon
                        @click="activarDesactivarMostrar(2,item)"
                        >
                        mdi-account-off
                        </v-icon>
                    </template>
                    <template v-else>
                        <v-icon
                        @click="activarDesactivarMostrar(1,item)"
                        >
                        mdi-account-check
                        </v-icon>
                    </template>
                    <v-icon
                    class="mr-2"
                    @click="infoItem(item)"
                    small
                    >
                    mdi-information-outline
                    </v-icon>
                </template>
                <template v-slot:[`item.activo`]="{ item }">
                    <td>
                        <div v-if="item.activo">
                            <span class="blue--text">Activo</span>
                        </div>
                        <div v-else>
                            <span class="red--text">Inactivo</span>
                        </div>
                    </td>
                </template>
                <template v-slot:[`item.imgusuario`]="{ item }">
                    <td>
                        <div v-if="item.imgusuario">
                            <v-avatar size=40>
                                <img :src="item.imgusuario" aspect-ratio="2" contain>
                            </v-avatar>
                        </div>
                        <div v-else>
                            <v-avatar v-if="item.coltexto=='black'" :color="item.colfondo" size=40>
                                <span style="color:black">{{ item.iniciales }}</span>
                            </v-avatar>
                            <v-avatar v-else :color="item.colfondo" size=40>
                                <span style="color:white">{{ item.iniciales }}</span>
                            </v-avatar>
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
        <v-col cols="12" md="6" sm="3">
            <v-dialog v-model="groupdialog" max-width="750px">
                <v-data-table
                :headers="headersgrupos"
                :items="grupos"
                :search="searchg"
                class="elevation-1"
                no-data-text="Nada para mostrar"
                >
                    <template v-slot:top>
                        <v-toolbar flat color="white">
                            <v-toolbar-title>{{groupheader}}</v-toolbar-title>
                            <v-divider
                                class="mx-4"
                                inset
                                vertical
                            ></v-divider>
                            <v-spacer></v-spacer>
                            <v-text-field label="Búsqueda" outlined v-model="searchg" append-icon="search" single-line hide-details></v-text-field>
                        </v-toolbar>
                    </template>
                    <template v-slot:[`item.selected`]="{ item }">
                        <v-simple-checkbox
                            v-model="item.selected"
                            :ripple="false"
                            @click="accionUsuario(item)"
                        ></v-simple-checkbox>
                    </template>
                    <template v-slot:no-data>
                        <v-btn color="primary" @click="listar">Resetear</v-btn>
                    </template>
                </v-data-table>
            </v-dialog>
        </v-col>        
    </v-row>
</template>
<script>
  import axios from 'axios'
  import jsPDF from 'jspdf'
  export default {
    data: () => ({
        up3:'AAA',
        colores: [
            {value: '#F44336', text: 'Rojo'},
            {value: '#E91E63', text: 'Rosa'},
            {value: '#9C27B0', text: 'Violeta'},
            {value: '#673AB7', text: 'Violeta oscuro'},                    
            {value: '#3F51B5', text: 'Indigo'},
            {value: '#2196F3', text: 'Azul'},
            {value: '#03A9F4', text: 'Celeste'},
            {value: '#00BCD4', text: 'Cianico'},
            {value: '#009688', text: 'Turquesa'},
            {value: '#4CAF50', text: 'Verde'},
            {value: '#8BC34A', text: 'Verde claro'},                    
            {value: '#CDDC39', text: 'Lima'},
            {value: '#FFEB3B', text: 'Amarillo'},
            {value: '#FFC107', text: 'Ambar'},
            {value: '#FF9800', text: 'Naranja'},
            {value: '#FF5722', text: 'Naranja oscuro'},
            {value: '#795548', text: 'Marron'},
            {value: '#607D8B', text: 'Lívido'},
            {value: '#9E9E9E', text: 'Gris'},
            {value: '#000000', text: 'Negro'},
            {value: '#FFFFFF', text: 'Blanco'}
        ],
        textos: [
            {value: 'white', text: 'Blanco'},
            {value: 'black', text: 'Negro'},
        ],
        snackbar: false,
        snackcolor: '',
        snacktext: '',
        timeout: 4000,
        recordInfo:0,
        usuarios: [],
        roles:[],
        grupos:[],
        grupousuarios:[],
        workuserId:'',
        imageUrl:'',
        groupheader: '',
        dialog: false,
        groupdialog: false,
        headersusuarios: [
            { text: '[Opciones]', value: 'actions', align: 'center', sortable: false },
            { text: 'Avatar', value: 'imgusuario', align: 'center', sortable: false },
            { text: 'Userid', value: 'userid', align: 'start', sortable: true },
            { text: 'email', value: 'email', align: 'start', sortable: true },
            { text: 'Rol', value: 'rol', align: 'start', sortable: true },
            { text: 'Iniciales', value: 'iniciales', align: 'start', sortable: true },                    
            { text: 'Teléfono', value: 'telefono', align: 'start', sortable: true },
            { text: 'Estado', value: 'activo', align: 'center', sortable: true  },
            //{ text: 'Creador Id', value: 'iduseralta', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Creación', value: 'fecalta', align: 'start', sortable: true },
            //{ text: 'Mod. Id', value: 'iduserumod', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Ult.Mod.', value: 'fecumod', align: 'start', sortable: true }                   
        ],
        headersgrupos: [
            { text: '#', value: 'selected', align: 'center', sortable: false },
            { text: 'Nombre grupo', value: 'nombre', align: 'start', sortable: true },
            //{ text: 'Estado', value: 'activo', align: 'start', sortable: true  },
            //{ text: 'Creador Id', value: 'iduseralta', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Creación', value: 'fecalta', align: 'start', sortable: true },
            //{ text: 'Mod. Id', value: 'iduserumod', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Ult.Mod.', value: 'fecumod', align: 'start', sortable: true }                   
        ],
        searchg:'',
        searchu:'',
        editedIndex: -1,
        id: '',
        rolId:'',
        iniciales:'',
        userid:'',
        telefono: '',
        email: '',
        password:'',
        colfondo:'#000000',
        coltexto:'black',
        imgusuario:'',
        pxch:false,
        iduseralta:'',
        fecalta:'',
        iduserumod:'',
        fecumod:'',
        activo:false,           
        actPassword:false,
        passwordAnt:'',
        valida: 0,
        validaMensaje:[],
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: ''             
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo miembro' : 'Actualizar miembro'
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
                    this.imgusuario = this.imageUrl;
                })
            } else {
                this.imageName = ''
                this.imageFile = ''
                this.imageUrl = ''
            }
        },
        clearImagen(){
            this.imageUrl = ''
            this.imgusuario = ''
        },
        crearPDF(){
            var columns = [
                    {title: "Iniciales", dataKey: "iniciales"},
                    {title: "Nombre", dataKey: "userid"},
                    {title: "Rol", dataKey: "rol"},
                    {title: "Telefono", dataKey: "telefono"},
                    {title: "Activo", dataKey: "activo"}
            ];
            var rows = [];

            this.usuarios.map(function(x){
                    rows.push({iniciales:x.iniciales,userid:x.userid,rol:x.rol,telefono:x.telefono,activo:x.activo});
            });

            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            doc.autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () => {
                    doc.text("Listado de Personas", 40, 30);
                }
            });
            doc.save('Personas.pdf');
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Usuarios/Listar',configuracion).then(function(response){
                //console.log(response);
                me.usuarios=response.data;
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
        select(){
            let me=this;
            var rolesArray=[];
            var gruposArray=[];
            var grupousuariosArray=[];
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Roles/Select',configuracion).then(function(response){
                rolesArray=response.data;
                rolesArray.map(function(x){
                    me.roles.push({text: x.nombre,value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Grupos/Listar',configuracion).then(function(response){
                gruposArray=response.data;
                gruposArray.map(function(x){
                    me.grupos.push({selected: false, nombre: x.nombre, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Grupousuarios/Listar',configuracion).then(function(response){
                grupousuariosArray=response.data;
                grupousuariosArray.map(function(x){
                    me.grupousuarios.push({grupoid: x.grupoid, usuarioid: x.usuarioid, value:x.id});
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
            this.rolId=item.rolId;
            this.iniciales=item.iniciales;
            this.userid=item.userid;
            this.telefono=item.telefono;
            this.email=item.email;
            this.password=item.password_hash;
            this.passwordAnt=item.password_hash;
            this.colfondo=item.colfondo;
            this.coltexto=item.coltexto;
            this.imgusuario=item.imgusuario;
            this.imageUrl=item.imgusuario;
            this.pxch=item.pxch;
            this.iduseralta=item.iduseralta;
            this.fecalta=item.fecalta;
            this.iduserumod=item.iduserumod;
            this.fecumod=item.fecumod;
            this.activo=item.activo;
            this.editedIndex = 1;
            this.groupdialog = false;
            this.dialog = true
        },
        deleteItem (item) {
            var me=this;
            var resulta = confirm('Esta seguro de querer borrar el registro?');
            if (resulta) {
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Usuarios/Eliminar/'+item.id,configuracion).then( () => {
                    me.snacktext = 'Eliminacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackcolor = "error";
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
        tratarGrupos(item){
            var me=this;
            for (var l = 0; l < me.grupos.length; l++){
                me.grupos[l].selected = false;
            };
            for (let i = 0; i < me.grupousuarios.length; i++){
                if (me.grupousuarios[i].usuarioid === item.id){
                    me.grupos[me.grupos.findIndex(elemento => elemento.value === me.grupousuarios[i].grupoid )].selected = true;
                }
            };
            me.workuserId = item.id;
            me.groupheader = 'Asignaciones de ' + item.iniciales + ' ' + item.email;
            me.groupdialog=!me.groupdialog;
        },
        accionUsuario(item){
            var me=this;
            if (item.selected === true ) {
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Grupousuarios/Crear',{
                    'grupoid': item.value,
                    'usuarioid': this.workuserId,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.grupousuarios.push({grupoid: response.data.grupoid, usuarioid: response.data.usuarioid, value: response.data.id});
                    //console.log(response);
                    me.snacktext = 'Creacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    me.snackcolor = 'error'
                    console.log(error);
                });
            } else {
                var indice = me.grupousuarios.find(x => item.value === x.grupoid && me.workuserId === x.usuarioid).value;
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Grupousuarios/Eliminar/'+indice,configuracion).then( () => {
                    me.grupousuarios = me.grupousuarios.filter(x => x.value != indice); 
                    me.snacktext = 'Eliminacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            }
        },
        limpiar(){
                this.id="";
                this.rolId="";
                this.iniciales=null;
                this.userid="";
                this.telefono="";
                this.email="";
                this.password="";
                this.passwordAnt="";
                this.colfondo="#000000";
                this.coltexto="white";
                this.imgusario="";
                this.imageUrl="";
                this.pxch=false;
                this.iduseralta = "";
                this.fecalta = "";
                this.iduserumod = "";
                this.fecumod = "";
                this.activo = false;          
                this.actPassword = false;
                this.groupdialog = false;
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
                if (me.password!=me.passwordAnt){
                    me.actPassword=true;
                }
                axios.put('api/Usuarios/Actualizar',{
                    'Id':me.id,
                    'rolId':me.rolId,
                    'iniciales':me.iniciales,
                    'userid':me.userid,
                    'telefono': me.telefono,
                    'email':me.email,
                    'password':me.password,
                    'act_password':me.actPassword,
                    'colfondo':me.colfondo,
                    'coltexto':me.coltexto,
                    'imgusuario':me.imgusuario,
                    'pxch':me.pxch,
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
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            } else {
                //Código para guardar
                let me=this;
                axios.post('api/Usuarios/Crear',{
                    'rolId':me.rolId,
                    'iniciales':me.iniciales,
                    'userid':me.userid,
                    'telefono': me.telefono,
                    'email':me.email,
                    'password':me.password,
                    'colfondo':me.colfondo,
                    'coltexto':me.coltexto,
                    'imgusuario':me.imgusuario,
                    'pxch':me.pxch,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    //console.log(response);
                    me.snacktext = 'Creacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                    me.limpiar();
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackcolor = "error";
                    me.snackbar = true;
                    console.log(error);
                });
            }
        },
        validar(){
            this.valida=0;
            this.validaMensaje=[];

            if (this.userid.length<3 || this.userid.length>100){
                this.validaMensaje.push("El nombre debe tener más de 3 caracteres y menos de 100 caracteres.");
            }
            if (!this.rolId){
                this.validaMensaje.push("Seleccione un rol.");
            }
            if (!this.email){
                this.validaMensaje.push("Ingrese el email del usuario.");
            }
            if (!this.password){
                this.validaMensaje.push("Ingrese el password del usuario.");
            }
            if (this.iniciales.length<1 || this.iniciales.length>3){
                this.validaMensaje.push("Las iniciales deben tener al menos 1 caracter y no mas de 3 caracteres.");
            }
            if (!this.coltexto){
                this.validaMensaje.push("Seleccione un color de texto.");
            }
            if (!this.colfondo){
                this.validaMensaje.push("Seleccione un color de fondo.");
            }
            if (this.validaMensaje.length){
                this.valida=1;
            }
            return this.valida;
        },
        activarDesactivarMostrar(accion,item){
            this.adModal=1;
            this.adNombre=item.userid;
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
            axios.put('api/Usuarios/Activar/'+this.adId,{},configuracion).then( () => {
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
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
        desactivar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};

            axios.put('api/Usuarios/Desactivar/'+this.adId,{},configuracion).then( () => {
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
                me.snackcolor = "error";
                me.snackbar = true;
                console.log(error);
            });
        },
    },
  }
</script>
