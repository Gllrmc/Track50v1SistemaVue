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
        <v-col>
            <v-data-table
            dense
            :headers="headers"
            :items="appconfigs"
            :search="search"
            class="elevation-1"
            no-data-text="Nada para mostrar"
            >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <div class="ma-2">
                        <v-btn small @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                    </div>
                    <v-toolbar-title>Configuracion y parametros</v-toolbar-title>
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
                                        <v-text-field v-model="parametro" label="Parametro"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="vstring" label="Valor String"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="vint" label="Valor Int"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="vdecimal" label="Valor Decimal"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="vdatetime" label="Valor DateTime"></v-text-field>
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
                    <v-dialog v-model="adModal" max-width="290">
                        <v-card>
                            <v-card-title class="headline" v-if="adAccion==1">¿Activar Parametro?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2">Bloquear Parametro?</v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion==1">Activar </span>
                                <span v-if="adAccion==2">Bloquear </span>
                                el Parametro {{ adNombre }}
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
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon
                class="mr-2"
                @click="editItem(item)"
                >
                edit
                </v-icon>
                <v-icon
                @click="deleteItem(item)"
                >
                delete
                </v-icon>
                    <template v-if="item.activo">
                        <v-icon
                        @click="activarDesactivarMostrar(2,item)"
                        >
                        mdi-eye-off
                        </v-icon>
                    </template>
                    <template v-else>
                        <v-icon
                        @click="activarDesactivarMostrar(1,item)"
                        >
                        mdi-eye
                        </v-icon>
                </template>
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
        appconfigs: [],
        dialog: false,
        headers: [
            { text: '[Opciones]', value: 'actions', align: 'center', sortable: false },
            { text: 'Parametro', value: 'parametro', align: 'start', sortable: true },
            { text: 'String', value: 'vstring', align: 'start', sortable: true },
            { text: 'Int', value: 'vint', align: 'start', sortable: true },
            { text: 'Decimal', value: 'vdecimal', align: 'start', sortable: true },
            { text: 'DateTime', value: 'vdatetime', align: 'start', sortable: true },
            { text: 'Estado', value: 'activo', align: 'center', sortable: true  },
            { text: 'Creador Id', value: 'iduseralta', align: 'center', sortable: true },
            { text: 'Fecha Hora Creación', value: 'fecalta', align: 'start', sortable: true },
            { text: 'Mod. Id', value: 'iduserumod', align: 'center', sortable: true },
            { text: 'Fecha Hora Ult.Mod.', value: 'fecumod', align: 'start', sortable: true }
        ],
        search:'',
        editedIndex: -1,
        id:'',
        parametro:'',
        vstring:'',
        vint:'',
        vdecimal:'',
        vdatetime:'',
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
        return this.editedIndex === -1 ? 'Nuevo parámetro' : 'Actualizar parámetro'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.listar()
    },

    methods: {
        crearPDF(){
            var columns = [
                {title: "Parametro", dataKey: "parametro"},
                {title: "String", dataKey: "vstring"},
                {title: "Int", dataKey: "vint"},
                {title: "Decimal", dataKey: "vdecimal"},
                {title: "DateTime", dataKey: "vdatetime"},
                {title: "Activo", dataKey: "activo"}
            ];
            var rows = [];

            this.appconfigs.map(function(x){
                rows.push({parametro:x.parametro,vstring:x.vstring,vint:x.int,
                    vdecimal:x.vdecimal,vdatetime:x.vdatetime,activo:x.activo});
            });

            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () => {
                    doc.text("Listado de Parametros", 40, 30);
                }
            });
            doc.save('Parametros.pdf');
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            // console.log(configuracion);
            axios.get('api/Appconfigs/Listar',configuracion).then(function(response){
                // console.log(response);
                me.appconfigs=response.data;
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
        },

        editItem (item) {
            this.id=item.id;
            this.parametro=item.parametro;
            this.vstring=item.vstring;
            this.vint=item.vint;
            this.vdecimal=item.vdecimal;
            this.vdatetime=item.vdatetime;
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
                axios.delete('api/Appconfigs/Eliminar/'+item.id,configuracion).then( () => {
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
        close () {
            this.dialog = false
            this.limpiar();

        },
        limpiar(){
            this.id="";
            this.parametro="";
            this.vstring="";
            this.vint="";
            this.vdecimal="";
            this.vdatetime="";
            this.fecalta = "";
            this.iduserumod = "";
            this.fecumod = "";
            this.activo = false;                  
            this.editedIndex=-1;
        },
        guardar () {
            let me=this;
            if (me.validar()){
                return;
            }
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            if (me.editedIndex > -1) {
                //Código para editar
                //Código para guardar
                axios.put('api/Appconfigs/Actualizar',{
                    'id':me.id,
                    'parametro':me.parametro,
                    'vstring': me.vstring,
                    'vint': me.vint,
                    'vdecimal': me.vdecimal,
                    'vdatetime': me.vdatetime,
                    'iduseralta': me.iduseralta,
                    'fecalta': me.fecalta,
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
                axios.post('api/Appconfigs/Crear',{
                    'parametro':me.parametro,
                    'vstring': me.vstring,
                    'vint': me.vint,
                    'vdecimal': me.vdecimal,
                    'vdatetime': me.vdatetime,
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
            if (!this.parametro){
                this.validaMensaje.push("Ingrese un parametro");
            }
            if (!this.vstring && !this.vint && !this.vdecimal && !this.vdatetime){
                this.validaMensaje.push("El formulario debe contener al menos unvalor para un tipo de dato");
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
            axios.put('api/Appconfigs/Activar/'+this.adId,{},configuracion).then( () => {
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
            axios.put('api/Appconfigs/Desactivar/'+this.adId,{},configuracion).then( () => {
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
