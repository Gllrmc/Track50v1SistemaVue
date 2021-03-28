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
        <v-col cols="12" md="12" sm="12">
            <v-data-table
            dense
            :headers="headers"
            :items="proyectos"
            :search="search"
            class="elevation-1"
            no-data-text="Nada para mostrar"
            >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <div class="ma-2">
                        <v-btn small @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                    </div>
                    <v-toolbar-title>Proyectos</v-toolbar-title>
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
                                    <v-col v-if="pideempresa" cols="12" sm="12" md="12">
                                        <v-select dense v-model="empresaid"
                                        :items = "empresas" label = "Empresa">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field dense v-model="nombre" label="Proyecto" counter="50">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-select dense v-model="clienteid"
                                        :items = "clientes" label = "Cliente">
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field dense v-model="tarifadefault" type="number" label="Tarifa x omision">
                                        </v-text-field>
                                    </v-col>
                                    <template>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-menu
                                                ref="menu"
                                                v-model="menu"
                                                :close-on-content-click="false"
                                                :return-value.sync="fecregdesde"
                                                transition="scale-transition"
                                                offset-y
                                                min-width="auto"
                                            >
                                                <template v-slot:activator="{ on, attrs }">
                                                <v-text-field dense
                                                    v-model="fecregdesde"
                                                    chips
                                                    small-chips
                                                    label="Fecha inicio"
                                                    prepend-icon="mdi-calendar"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                ></v-text-field>
                                                </template>
                                                <v-date-picker
                                                v-model="fecregdesde"
                                                no-title
                                                scrollable
                                                >
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                text
                                                color="primary"
                                                @click="menu = false"
                                                >
                                                Cancel
                                                </v-btn>
                                                <v-btn
                                                text
                                                color="primary"
                                                @click="$refs.menu.save(fecregdesde)"
                                                >
                                                OK
                                                </v-btn>          
                                                </v-date-picker>
                                            </v-menu>
                                        </v-col>
                                    </template>
                                    <v-col cols=12 sm=6 md=6>
                                        <v-select dense v-model="coltexto" :items="textos" label="Color texto"></v-select>
                                    </v-col>
                                    <v-col cols=12 sm=6 md=6>
                                        <v-select dense v-model="colfondo" :items="colores" label="Color fondo"></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-switch dense v-model="facturable"
                                        flat
                                        label="Facturable?"
                                        ></v-switch>                                    
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-switch dense v-model="reservado"
                                        flat
                                        label="Privado?"
                                        ></v-switch>                                    
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-textarea dense
                                        v-model="notas"
                                        counter="256"
                                        label="Notas"
                                        ></v-textarea>
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
                            <v-card-title class="headline" v-if="adAccion==1">¿Activar Cliente?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2">Bloquear Cliente?</v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion==1">Activar </span>
                                <span v-if="adAccion==2">Bloquear </span>
                                el Cliente: {{ adNombre }}
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
            <template v-slot:[`item.empresa`]="{ item }">
                <v-chip class="ma-2">{{item.empresa}}</v-chip>
            </template>
            <template v-slot:[`item.nombre`]="{ item }">
                <div class="ma-2">{{item.nombre}}</div>
            </template>
            <template v-slot:[`item.cliente`]="{ item }">
                <v-chip class="ma-2">{{item.cliente}}</v-chip>
            </template>
            <template v-slot:[`item.facturable`]="{ item }">
                <td>
                    <div v-if="item.facturable">
                        <v-chip class="ma-2" color="primary" text-color="white">Si</v-chip>
                    </div>
                    <div v-else>
                        <v-chip class="ma-2">No</v-chip>
                    </div>
                </td>
            </template>
            <template v-slot:[`item.tarifadefault`]="{ item }">
                        <div class="ma-2">{{formatPrice(item.tarifadefault)}}</div>
            </template>
            <template v-slot:[`item.reservado`]="{ item }">
                <td>
                    <div v-if="item.reservado">
                        <v-chip class="ma-2" color="primary" text-color="white">Si</v-chip>
                    </div>
                    <div v-else>
                        <v-chip class="ma-2">No</v-chip>
                    </div>
                </td>
            </template>
            <template v-slot:[`item.fecregdesde`]="{ item }">
                        <div class="ma-2">{{item.fecregdesde.substr(0,10)}}</div>
            </template>
            <template v-slot:[`item.fecultfact`]="{ item }">
                        <v-chip class="ma-2">{{item.fecultfac ? item.fecultfac.substr(0,10) : "" }}</v-chip>
            </template>
            <template v-slot:[`item.fecultliqui`]="{ item }">
                        <v-chip class="ma-2">{{item.fecultliqui ? item.fecultliqui.substr(0,10) : "" }}</v-chip>
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
        lineaspags: [
            {value: 5, text: "5"},
            {value: 10, text: "10"},
            {value: 15, text: "15"},
            {value: -1, text: "All"},
        ],
        menu: '',
        snackbar: false,
        snackcolor: '',
        snacktext: '',
        timeout: 4000,
        recordInfo:0,
        usuarios: [],
        empresas: [],
        clientes:[],
        proyectos:[],
        dialog: false,
        headers: [
            { text: '[Opciones]', value: 'actions', align: 'center', sortable: false },
            { text: 'Proyecto', value: 'nombre', align: 'start', sortable: true },
            { text: 'Cliente', value: 'cliente', align: 'start', sortable: true },
            { text: 'Facturable?', value: 'facturable', align: 'start', sortable: true },
            { text: 'Tarifa default', value: 'tarifadefault', align: 'start', sortable: true },
            { text: 'Reservado?', value: 'reservado', align: 'start', sortable: true },
            { text: 'Cargas desde', value: 'fecregdesde', align: 'start', sortable: true },
            { text: 'Ult.Facturacion', value: 'fecultfact', align: 'start', sortable: true },
            { text: 'Ult.Liquidacion', value: 'fecultliqui', align: 'start', sortable: true },
            { text: 'Estado', value: 'activo', align: 'start', sortable: true  }
//            { text: 'Empresa', value: 'empresa', align: 'start', sortable: true },
        ],
        search: '',
        searchpa: '',
        searchpr: '',
        editedIndex: -1,
        id: '',
        nombre: '',
        empresaid: '',
        empresa: '',
        clienteid: '',
        cliente: '',
        facturable: true,
        tarifadefault: 0,
        notas: '',
        reservado: false,
        colfondo: '',
        coltexto: '',
        fecregdesde: '',
        estimadohoras: 0,
        estimadomonto: 0,
        iduseralta:'',
        fecalta:'',
        iduserumod:'',
        fecumod:'',
        activo:false,
        pideempresa: false,
        valida: 0,
        validaMensaje:[],
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: ''             
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo proyecto' : 'Actualizar proyecto'
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
        crearPDF(){
            var columns = [
                    {title: "Razon Social", dataKey: "nombre"},
                    {title: "Activo", dataKey: "activo"}
            ];
            var rows = [];

            this.proyectos.map(function(x){
                    rows.push({nombre:x.nombre,activo:x.activo});
            });

            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            doc.autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () =>  {
                    doc.text("Listado de Proyectos", 40, 30);
                }
            });
            doc.save('Proyectos.pdf');
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Proyectos/Listar',configuracion).then(function(response){
                //console.log(response);
                me.proyectos=response.data;
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
            var empresasArray=[];
            var clientesArray=[];
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
            axios.get('api/Empresas/Listar',configuracion).then(function(response){
                empresasArray=response.data;
                empresasArray.map(function(x){
                    me.empresas.push({iduseralta: x.iduseralta, iduserumod: x.iduserumod,monedadefault: x.monedadefault, tarifadefault: x.tarifadefault, reservadodefaultcolfondo: x.reservadodefault, facturabledefault: x.facturabledefault, 
                    aceptacargatiempos: x.aceptacargatiempos, aceptacargalapsos: x.aceptacargalapsos, text: x.nombre, value:x.id});
                    if (me.empresas.length > 1){
                        me.headers.push({"text": 'Empresa', "value": 'empresa', "align": 'start', "sortable": true});
                        me.pideempresa=true;
                    }
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Clientes/Listar',configuracion).then(function(response){
                clientesArray=response.data;
                clientesArray.map(function(x){
                    me.clientes.push({ tarifadefault: x.tarifadefault, text: x.nombre, value:x.id});
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
            this.empresaid = item.empresaid;
            this.empresa = item.empresa;
            this.clienteid = item.clienteid;
            this.cliente = item.cliente;
            this.facturable = item.facturable;
            this.tarifadefault = item.tarifadefault;
            this.notas = item.notas;
            this.reservado = item.reservado;
            this.coltexto = item.coltexto;
            this.colfondo = item.colfondo;
            this.fecregdesde = item.fecregdesde;
            this.estimadohoras = item.estimadohoras;
            this.estimadomonto = item.estimadomonto;
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
                axios.delete('api/Proyectos/Eliminar/'+item.id,configuracion).then( () => {
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
            this.empresaid = "";
            this.empresa = "";
            this.clienteid = "";
            this.cliente = "";
            this.facturable = true;
            this.tarifadefault = 0;
            this.notas = "";
            this.reservado = false;
            this.coltexto = "";
            this.colfondo = "";
            this.fecregdesde = "";
            this.estimadohoras = 0;
            this.estimadomonto = 0;
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
            let me=this;
            var date = new Date();                
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            if (this.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                axios.put('api/Proyectos/Actualizar',{
                    'Id':me.id,
                    'nombre': me.nombre,
                    'empresaid': me.empresaid,
                    'clienteid': me.clienteid,
                    'facturable': me.facturable,
                    'tarifadefault': me.tarifadefault,
                    'notas': me.notas,
                    'reservado': me.reservado,
                    'coltexto' : me.coltexto,
                    'colfondo' : me.colfondo,
                    'fecregdesde': me.fecregdesde,
                    'estimadohoras': me.estimadohoras,
                    'estimadomonto': me.estimadomonto,
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
                    me.snackcolor = 'error';
                    me.snackbar = true;
                    console.log(error);
                });
            } else {
                //Código para guardar
                debugger;
                axios.post('api/Proyectos/Crear',{
                    'nombre': me.nombre,
                    'empresaid': me.pideempresa ? me.empresaid : empresas[0].value,
                    'clienteid': me.clienteid,
                    'facturable': me.facturable,
                    'tarifadefault': me.tarifadefault,
                    'notas': me.notas,
                    'reservado': me.reservado,
                    'coltexto' : me.coltexto,
                    'colfondo' : me.colfondo,
                    'fecregdesde': me.fecregdesde,
                    'estimadohoras': me.estimadohoras,
                    'estimadomonto': me.estimadomonto,
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
                this.validaMensaje.push("El proyecto debe tener más de 3 caracteres y menos de 50 caracteres.");
            }
            if (this.notas.length > 256){
                this.validaMensaje.push("La nota excede los 256 caracteres.");
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
            axios.put('api/Proyectos/Activar/'+this.adId,{},configuracion).then( () => {
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
            axios.put('api/Proyectos/Desactivar/'+this.adId,{},configuracion).then( () => {
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
