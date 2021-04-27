<template> 
    <v-row align="start" style="overflow: auto">
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
            :headers="headersgastos"
            :items="gastos"
            :search="searchg"
            class="elevation-1"
            no-data-text="Nada para mostrar"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <div class="ma-2">
                            <v-btn small @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                        </div>
                        <v-toolbar-title>Gastos</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field dense label="Búsqueda" outlined v-model="searchg" append-icon="search" single-line hide-details clearable ></v-text-field>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="850px">
                            <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                </v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                    <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
                                </v-card-actions>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-row dense>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select 
                                                dense
                                                :rules="required"
                                                v-model="proyectoid"
                                                :items = "proyectos"
                                                label = "Proyecto"
                                                clearable
                                                @change='filtraRegistros(proyectoid)'
                                                >
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select 
                                                dense
                                                :disabled='!proyectoid'
                                                v-model="registroid"
                                                :items = "registros"
                                                label = "Registro"
                                                @change='getActividadTarea(registroid)'
                                                >
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="4">
                                                <v-select 
                                                dense 
                                                v-model="tareaid"
                                                :items = "tareas"
                                                label = "Tarea"
                                                disabled
                                                >
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="4">
                                                <v-text-field dense type="text" v-model="actividad" disabled label="Actividad">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="4">
                                                <v-select 
                                                dense
                                                :rules="required"
                                                clearable
                                                v-model="conceptoid"
                                                :items = "conceptos"
                                                label = "Concepto"
                                                >
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="4">
                                                <v-text-field dense type="date" v-model="fecgasto" :rules="required" label="Fecha">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="4">
                                                <v-text-field dense type="text" v-model="referencia" :rules="required" label="Referencia">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="4">
                                                <v-text-field dense type="number" v-model="impneto" label="Importe Neto"
                                                @change="impiva=(impneto*tasaiva/(1+tasaiva)).toFixed(2)"
                                                >
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="3" md="3">
                                                <v-text-field dense type="number" v-model="impiva" label="IVA">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="3" md="3">
                                                <v-text-field dense type="number" v-model="impivaper" label="IVA Percepcion">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="3" md="3">
                                                <v-text-field dense type="number" v-model="impiibb" label="IIBB">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="3" md="3">
                                                <v-text-field dense type="number" v-model="impotros" label="Otros">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-textarea dense :rules="max256chars" counter auto-grow clearable filled v-model="notas" label="Notas">
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <form enctype="multipart/form-data">
                                                    <div class="field">
                                                        <label for="file" class="label"></label>
                                                        <input 
                                                        style="display:none" 
                                                        type="file"
                                                        accept="application/pdf"
                                                        @change="onFileSelected($event.target.files)"
                                                        ref="fileInput"/>
                                                    </div>
                                                    <v-btn @click="$refs.fileInput.click()">Buscar</v-btn>
                                                    <v-btn @click="onSaveAs(pdfid)">Desc. Gasto</v-btn> 
                                                </form>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <div>
                                                    <canvas id="the-canvas" width="780" height="100" style="border:1px solid black"></canvas>
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
                                <v-card-title class="headline" v-if="adAccion==1">¿Activar Gasto?</v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">Bloquear Gasto?</v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">Activar </span>
                                    <span v-if="adAccion==2">Bloquear </span>
                                    esta Gasto: {{ adNombre }}
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
                <template v-slot:[`item.proyecto`]="{ item }">
                    <v-chip class="ma-2" :text-color="item.coltexto" :color="item.colfondo">{{item.proyecto}}</v-chip>
                </template>
                <template v-slot:[`item.fecgasto`]="{ item }">
                    <td>{{ item.fecgasto.substr(0, 10) }}</td>
                </template>
                <template v-slot:[`item.impneto`]="{ item }">
                    <v-chip>{{ formatPrice(item.impneto,2) }}</v-chip>
                </template>
                <template v-slot:[`item.impiva`]="{ item }">
                    <td>{{ formatPrice(item.impiva,2) }}</td>
                </template>
                <template v-slot:[`item.impivaper`]="{ item }">
                    <td>{{ formatPrice(item.impivaper,2) }}</td>
                </template>
                <template v-slot:[`item.impiibb`]="{ item }">
                    <td>{{ formatPrice(item.impiibb,2) }}</td>
                </template>
                <template v-slot:[`item.impotros`]="{ item }">
                    <td>{{ formatPrice(item.impotros,2) }}</td>
                </template>
                <template v-slot:[`item.autorizado`]="{ item }">
                    <td>
                        <div v-if="item.autorizado">
                            <v-chip class="ma-2" color="success" text-color="white">SI</v-chip>
                        </div>
                        <div v-else>
                            <v-chip class="ma-2" color="warning" text-color="white">No</v-chip>
                        </div>
                    </td>
                </template>
                <template v-slot:[`item.facturable`]="{ item }">
                    <td>
                        <div v-if="item.facturable">
                            <v-chip class="ma-2" color="success" text-color="white">SI</v-chip>
                        </div>
                        <div v-else>
                            <v-chip class="ma-2" color="warning" text-color="white">No</v-chip>
                        </div>
                    </td>
                </template>
                <template v-slot:[`item.liquidable`]="{ item }">
                    <td>
                        <div v-if="item.liquidable">
                            <v-chip class="ma-2" color="success" text-color="white">SI</v-chip>
                        </div>
                        <div v-else>
                            <v-chip class="ma-2" color="warning" text-color="white">No</v-chip>
                        </div>
                    </td>
                </template>
                <template v-slot:[`item.facturado`]="{ item }">
                    <td>
                        <div v-if="item.facturado">
                            <v-chip class="ma-2" color="success" text-color="white">SI</v-chip>
                        </div>
                        <div v-else>
                            <v-chip class="ma-2" color="warning" text-color="white">No</v-chip>
                        </div>
                    </td>
                </template>
                <template v-slot:[`item.liquidado`]="{ item }">
                    <td>
                        <div v-if="item.liquidado">
                            <v-chip class="ma-2" color="success" text-color="white">SI</v-chip>
                        </div>
                        <div v-else>
                            <v-chip class="ma-2" color="warning" text-color="white">No</v-chip>
                        </div>
                    </td>
                </template>
                <template v-slot:[`item.fecalta`]="{ item }">
                    <td>{{ item.fecalta.substr(0, 16) }}</td>
                </template>
                <template v-slot:[`item.fecumod`]="{ item }">
                    <td>{{ item.fecumod.substr(0, 16) }}</td>
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
                <template v-slot:no-data>
                    <v-btn color="primary" @click="listar">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.228/pdf.min.js"></script>
