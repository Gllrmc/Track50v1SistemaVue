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
        <v-col cols="12" md="5" sm="5">
            <v-data-table
            dense
            :headers="headersconceptos"
            :items="conceptos"
            :search="searchg"
            class="elevation-1"
            no-data-text="Nada para mostrar"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <div class="ma-2">
                            <v-btn small @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                        </div>
                        <v-toolbar-title>Conceptos Gasto</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field dense label="Búsqueda" outlined v-model="searchg" append-icon="search" single-line hide-details clearable ></v-text-field>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="350px">
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
                                            <v-text-field v-model="nombre" label="Nombre Concepto" counter="50">
                                            </v-text-field>
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
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Concepto?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">Bloquear Concepto?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Bloquear </span>
                                    este Concepto: {{ adNombre }}
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
                            v-bind="attrs"
                            v-on="on"
                            class="mr-2"
                            @click="editItem(item)"
                            >
                            mdi-pencil
                            </v-icon>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>
                    <!-- <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="tratarProyectos(item)"
                            >
                            mdi-sprout
                            </v-icon>
                        </template>
                        <span>Proyectos</span>
                    </v-tooltip> -->
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
        <v-col cols="12" md="6" sm="3">
            <v-dialog persistent v-model="projectdialog" max-width="900px">
                <v-data-table
                dense
                :headers="headersproyectos"
                :items="proyectosecs"
                :search="searchp"
                class="elevation-1"
                no-data-text="Nada para mostrar"
                >
                    <template v-slot:top>
                        <v-card  flat color="white">
                            <v-card-title>{{userheader}}</v-card-title>
                            <v-card-actions>
                                <v-row>
                                    <v-col cols="12" md="6" sm="6">
                                        <v-text-field label="Búsqueda" 
                                        outlined 
                                        dense 
                                        v-model="searchp" 
                                        append-icon="searcp" 
                                        single-line 
                                        hide-details
                                        clearable 
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="5" sm="5">
                                        <v-select 
                                            label="Agregar Gasto Proyecto"
                                            outlined 
                                            dense 
                                            hide-details
                                            v-model="addproy"
                                            :items="proyectos"
                                            clearable
                                            append-icon="mdi-plus-circle"
                                            @click:append="agregarProyecto(addproy, item)"
                                            ></v-select>
                                    </v-col>
                                </v-row>
                                <v-btn color="primary" dense dark class="ma-2" @click.native="projectdialog=false">Salir</v-btn>
                            </v-card-actions>      
                        </v-card>
                    </template>
                    <template v-slot:[`item.selected`]="{ item }">
                        <v-simple-checkbox
                            v-model="item.selected"
                            :ripple="false"
                            @click="accionProyecto(item)"
                        ></v-simple-checkbox>
                    </template>
                    <template v-slot:[`item.impreferencia`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.impreferencia"
                            large
                            cancel-text="Salir"
                            save-text="Grabar"
                            @save="editProyecto(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.impreferencia }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.impreferencia"
                                type="number"
                                label="Editar"
                                single-line
                                counter
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.sec`]="{ item }">
                        <div v-if="item.selected" class="d-flex align-end flex-column">
                            <td>{{ item.sec}}</td>
                        </div>
                    </template>
                    <template v-slot:[`item.referencia`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.referencia"
                            large
                            cancel-text="Salir"
                            save-text="Grabar"
                            @save="editProyecto(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.referencia }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.referencia"
                                type="text"
                                label="Editar"
                                single-line
                                counter
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
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
        snackbar:false,
        snackcolor:'',
        snacktext: '',
        timeout: 2000,
        recordInfo:0,
        conceptos:[],
        usuarios:[],
        proyectos:[],
        proyectosecs:[],
        conceptoproyectos:[],
        worktagId:'',
        imageUrl:'',
        tagheader: '',
        dialog: false,
        projectdialog: false,
        searchg:'',
        searchp:'',
        editedIndex: -1,
        id: '',
        nombre:'',
        iniciales:'',
        userid:'',
        telefono: '',
        email: '',
        colfondo:'#000000',
        coltexto:'black',
        imgusuario:'',
        iduseralta:'',
        fecalta:'',
        iduserumod:'',
        fecumod:'',
        activo:false,
        addproy: '',
        valida: 0,
        validaMensaje:[],
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: ''             
    }),

    computed: {
        headersconceptos(){
            return [
                { text: '[Opciones]', value: 'actions', align: 'center', sortable: false },
                { text: 'Nombre concepto', value: 'nombre', align: 'start', sortable: true },
                { text: 'Estado', value: 'activo', align: 'start', sortable: true  },
            ]
        },
        headersproyectos(){
            return [
                { text: '#', value: 'selected', align: 'center', sortable: true },
                { text: 'Proyecto', value: 'nombre', align: 'start', sortable: true },
                { text: 'Sec.', value: 'sec', align: 'start', sortable: false },
                { text: 'Referencia', value: 'referencia', align: 'start', sortable: true },
                { text: 'Importe referencia', value: 'impreferencia', align: 'center', sortable: true },
            ]
        },
        formTitle () {
            return this.editedIndex === -1 ? 'Nueva concepto' : 'Actualizar concepto'
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
        save () {
        },
        cancel () {
        },
        formatPrice(value,dec) {
            let val = (value/1).toFixed(dec).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        crearPDF(){
            var columns = [
                    {title: "Nombre concepto", dataKey: "nombre"},
                    {title: "Activo", dataKey: "activo"}
            ];
            var rows = [];

            this.conceptos.map(function(x){
                    rows.push({nombre:x.nombre,activo:x.activo});
            });

            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            doc.autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () => {
                    doc.text("Listado de Conceptos Gral", 40, 30);
                }
            });
            doc.save('Conceptogral.pdf');
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Conceptos/Listar',configuracion).then(function(response){
                //console.log(response);
                me.conceptos=response.data;
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackbar = true;
                me.snackcolor = 'error'
                console.log(error);
            });
        },
        select(){
            let me=this;
            var usuariosArray=[];
            var proyectosArray=[];
            var conceptoproyectosArray=[];
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Usuarios/Listar',configuracion).then(function(response){
                usuariosArray=response.data;
                usuariosArray.map(function(x){
                    me.usuarios.push({selected: false,iduseralta: x.iduseralta, iduserumod: x.iduserumod,
                    imgusuario: x.imgusuario, colfondo: x.colfondo, coltexto: x.coltexto, 
                    email: x.email, iniciales: x.iniciales, userid: x.userid, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Proyectos/Listar',configuracion).then(function(response){
                proyectosArray=response.data;
                proyectosArray.map(function(x){
                    me.proyectos.push({value: x.id, text: x.nombre, nombre: x.nombre});
                })
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Conceptoproyectos/Listar',configuracion).then(function(response){
                conceptoproyectosArray=response.data;
                conceptoproyectosArray.map(function(x){
                    me.conceptoproyectos.push({conceptoid: x.conceptoid, proyectoid: x.proyectoid, sec: x.sec,
                    referencia: x.referencia, impreferencia: x.impreferencia,
                    value: x.id});
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
            this.nombre=item.nombre;
            this.iduseralta=item.iduseralta;
            this.fecalta=item.fecalta;
            this.iduserumod=item.iduserumod;
            this.fecumod=item.fecumod;
            this.activo=item.activo;
            this.editedIndex=1;
            this.projectdialog = false;
            this.dialog = true
        },
        deleteItem (item) {
            var me=this;
            var resulta = confirm('Esta seguro de querer borrar el registro?');
            if (resulta) {
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Conceptos/Eliminar/'+item.id,configuracion).then( () => {
                    me.snacktext = 'Eliminacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    me.snackcolor = 'error'
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
        agregarProyecto(proyid){
            let me=this;
            if(proyid){
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Conceptoproyectos/Crear',{
                    'conceptoid':this.conceptId,
                    'proyectoid':proyid,
                    'referencia':'',
                    'impreferencia':0,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.conceptoproyectos.push({conceptoid: response.data.conceptoid, proyectoid: response.data.proyectoid, sec: response.data.sec, impreferencia: 0, referencia: 0, value: response.data.id});
                    me.proyectosecs[index].relid = response.data.id;
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
            }
        },
        tratarProyectos(item){
            var me=this;
            var index = 0;
            var aux = [];
            me.proyectosecs=[];
            for (var l = 0; l < me.proyectos.length; l++){
                me.proyectosecs.push({selected: true, proyectoid: me.proyectos[l].value, sec: 0, 
                nombre: me.proyectos[l].nombre, relid: 0, referencia: '', impreferencia: 0});
                aux = me.conceptoproyectos.filter(x => x.proyectoid === me.proyectos[l].value);
                for (var i = 0; i < aux.length; i++){
                    me.proyectosecs.push({selected: true, proyectoid: me.proyectos[l].value, sec: aux[i].sec, 
                    nombre: me.proyectos[l].nombre, relid: aux[i].value, referencia: aux[i].referencia, impreferencia: aux[i].impreferencia});
                };
            }
            me.conceptId = item.id;
            me.userheader = 'Proyectos vinculados a ' + item.nombre;
            me.projectdialog=!me.projectdialog;
        },
        accionProyecto(item){
            var me=this;
            let index = 0;
            index = me.proyectosecs.findIndex(elemento => elemento.value === item.value );
            if (item.selected === true ) {
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Conceptoproyectos/Crear',{
                    'conceptoid':this.conceptId,
                    'proyectoid':item.value,
                    'referencia':item.referencia,
                    'impreferencia':item.impreferencia,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.conceptoproyectos.push({conceptoid: response.data.conceptoid, proyectoid: response.data.proyectoid, sec: response.data.sec, impreferencia: 0, referencia: 0, value: response.data.id});
                    me.proyectosecs[index].relid = response.data.id;
                    me.proyectosecs[index].selected = true;
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
                var indice = me.conceptoproyectos.find(x => item.value === x.proyectoid && me.conceptId === x.conceptoid).value;
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Conceptoproyectos/Eliminar/'+indice,configuracion).then( () => {
                    me.conceptoproyectos = me.conceptoproyectos.filter(x => x.value != indice);
                    me.proyectosecs[index].relid = 0;
                    me.proyectosecs[index].sec = 0;
                    me.proyectosecs[index].referencia = '';
                    me.proyectosecs[index].impreferencia = 0;
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
        editProyecto(item){
            var me=this;
            let index=0;
            index = me.conceptoproyectos.findIndex(elemento => elemento.value === item.relid );
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.put('api/Conceptoproyectos/Actualizar',{
                'Id':item.relid,
                'conceptoid':this.conceptId,
                'proyectoid':item.value,
                'sec':item.sec,
                'referencia':item.referencia,
                'impreferencia':item.impreferencia,
                'iduseralta': me.$store.state.usuario.idusuario                      
            },configuracion).then( () => {
                me.conceptoproyectos[index].referencia = item.referencia;
                me.conceptoproyectos[index].impreferencia  = item.impreferencia;
                me.snacktext = 'Modificacion exitosa';
                me.snackcolor = "success";
                me.snackbar = true;
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackbar = true;
                me.snackcolor = 'error'
                console.log(error);
            });
        },
        limpiar(){
                this.id="";
                this.nombre="";
                this.iduseralta = "";
                this.fecalta = "";
                this.iduserumod = "";
                this.fecumod = "";
                this.activo = false;
                this.projectdialog = false;
                this.editedIndex=-1;
        },
        guardar () {
            if (this.validar()){
                return;
            }
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            if (this.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                let me=this;
                axios.put('api/Conceptos/Actualizar',{
                    'Id':me.id,
                    'nombre':me.nombre,
                    'iduserumod': me.$store.state.usuario.idusuario
                },configuracion).then( () => {
                    me.snacktext = 'Modificacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.close();
                    me.listar();
                    me.limpiar();                        
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    me.snackcolor = 'error'
                    console.log(error);
                });
            } else {
                //Código para guardar
                let me=this;
                axios.post('api/Conceptos/Crear',{
                    'nombre':me.nombre,
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
                    me.snackbar = true;
                    me.snackcolor = 'error'
                    console.log(error);
                });
            }
        },
        validar(){
            this.valida=0;
            this.validaMensaje=[];

            if (this.nombre.length<3 || this.nombre.length>50){
                this.validaMensaje.push("El nombre debe tener más de 3 caracteres y menos de 50 caracteres.");
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
            axios.put('api/Conceptos/Activar/'+this.adId,{},configuracion).then( () => {
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
            axios.put('api/Conceptos/Desactivar/'+this.adId,{},configuracion).then( () => {
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
        },
    },
  }
</script>