<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import pdfjsLib from "pdfjs-dist/build/pdf";
    export default {
    data: () => ({
        tasaiva:0,
        max256chars: [
            v => (v.length <= 256) || 'Damasiado largo'
        ],
        required: [
            v => !!v || 'Este campo es requerido'
        ],
        fd: new FormData,
        originalfileidguid: '',
        guid: '',
        page: 1,
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
        appconfigs:[],
        gastos:[],
        usuarios:[],
        proyectos:[],
        registrosAll:[],
        registros:[],
        tareas:[],
        conceptos:[],
        imageUrl:'',
        dialog: false,
        searchg:'',
        searchu:'',
        editedIndex: -1,
        id: '',
        usuarioid:'',
        registroid:'',
        proyectoid:'',
        actividad:'',
        tareaid:'',
        conceptoid:'',
        fecgasto:'',
        referencia:'',
        impneto:0,
        impiva:0,
        impivaper:0,
        impiibb:0,
        impotros:0,
        facturable:true,
        liquidable:true,
        notas:'',
        pdfid:'',
        autorizado:true,
        iduserauto:'',
        fhauto:'',
        facturado:false,
        iduserfact:'',
        fhfact:'',
        liquidado:false,
        iduserliqui:'',
        fhliqui:'',
        iduseralta:'',
        fecalta:'',
        latalta:'',
        longalta:'',
        iduserumod:'',
        fecumod:'',
        latumod:'',
        longumod:'',
        activo:false,
        nombre:'',
        iniciales:'',
        userid:'',
        telefono: '',
        email: '',
        latitude: '',
        longitude: '',
        valida: 0,
        validaMensaje:[],
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: ''             
    }),

    computed: {
        formTitle () {
        return this.editedIndex === -1 ? 'Nueva gasto' : 'Actualizar gasto'
        },
        headersgastos () {
            return [
                { text: '[Opciones]', value: 'actions', align: 'center', sortable: false },
                { text: 'Proyecto', value: 'proyecto', align: 'center', sortable: true },
                { text: 'Tarea', value: 'tarea', align: 'center', sortable: true },
                { text: 'Actividad', value: 'actividad', align: 'center', sortable: true },
                { text: 'Concepto', value: 'concepto', align: 'center', sortable: true },
                { text: 'Fec.Comprobante', value: 'fecgasto', align: 'center', sortable: true },
                { text: 'Referencia', value: 'referencia', align: 'center', sortable: true },
                { text: 'Imp.Neto', value: 'impneto', align: 'center', sortable: true },
                { text: 'Imp.IVA', value: 'impiva', align: 'start', sortable: true },
                { text: 'Imp.Perc.Iva', value: 'impivaper', align: 'center', sortable: true },
                { text: 'Imp.IIBB', value: 'impiibb', align: 'center', sortable: true },
                { text: 'Imp.Otros', value: 'impotros', align: 'center', sortable: true },
                { text: 'Autorizado?', value: 'autorizado', align: 'center', sortable: true },
                { text: 'Facturable?', value: 'facturable', align: 'center', sortable: true },
                { text: 'Liquidable?', value: 'liquidable', align: 'center', sortable: true },
                { text: 'Facturado?', value: 'facturado', align: 'center', sortable: true },
                { text: 'Liquidado?', value: 'liquidado', align: 'center', sortable: true },
                { text: 'Archivo', value: 'pdfid', align: 'center', sortable: true },
                { text: 'Estado', value: 'activo', align: 'start', sortable: true  },
            ]
        } 
    },

    watch: {
        dialog (val) {
            val || this.close()
        },
    },

    created () {
        this.position();
        this.listar();
        this.select();
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
        position(){
            const success = (position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            };
            const error = (error) => {
                console.log(error);
            };
            navigator.geolocation.getCurrentPosition(success,error);            
        },
        filtraRegistros(id){
            var hrs = 0;
            var mins = 0;
            this.registros=this.registrosAll.filter( x => x.proyectoid == id);
            for (var i=0; i<this.registros.length;i++){
                hrs = Math.floor(this.registros[i].minutos / 60);
                mins = this.registros[i].minutos % 60;
                this.registros[i].text=this.fechas.find(x => x.fecha == this.registros[i].fecregistracion).dtext + ' ' 
                    + ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2) + 'Hs '
                    + (this.registros[i].tarea ? ';' + this.registros[i].tarea : "")  
                    + (this.registros[i].actividad ? ';' + this.registros[i].actividad : "");
            }

        },
        getActividadTarea(id){
            var index = this.registros.findIndex(x => x.value == id);
            this.actividad = this.registros[index].actividad;
            this.tareaid = this.registros[index].tareaid;
        },
        pickFile () {
            this.$refs.image.click ()
        },
        async getCalendario(){
            let me=this;
            me.fdesde = new Date();
            me.fhasta = new Date();
            me.fdesde = new Date(me.fdesde.setMonth(me.fdesde.getMonth() - 2)- (me.fdesde.getTimezoneOffset() * 60000)).toISOString().substr(0,10);
            me.fhasta = new Date(me.fhasta.setMonth(me.fhasta.getMonth() + 1)- (me.fhasta.getTimezoneOffset() * 60000)).toISOString().substr(0,10);
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            await axios.get('api/Calendarios/Listarfechas/'+me.fdesde+'/'+me.fhasta,configuracion).then(function(response){
                me.fechas=response.data;
            })
            .catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
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
                    {title: "Nombre gasto", dataKey: "nombre"},
                    {title: "Activo", dataKey: "activo"}
            ];
            var rows = [];

            this.gastos.map(function(x){
                    rows.push({nombre:x.nombre,activo:x.activo});
            });

            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            doc.autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () => {
                    doc.text("Listado de Gastos", 40, 30);
                }
            });
            doc.save('Gastos.pdf');
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Gastos/Listar',configuracion).then(function(response){
                //console.log(response);
                me.gastos=response.data;
                me.$nextTick(function(){
                    this.getCalendario();
                })
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
            var registrosArray=[];
            var conceptosArray=[];
            var tareasArray=[];
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Appconfigs/Listar',configuracion).then(function(response){
                me.appconfigs=response.data;
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
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
            axios.get('api/Proyectos/Select',configuracion).then(function(response){
                proyectosArray=response.data;
                proyectosArray.map(function(x){
                    me.proyectos.push({value:x.id, text: x.nombre});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Registros/Selectusuario/'+me.$store.state.usuario.idusuario,configuracion).then(function(response){
                registrosArray=response.data;
                registrosArray.map(function(x){
                    me.registrosAll.push({value:x.id, text: '', fecregistracion: x.fecregistracion, minutos: x.minutos,
                                atividad: x.actividad, proyectoid: x.proyectoid, proyecto: x.proyecto, tareaid: x.tareaid, tarea: x.tarea});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Conceptos/Select',configuracion).then(function(response){
                conceptosArray=response.data;
                conceptosArray.map(function(x){
                    me.conceptos.push({value:x.id, text: x.nombre});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Tareas/Select',configuracion).then(function(response){
                tareasArray=response.data;
                tareasArray.map(function(x){
                    me.tareas.push({value:x.id, text: x.nombre});
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
            this.usuarioid=item.usuarioid;
            this.registroid=item.registroid;
            this.proyectoid=item.proyectoid;
            this.actividad=item.actividad;
            this.tareaid=item.tareaid;
            this.conceptoid=item.conceptoid;
            this.fecgasto=item.fecgasto.substr(0,10);
            this.referencia=item.referencia;
            this.impneto=item.impneto;
            this.impiva=item.impiva;
            this.impivaper=item.impivaper;
            this.impiibb=item.impiibb;
            this.impotros=item.impotros;
            this.facturable=item.facturable;
            this.liquidable=item.liquidable;
            this.notas=item.notas;
            this.pdfid=item.pdfid;
            this.originalfileidguid=item.pdfid;
            this.autorizado=item.autorizado;
            this.iduserauto=item.iduserauto;
            this.fhauto=item.fhauto;
            this.facturado=item.facturado;
            this.iduserfact=item.iduserfact;
            this.fhfact=item.fhfact;
            this.liquidado=item.liquidado;
            this.iduserliqui=item.iduserliqui;
            this.fhliqui=item.fhliqui;
            this.iduseralta=item.iduseralta;
            this.fecalta=item.fecalta;
            this.latalta=item.latalta;
            this.longalta=item.longalta;
            this.iduserumod=item.iduserumod;
            this.fecumod=item.fecumod;
            this.latumod=item.latumod;
            this.longumod=item.longumod;
            this.activo=item.activo;
            this.tasaiva=this.appconfigs.find(x => x.parametro = 'IVA').vdecimal;
            this.filtraRegistros(this.proyectoid);
            this.onDownload(this.pdfid);
            this.editedIndex=1;
            this.dialog = true
        },
        deleteItem (item) {
            var me=this;
            var resulta = confirm('Esta seguro de querer borrar el registro?');
            if (resulta) {
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Gastos/Eliminar/'+item.id,configuracion).then( () => {
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
        limpiar(){
                this.id="";
                this.usuarioid="";
                this.registroid="";
                this.proyectoid="";
                this.actividad="";
                this.tareaid="";
                this.conceptoid="";
                this.fecgasto="";
                this.referencia="";
                this.impneto=0;
                this.impiva=0;
                this.impivaper=0;
                this.impiibb=0;
                this.impotros=0;
                this.facturable=true;
                this.liquidable=true;
                this.notas="";
                this.pdfid="";
                this.autorizado=false;
                this.iduserauto="";
                this.fhauto="";
                this.facturado=false;
                this.iduserfact="";
                this.fhfact="";
                this.liquidado=false;
                this.iduserliqui="";
                this.fhliqui="";
                this.iduseralta="";
                this.fecalta="";
                this.latalta=this.latitude;
                this.longalta=this.longitude;
                this.iduserumod="";
                this.fecumod="";
                this.latumod=this.latitude;
                this.longumod=this.longitude;
                this.activo=false;
                this.editedIndex=-1;
                this.onClear();
        },
        guardar () {
            this.position();
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            if (this.editedIndex > -1) {
                if (this.pdfid && this.originalfileidguid != this.pdfid ){
                    this.onDelete(this.originalfileidguid);
                    this.originalfileidguid='';
                    this.onUpload();
                }
                //Código para editar
                //Código para guardar
                let me=this;
                axios.put('api/Gastos/Actualizar',{
                    'Id':me.id,
                    'usuarioid': me.$store.state.usuario.idusuario,
                    'registroid': me.registroid,
                    'proyectoid': me.proyectoid,
                    'tareaid': me.tareaid,
                    'conceptoid': me.conceptoid,
                    'fecgasto': me.fecgasto,
                    'referencia': me.referencia,
                    'impneto': me.impneto,
                    'impiva': me.impiva,
                    'impivaper': me.impivaper,
                    'impiibb': me.impiibb,
                    'impotros': me.impotros,
                    'facturable': me.facturable,
                    'liquidable': me.liquidable,
                    'notas': me.notas,
                    'autorizado': me.autorizado,
                    'iduserauto': me.iduserauto,
                    'fhauto': me.fhauto,
                    'facturado': me.facturado,
                    'iduserfact': me.iduserfact,
                    'fhfact': me.fhfact,
                    'liquidado': me.liquidado,
                    'iduserliqui': me.iduserliqui,
                    'fhliqui': me.fhliqui,
                    'pdfid': me.pdfid,
                    'iduserumod': me.$store.state.usuario.idusuario,
                    'latumod': me.latitude,
                    'longumod': me.longitude
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
                axios.post('api/Gastos/Crear',{
                    'usuarioid': me.$store.state.usuario.idusuario,
                    'registroid': me.registroid,
                    'proyectoid': me.proyectoid,
                    'tareaid': me.tareaid,
                    'conceptoid': me.conceptoid,
                    'fecgasto': me.fecgasto,
                    'referencia': me.referencia,
                    'impneto': me.impneto,
                    'impiva': me.impiva,
                    'impivaper': me.impivaper,
                    'impiibb': me.impiibb,
                    'impotros': me.impotros,
                    'facturable': me.facturable,
                    'liquidable': me.liquidable,
                    'notas': me.notas,
                    'autorizado': me.autorizado,
                    'iduserauto': me.iduserauto,
                    'fhauto': me.fhauto,
                    'facturado': me.facturado,
                    'iduserfact': me.iduserfact,
                    'fhfact': me.fhfact,
                    'liquidado': me.liquidado,
                    'iduserliqui': me.iduserliqui,
                    'fhliqui': me.fhliqui,
                    'pdfid': me.pdfid,
                    'iduseralta': me.$store.state.usuario.idusuario,
                    'latalta': me.latitude,
                    'longalta': me.longitude
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
            axios.put('api/Gastos/Activar/'+this.adId,{},configuracion).then( () => {
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
            axios.put('api/Gastos/Desactivar/'+this.adId,{},configuracion).then( () => {
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
        onFileSelected(fileList){

            var file = fileList[0];
            let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
            this.guid = [u.substr(0,8), u.substr(8,4), u.substr(13,3), u.substr(16,12)].join('');
            this.pdfid = this.guid;
            this.fd.append("file", file, this.guid)

            var fileReader = new FileReader();

            fileReader.onload = function() {
                var typedarray = new Uint8Array(this.result);                    

                var loadingTask = pdfjsLib.getDocument(typedarray);

                loadingTask.promise.then(function(pdf) {
                    console.log('PDF loaded');
                    
                    // Fetch the first page
                    var pageNumber = 1;
                    pdf.getPage(pageNumber).then(function(page) {
                        console.log('Page loaded');
                        
                        var scale = 1.2;
                        var viewport = page.getViewport({scale: scale});

                        // Prepare canvas using PDF page dimensions
                        var canvas = document.getElementById('the-canvas');
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        // Render PDF page into canvas context
                        var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                        };
                        var renderTask = page.render(renderContext);
                        renderTask.promise.then(function () {
                        console.log('Page rendered');
                        });
                    });
                    }, function (reason) {
                    // PDF loading error
                    console.error(reason);
                    }
                );
            };
            fileReader.readAsArrayBuffer(file);
        },        
        async onUpload(){
            let me=this;                    
            let configuracion= {headers : {"Authorization" : "Bearer " + this.$store.state.token, 'Content-Type': 'multipart/form-data'} };
            await axios.post('api/Express/UploadFiles',this.fd,configuracion)
                .then(res => {
                console.log(res.data);
                this.fd = new FormData;
            }).catch(error => {
                this.fd = new FormData;
                this.dialog = false;
                this.guid = '';
                this.pdfid = '';
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackbar = true;
                console.log(error);                        
            });
        },
        onDownload(file){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};        
            axios.get('api/Express/DownloadFile/'+file,configuracion)
            .then(res => {
            //console.log(res.data)
            var pdfData = atob(res.data)
            var loadingTask = pdfjsLib.getDocument({data: pdfData});

            loadingTask.promise.then(function(pdf) {
                console.log('PDF loaded');
                
                // Fetch the first page
                var pageNumber = 1;
                pdf.getPage(pageNumber).then(function(page) {
                    console.log('Page loaded');
                    
                    var scale = 1.2;
                    var viewport = page.getViewport({scale: scale});

                    // Prepare canvas using PDF page dimensions
                    var canvas = document.getElementById('the-canvas');
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Render PDF page into canvas context
                    var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                    };
                    var renderTask = page.render(renderContext);
                    renderTask.promise.then(function () {
                    console.log('Page rendered');
                    });
                });
                }, function (reason) {
                // PDF loading error
                console.error(reason);
                });
            }).catch(error => {
            console.log(error);
            });
        },
        onSaveAs(file){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};        
            axios.get('api/Express/DownloadFile/'+file,configuracion)
            .then(res => {
            //console.log(res.data)
            var FileSaver = require('file-saver');
            var pdfData = atob(res.data)
            var byteNumbers = new Array(pdfData.length);
            for (var i = 0 ; i < pdfData.length; i++){
                byteNumbers[i] = pdfData.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray],{type: "application/pdf" });
            FileSaver.saveAs(blob, 'Export.pdf');
            });          
        },                
        onClear(){
            var canvas = document.getElementById('the-canvas');
            var context = canvas.getContext("2d");
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0,0, canvas.width, canvas.height);
        },      
        onDelete(file){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};        
            axios.delete('api/Express/DeleteFile/'+file,configuracion)
            .then(res => {
            console.log(res.data);
            }).catch(error => {
            console.log(error);
            });
        }                
    },
  }
</script>

<style>
.v-data-table {
    white-space: nowrap;
}
</style>