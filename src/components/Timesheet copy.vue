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
            :headers="headersregistros"
            :items="registros"
            :search="searchg"
            class="elevation-1"
            no-data-text="Sin registros"
            >
                <template v-slot:[`body.append`]='{headers}'>
                    <tr>
                        <td v-for="(header,i) in headers" :key="i">
                            <div v-if="i == 0">
                                <strong>Total</strong>
                            </div>
                            <div v-if="i == 3" style="float:right">
                                <strong>{{calcularStLu}}</strong>
                            </div>
                            <div v-if="i == 4" style="float:right">
                                <strong>{{calcularStMa}}</strong>
                            </div>
                            <div v-if="i == 5" style="float:right">
                                <strong>{{calcularStMi}}</strong>
                            </div>
                            <div v-if="i == 6" style="float:right">
                                <strong>{{calcularStJu}}</strong>
                            </div>
                            <div v-if="i == 7" style="float:right">
                                <strong>{{calcularStVi}}</strong>
                            </div>
                            <div v-if="i == 8" style="float:right">
                                <strong>{{calcularStSa}}</strong>
                            </div>
                            <div v-if="i == 9" style="float:right">
                                <strong>{{calcularStDo}}</strong>
                            </div>
                            <div v-if="i == 10" style="float:right">
                                <strong>{{calcularTot}}</strong>
                            </div>
                            <div v-else>
                                <!-- empty table cells for columns that don't need a sum -->
                            </div>
                        </td>
                    </tr>
                </template>
                <template v-slot:top>
                    <v-card flat color="white">
                        <v-card-title>
                            <div class="ma-2">
                                <v-btn small @click="crearPDF()"><v-icon>print</v-icon></v-btn>
                            </div>
                            Time Sheet
                        </v-card-title>
                        <v-card-actions>
                            <v-row>
                                <v-col cols="12" md="7" sm="7">
                                    <v-text-field 
                                    dense 
                                    label="Búsqueda" 
                                    outlined 
                                    v-model="searchg" 
                                    append-icon="search" 
                                    single-line 
                                    hide-details 
                                    clearable >
                                    </v-text-field>
                                </v-col>
                                <v-spacer/>
                                <v-col cols="12" md="3" sm="3">
                                    <v-select 
                                    dense
                                    v-model="semana"
                                    label = "Semana"
                                    outlined
                                    hide-details
                                    :items = "semanas"
                                    disable-lookup
                                    append-icon = "mdi-skip-next-circle"
                                    prepend-inner-icon = "mdi-skip-previous-circle"
                                    @click:append = "nextsem"
                                    @click:prepend-inner = "prevsem"
                                    @change = "inputsem"
                                    ></v-select>
                                </v-col>
                                <v-spacer/>
                            </v-row>
                            <v-btn color="primary" dark class="mb-2">Nuevo</v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
                <template v-slot:[`item.luhoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.luhoras"
                        large
                        cancel-text="Salir"
                        save-text="Grabar"
                        persistent
                    >
                        {{ props.item.luhoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.luhoras"
                            append-icon="mdi-dots-vertical"
                            type="time"
                            label="Editar"
                            single-line
                            clearable
                            @change="editProyecto(props.item)"
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.mahoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.mahoras"
                        large
                        cancel-text="Salir"
                        save-text="Grabar"
                        persistent
                    >
                        {{ props.item.mahoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.mahoras"
                            append-icon="mdi-dots-vertical"
                            type="time"
                            label="Editar"
                            single-line
                            counter
                            clearable
                            @change="editProyecto(props.item)"
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.mihoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.mihoras"
                        large
                        cancel-text="Salir"
                        save-text="Grabar"
                        persistent
                    >
                        {{ props.item.mihoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.mihoras"
                            append-icon="mdi-dots-vertical"
                            type="time"
                            label="Editar"
                            single-line
                            counter
                            clearable
                            @change="editProyecto(props.item)"
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.juhoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.juhoras"
                        large
                        cancel-text="Salir"
                        save-text="Grabar"
                        persistent
                    >
                        {{ props.item.juhoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.juhoras"
                            append-icon="mdi-dots-vertical"
                            type="time"
                            label="Editar"
                            single-line
                            counter
                            clearable
                            @change="editProyecto(props.item)"
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.vihoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.vihoras"
                        large
                        cancel-text="Salir"
                        save-text="Grabar"
                        persistent
                    >
                        {{ props.item.vihoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.vihoras"
                            append-icon="mdi-dots-vertical"
                            type="time"
                            label="Editar"
                            single-line
                            counter
                            clearable
                            @change="editProyecto(props.item)"
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.sahoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.sahoras"
                        large
                        cancel-text="Salir"
                        save-text="Grabar"
                        persistent
                    >
                        {{ props.item.sahoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.sahoras"
                            append-icon="mdi-dots-vertical"
                            type="time"
                            label="Editar"
                            single-line
                            counter
                            clearable
                            @change="editProyecto(props.item)"
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.dohoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.dohoras"
                        large
                        cancel-text="Salir"
                        save-text="Grabar"
                        persistent
                    >
                        {{ props.item.dohoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.dohoras"
                            append-icon="mdi-dots-vertical"
                            type="time"
                            label="Editar"
                            single-line
                            counter
                            clearable
                            @change="editProyecto(props.item)"
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
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
        latitude:0,
        longitude:0,
        allowedStep: m => m % 15 === 0,
        fdesde: new Date(),
        fhasta: new Date(),
        menu1: false,
        max256chars: v => v.length <= 256 || 'Input too long!',
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
        todaysdate: '',
        recordInfo:0,
        semana:0,
        semanas:[],
        fechas:[],
        registros:[],
        registrosAll:[],
        usuarios:[],
        grupos:[],
        grupousuarios:[],
        proyectos:[],
        proyectousuarios:[],
        proyectogrupos:[],
        tareas:[],
        proyectotareas:[],
        workgroupId:'',
        imageUrl:'',
        userheader: '',
        dialog: false,
        userdialog: false,
        headersregistros: [
            { text: '[Opciones]', value: 'actions', align: 'center', sortable: false },
            { text: 'Proyecto', value: 'proyecto', align: 'start', sortable: true },
            { text: 'Tarea', value: 'tarea', align: 'start', sortable: true },
            { text: 'Hs.Lun.', value: 'luhoras', align: 'end', sortable: false, fecha: '' },
            { text: 'Hs.Mar.', value: 'mahoras', align: 'end', sortable: false, fecha: '' },
            { text: 'Hs.Mie.', value: 'mihoras', align: 'end', sortable: false, fecha: '' },
            { text: 'Hs.Jue.', value: 'juhoras', align: 'end', sortable: false, fecha: '' },
            { text: 'Hs.Vie.', value: 'vihoras', align: 'end', sortable: false, fecha: '' },
            { text: 'Hs.Sab.', value: 'sahoras', align: 'end', sortable: false, fecha: '' },
            { text: 'Hs.Dom.', value: 'dohoras', align: 'end', sortable: false, fecha: '' },
            { text: 'Total', value: 'tohoras', align: 'end', sortable: true  },
        ],
        luhoras:'',
        mahoras:'',
        mihoras:'',
        juhoras:'',
        vihoras:'',
        sahoras:'',
        dohoras:'',
        totalLun:'',
        totalMar:'',
        totalMie:'',
        totalJue:'',
        totalVie:'',
        totalSab:'',
        totalDom:'',
        totalGral:'',
        headersproyectos: [
            { text: '#', value: 'selected', align: 'center', sortable: false },
            { text: '[Opciones]', value: 'actions', align: 'center', sortable: false },
            { text: 'Proyecto', value: 'proyecto', align: 'start', sortable: false },
            { text: 'Tarea', value: 'tarea', align: 'end', sortable: true },
            { text: 'Est.Tarifa', value: 'estimadotarifa', align: 'end', sortable: true },
            { text: 'Est.Monto', value: 'estimadomonto', align: 'end', sortable: true },
            { text: 'Notas', value: 'notas', align: 'start', sortable: true },
            //{ text: 'Creador Id', value: 'iduseralta', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Creación', value: 'fecalta', align: 'start', sortable: true },
            //{ text: 'Mod. Id', value: 'iduserumod', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Ult.Mod.', value: 'fecumod', align: 'start', sortable: true }                   
        ],
        searchg:'',
        searchu:'',
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
        estimadohoras:0,
        estimadomonto:0,
        valida: 0,
        validaMensaje:[],
        adAccion: 0,
        adNombre: '',
        adId: ''             
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nueva tarea' : 'Actualizar tarea'
      },
      calcularStLu: function(){
        var msec = 0;
        var aux = 0;
        for (let index = 0; index < this.registros.length; index++) {
            aux = new Date(this.registros[index].lufhhasta).getTime() - new Date(this.registros[index].lufhdesde).getTime();
            msec += aux?aux:0;
        };
        var mins = Math.floor(msec / 60000);
        var hrs = Math.floor(mins / 60);
        mins = mins % 60;
        hrs = hrs % 24;

        return ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2)
      },
      calcularStMa: function(){
        var msec = 0;
        var aux = 0;
        for (let index = 0; index < this.registros.length; index++) {
            aux = new Date(this.registros[index].mafhhasta).getTime() - new Date(this.registros[index].mafhdesde).getTime();
            msec += aux?aux:0;
        };
        var mins = Math.floor(msec / 60000);
        var hrs = Math.floor(mins / 60);
        mins = mins % 60;
        hrs = hrs % 24;
        return ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2)
      },
      calcularStMi: function(){
        var msec = 0;
        var aux = 0;
        for (let index = 0; index < this.registros.length; index++) {
            aux = new Date(this.registros[index].mifhhasta).getTime() - new Date(this.registros[index].mifhdesde).getTime();
            msec += aux?aux:0;
        };
        var mins = Math.floor(msec / 60000);
        var hrs = Math.floor(mins / 60);
        mins = mins % 60;
        hrs = hrs % 24;
        return ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2)
      },
      calcularStJu: function(){
        var msec = 0;
        var aux = 0;
        for (let index = 0; index < this.registros.length; index++) {
            aux = new Date(this.registros[index].jufhhasta).getTime() - new Date(this.registros[index].jufhdesde).getTime();
            msec += aux?aux:0;
        };
        var mins = Math.floor(msec / 60000);
        var hrs = Math.floor(mins / 60);
        mins = mins % 60;
        hrs = hrs % 24;
        return ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2)
      },
      calcularStVi: function(){
        var msec = 0;
        var aux = 0;
        for (let index = 0; index < this.registros.length; index++) {
            aux = new Date(this.registros[index].vifhhasta).getTime() - new Date(this.registros[index].vifhdesde).getTime();
            msec += aux?aux:0;
        };
        var mins = Math.floor(msec / 60000);
        var hrs = Math.floor(mins / 60);
        mins = mins % 60;
        hrs = hrs % 24;
        return ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2)
      },
      calcularStSa: function(){
        var msec = 0;
        var aux = 0;
        for (let index = 0; index < this.registros.length; index++) {
            aux = new Date(this.registros[index].safhhasta).getTime() - new Date(this.registros[index].safhdesde).getTime();
            msec += aux?aux:0;
        };
        var mins = Math.floor(msec / 60000);
        var hrs = Math.floor(mins / 60);
        mins = mins % 60;
        hrs = hrs % 24;
        return ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2)
      },
      calcularStDo: function(){
        var msec = 0;
        var aux = 0;
        for (let index = 0; index < this.registros.length; index++) {
            aux = new Date(this.registros[index].dofhhasta).getTime() - new Date(this.registros[index].dofhdesde).getTime();
            msec += aux?aux:0;
        };
        var mins = Math.floor(msec / 60000);
        var hrs = Math.floor(mins / 60);
        mins = mins % 60;
        hrs = hrs % 24;
        return ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2)
      },
      calcularTot: function(){
        var msec = 0;
        var aux = 0;
        for (let index = 0; index < this.registros.length; index++) {
            aux = new Date(this.registros[index].lufhhasta).getTime() - new Date(this.registros[index].lufhdesde).getTime();
            msec += aux?aux:0;
            aux = new Date(this.registros[index].mafhhasta).getTime() - new Date(this.registros[index].mafhdesde).getTime();
            msec += aux?aux:0;
            aux = new Date(this.registros[index].mifhhasta).getTime() - new Date(this.registros[index].mifhdesde).getTime();
            msec += aux?aux:0;
            aux = new Date(this.registros[index].jufhhasta).getTime() - new Date(this.registros[index].jufhdesde).getTime();
            msec += aux?aux:0;
            aux = new Date(this.registros[index].vifhhasta).getTime() - new Date(this.registros[index].vifhdesde).getTime();
            msec += aux?aux:0;
            aux = new Date(this.registros[index].safhhasta).getTime() - new Date(this.registros[index].safhdesde).getTime();
            msec += aux?aux:0;
            aux = new Date(this.registros[index].dofhhasta).getTime() - new Date(this.registros[index].dofhdesde).getTime();
            msec += aux?aux:0;
        };
        var mins = Math.floor(msec / 60000);
        var hrs = Math.floor(mins / 60);
        mins = mins % 60;
        return ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2)
      },
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
    },

    created () {
        this.listar();
        this.position();
        this.calendario();
        this.select();
    },
    methods: {
        nextsem(){
            (this.semana==this.semanas[this.semanas.length-1].value)?this.semana:this.semana++;
            this.setHeaders(new Date(this.semanas[this.semanas.findIndex(x => x.value ==this.semana)].lun))
            this.setItems("Week");
        },
        prevsem(){
            (this.semana==this.semanas[0].value)?this.semana:this.semana--;
            this.setHeaders(new Date(this.semanas[this.semanas.findIndex(x => x.value ==this.semana)].lun))
            this.setItems("Week");
        },
        inputsem(){
            this.setHeaders(new Date(this.semanas[this.semanas.findIndex(x => x.value ==this.semana)].lun))
            this.setItems("Week");

        },
        setHeaders(day){
            let me=this;
            var lun = new Date();
            day = new Date(day.getTime() - day.getTimezoneOffset() * 60000);
            lun = new Date(lun.getTime() - lun.getTimezoneOffset() * 60000);
            var ii = 0;
            ii = me.fechas.findIndex(x => x.fecha.substr(0,10) === day.toISOString().substr(0,10));
            lun = (me.fechas[ii].sini).substr(0,10);
            ii = me.fechas.findIndex(x => x.fecha.substr(0,10) === lun);
            for (var i = 0; i < 7; i++){
                me.headersregistros[ i + 3 ].text = me.fechas[ ii + i ].dtext;
                me.headersregistros[ i + 3 ].fecha = me.fechas[ ii + i ].fecha;
            }
        },
        setItems(tipo,day){
            let me=this;
            me.registros=[];
            if (tipo == "Date"){
                day = new Date(day.getTime() - day.getTimezoneOffset() * 60000).toISOString().substr(0,10);
                var ii = 0;
                var lun = new Date(), dom = new Date();
                ii = me.fechas.findIndex(x => x.fecha.substr(0,10) === day);
                lun = (me.fechas[ii].sini).substr(0,10);
                dom = (me.fechas[ii].sfin).substr(0,10);
            } else {
                var lun = me.semanas[me.semanas.findIndex(x => x.value == me.semana)].lun
                var dom = me.semanas[me.semanas.findIndex(x => x.value == me.semana)].dom
            }
            var registrosArray=[];
            var aux = 0;
            registrosArray = me.registrosAll.filter(x => x.fecregistracion >= lun && x.fecregistracion <= dom && x.usuarioid == me.$store.state.usuario.idusuario)
            for (var i = 0; i < registrosArray.length; i++){
                var index = me.registros.findIndex(x => x.usuarioid === registrosArray[i].usuarioid 
                    && x.proyectoid === registrosArray[i].proyectoid 
                    && x.tareaid === registrosArray[i].tareaid
                );
                if ( index == -1){
                    index = me.registros.push({ 
                    usuarioid: registrosArray[i].usuarioid, proyectoid: registrosArray[i].proyectoid, tareaid: registrosArray[i].tareaid, 
                    proyecto: registrosArray[i].proyecto, tarea: registrosArray[i].tarea, 
                    luhoras: '', mahoras: '', mihoras: '', juhoras: '', vihoras: '', sahoras: '', dohoras: ''
                    });
                    index--;
                    aux = 0;
                }
                var msec = new Date(registrosArray[i].fhhasta).getTime() - new Date(registrosArray[i].fhdesde).getTime();
                aux += msec?msec:0;
                mins = Math.floor(aux / 60000);
                hrs = Math.floor(mins / 60);
                mins = mins % 60;
                me.registros[index].tohoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
                var mins = Math.floor(msec / 60000);
                var hrs = Math.floor(mins / 60);
                mins = mins % 60;
                switch( new Date(registrosArray[i].fecregistracion).getDay() ){
                    case 1:
                        me.registros[index].lufecregistracion =  registrosArray[i].fecregistracion;
                        me.registros[index].luid = registrosArray[i].id;
                        me.registros[index].luactividad = registrosArray[i].actividad;
                        me.registros[index].lufacturable = registrosArray[i].facturable;
                        me.registros[index].luliquidable = registrosArray[i].liquidable;
                        me.registros[index].lufhdesde =  registrosArray[i].fhdesde;
                        me.registros[index].lufhhasta = registrosArray[i].fhhasta;
                        me.registros[index].luhoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
                        me.registros[index].lulatdesde = registrosArray[i].latdesde;
                        me.registros[index].lulongdesde = registrosArray[i].longdesde;
                        me.registros[index].lulathasta = registrosArray[i].lathasta
                        me.registros[index].lulonghasta = registrosArray[i].longhasta;
                        me.registros[index].lutarifa = registrosArray[i].tarifa;
                        me.registros[index].lucosto = registrosArray[i].costo;
                        break;
                    case 2:
                        me.registros[index].mafecregistracion =  registrosArray[i].fecregistracion;
                        me.registros[index].maid = registrosArray[i].id;
                        me.registros[index].maactividad = registrosArray[i].actividad;
                        me.registros[index].mafacturable = registrosArray[i].facturable;
                        me.registros[index].maliquidable = registrosArray[i].liquidable;
                        me.registros[index].mafhdesde =  registrosArray[i].fhdesde;
                        me.registros[index].mafhhasta = registrosArray[i].fhhasta;
                        me.registros[index].mahoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
                        me.registros[index].malatdesde = registrosArray[i].latdesde;
                        me.registros[index].malongdesde = registrosArray[i].longdesde;
                        me.registros[index].malathasta = registrosArray[i].lathasta
                        me.registros[index].malonghasta = registrosArray[i].longhasta;
                        me.registros[index].matarifa = registrosArray[i].tarifa;
                        me.registros[index].macosto = registrosArray[i].costo;
                        break;
                    case 3:
                        me.registros[index].mifecregistracion =  registrosArray[i].fecregistracion;
                        me.registros[index].miid = registrosArray[i].id;
                        me.registros[index].miactividad = registrosArray[i].actividad;
                        me.registros[index].mifacturable = registrosArray[i].facturable;
                        me.registros[index].miliquidable = registrosArray[i].liquidable;
                        me.registros[index].mifhdesde =  registrosArray[i].fhdesde;
                        me.registros[index].mifhhasta = registrosArray[i].fhhasta;
                        me.registros[index].mihoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
                        me.registros[index].milatdesde = registrosArray[i].latdesde;
                        me.registros[index].milongdesde = registrosArray[i].longdesde;
                        me.registros[index].milathasta = registrosArray[i].lathasta
                        me.registros[index].milonghasta = registrosArray[i].longhasta;
                        me.registros[index].mitarifa = registrosArray[i].tarifa;
                        me.registros[index].micosto = registrosArray[i].costo;
                        break;
                    case 4:
                        me.registros[index].jufecregistracion =  registrosArray[i].fecregistracion;
                        me.registros[index].juid = registrosArray[i].id;
                        me.registros[index].juactividad = registrosArray[i].actividad;
                        me.registros[index].jufacturable = registrosArray[i].facturable;
                        me.registros[index].juliquidable = registrosArray[i].liquidable;
                        me.registros[index].jufhdesde =  registrosArray[i].fhdesde;
                        me.registros[index].jufhhasta = registrosArray[i].fhhasta;
                        me.registros[index].juhoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
                        me.registros[index].julatdesde = registrosArray[i].latdesde;
                        me.registros[index].julongdesde = registrosArray[i].longdesde;
                        me.registros[index].julathasta = registrosArray[i].lathasta
                        me.registros[index].julonghasta = registrosArray[i].longhasta;
                        me.registros[index].jutarifa = registrosArray[i].tarifa;
                        me.registros[index].jucosto = registrosArray[i].costo;
                        break;
                    case 5:
                        me.registros[index].vifecregistracion =  registrosArray[i].fecregistracion;
                        me.registros[index].viid = registrosArray[i].id;
                        me.registros[index].viactividad = registrosArray[i].actividad;
                        me.registros[index].vifacturable = registrosArray[i].facturable;
                        me.registros[index].viliquidable = registrosArray[i].liquidable;
                        me.registros[index].vifhdesde =  registrosArray[i].fhdesde;
                        me.registros[index].vifhhasta = registrosArray[i].fhhasta;
                        me.registros[index].vihoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
                        me.registros[index].vilatdesde = registrosArray[i].latdesde;
                        me.registros[index].vilongdesde = registrosArray[i].longdesde;
                        me.registros[index].vilathasta = registrosArray[i].lathasta
                        me.registros[index].vilonghasta = registrosArray[i].longhasta;
                        me.registros[index].vitarifa = registrosArray[i].tarifa;
                        me.registros[index].vicosto = registrosArray[i].costo;
                        break;
                    case 6:
                        me.registros[index].safecregistracion =  registrosArray[i].fecregistracion;
                        me.registros[index].said = registrosArray[i].id;
                        me.registros[index].saactividad = registrosArray[i].actividad;
                        me.registros[index].safacturable = registrosArray[i].facturable;
                        me.registros[index].saliquidable = registrosArray[i].liquidable;
                        me.registros[index].safhdesde =  registrosArray[i].fhdesde;
                        me.registros[index].safhhasta = registrosArray[i].fhhasta;
                        me.registros[index].sahoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
                        me.registros[index].salatdesde = registrosArray[i].latdesde;
                        me.registros[index].salongdesde = registrosArray[i].longdesde;
                        me.registros[index].salathasta = registrosArray[i].lathasta
                        me.registros[index].salonghasta = registrosArray[i].longhasta;
                        me.registros[index].satarifa = registrosArray[i].tarifa;
                        me.registros[index].sacosto = registrosArray[i].costo;
                        break;
                    case 7:
                        me.registros[index].dofecregistracion =  registrosArray[i].fecregistracion;
                        me.registros[index].doid = registrosArray[i].id;
                        me.registros[index].doactividad = registrosArray[i].actividad;
                        me.registros[index].dofacturable = registrosArray[i].facturable;
                        me.registros[index].doliquidable = registrosArray[i].liquidable;
                        me.registros[index].dofhdesde =  registrosArray[i].fhdesde;
                        me.registros[index].dofhhasta = registrosArray[i].fhhasta;
                        me.registros[index].dohoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
                        me.registros[index].dolatdesde = registrosArray[i].latdesde;
                        me.registros[index].dolongdesde = registrosArray[i].longdesde;
                        me.registros[index].dolathasta = registrosArray[i].lathasta
                        me.registros[index].dolonghasta = registrosArray[i].longhasta;
                        me.registros[index].dotarifa = registrosArray[i].tarifa;
                        me.registros[index].docosto = registrosArray[i].costo;
                        break;
                }
            }
            console.log(me.registros)
        },
        buildWeek(){
            let me=this;
            var flags = [], i, ii, today = new Date(), thiswkstart = new Date(), prevwkstart = new Date(), nextwkstart = new Date();
            today = new Date(today.getTime() - today.getTimezoneOffset() * 60000 );
            me.semanas = [];
            me.semana = me.fechas[me.fechas.findIndex(x => x.fecha.substr(0,10) === today.toISOString().substr(0,10))].snum;
            ii = me.fechas.findIndex(x => x.fecha.substr(0,10) === today.toISOString().substr(0,10));
            thiswkstart = me.fechas[ii].sini;
            prevwkstart = me.fechas[ii - 7].sini;
            nextwkstart = me.fechas[ii + 7].sini;
            for( i = 0; i < me.fechas.length; i++) {
                if( flags[me.fechas[i].stext]) continue;
                flags[me.fechas[i].stext] = true;
                switch (me.fechas[i].fecha){
                    case prevwkstart:
                        me.semanas.push({lun: me.fechas[i].sini, dom: me.fechas[i].sfin, week: me.fechas[i].stext, text: 'Semana anterior', value: me.fechas[i].snum});
                        break
                    case thiswkstart:
                        me.semanas.push({lun: me.fechas[i].sini, dom: me.fechas[i].sfin, week: me.fechas[i].stext, text: 'Esta semana', value: me.fechas[i].snum});
                        break
                    case nextwkstart:
                        me.semanas.push({lun: me.fechas[i].sini, dom: me.fechas[i].sfin, week: me.fechas[i].stext, text: 'Semana siguiente', value: me.fechas[i].snum});
                        break
                    default:
                        me.semanas.push({lun: me.fechas[i].sini, dom: me.fechas[i].sfin, week: me.fechas[i].stext, text: me.fechas[i].stxt, value: me.fechas[i].snum});
                }
            }
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
        save () {
        },
        cancel () {
        },
        formatPrice(value,dec) {
            let val = (value/1).toFixed(dec).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
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
                    {title: "Nombre tarea", dataKey: "nombre"},
                    {title: "Activo", dataKey: "activo"}
            ];
            var rows = [];

            this.registrosAll.map(function(x){
                    rows.push({nombre:x.nombre,activo:x.activo});
            });

            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            doc.autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () => {
                    doc.text("Listado de Registros", 40, 30);
                }
            });
            doc.save('Registros.pdf');
        },
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Registros/Listaractivos',configuracion).then(function(response){
                //console.log(response);
                me.registrosAll=response.data;
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
            var gruposArray=[];
            var grupousuariosArray=[];
            var proyectosArray=[];
            var tareasArray=[];
            var tareaproyectoArray=[];
            var proyectousuarioArray=[];
            var proyectogrupoArray=[];
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
                    me.proyectos.push({value:x.id, nombre: x.nombre, relid: 0, estimadohoras: 0, estimadomonto: 0, estimadotarifa: 0, notas: ''});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Tareas/Listar',configuracion).then(function(response){
                tareasArray=response.data;
                tareasArray.map(function(x){
                    me.tareas.push({value:x.id, nombre: x.nombre});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Proyectotareas/Listar',configuracion).then(function(response){
                tareaproyectoArray=response.data;
                tareaproyectoArray.map(function(x){
                    me.proyectotareas.push({tareaid: x.tareaid, proyectoid: x.proyectoid, estimadohoras: x.estimadohoras,
                        estimadomonto: x.estimadomonto, estimadotarifa: (x.estimadomonto / x.estimadohoras).toFixed(2), notas: x.notas, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Proyectousuarios/Listar',configuracion).then(function(response){
                proyectousuarioArray=response.data;
                proyectousuarioArray.map(function(x){
                    me.proyectousuarios.push({usuarioid: x.usuaroid, proyectoid: x.proyectoid, tarifaproyectousuario: x.tarifaproyectousuario,
                        costoproyectousuario: x.costoproyectousuario, notas: x.notas, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Grupos/Listar',configuracion).then(function(response){
                gruposArray=response.data;
                gruposArray.map(function(x){
                    me.grupos.push({nombre: x.nombre, value:x.id});
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
            axios.get('api/Proyectogrupos/Listar',configuracion).then(function(response){
                proyectogrupoArray=response.data;
                proyectogrupoArray.map(function(x){
                    me.proyectogrupos.push({grupoid: x.grupoid, proyectoid: x.proyectoid, tarifaproyectogrupo: x.tarifaproyectogrupo,
                        costoproyectogrupo: x.costoproyectogrupo, notas: x.notas, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
        },
        async calendario(){
            let me=this;
            me.fdesde = new Date();
            me.fhasta = new Date();
            me.fdesde = new Date(me.fdesde.setMonth(me.fdesde.getMonth() - 2)- (me.fdesde.getTimezoneOffset() * 60000)).toISOString().substr(0,10);
            me.fhasta = new Date(me.fhasta.setMonth(me.fhasta.getMonth() + 1)- (me.fhasta.getTimezoneOffset() * 60000)).toISOString().substr(0,10);
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            await axios.get('api/Calendarios/Listarfechas/'+me.fdesde+'/'+me.fhasta,configuracion).then(function(response){
                me.fechas=response.data;
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            this.setHeaders(new Date());
            this.buildWeek();
            this.setItems("Date",new Date());
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
            this.userdialog = false;
            this.dialog = true
        },
        deleteItem (item) {
            var me=this;
            var resulta = confirm('Esta seguro de querer borrar el registro?');
            if (resulta) {
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Registros/Eliminar/'+item.id,configuracion).then( () => {
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
        tratarProyectos(item){
            var me=this;
            let index = 0;
            for (var l = 0; l < me.proyectos.length; l++){
                me.proyectos[l].selected = false;
                me.proyectos[l].relid = 0;
                me.proyectos[l].estimadotarifa = 0;
                me.proyectos[l].estimadomonto = 0;
                me.proyectos[l].estimadohoras = 0;
                me.proyectos[l].notas = '';
            };
            for (var i = 0; i < me.proyectotareas.length; i++){
                if (me.proyectotareas[i].tareaid === item.id){
                    index = me.proyectos.findIndex(elemento => elemento.value === me.proyectotareas[i].proyectoid );
                    me.proyectos[index].selected = true;
                    me.proyectos[index].relid = me.proyectotareas[i].value;
                    me.proyectos[index].estimadotarifa = (me.proyectotareas[i].estimadomonto / me.proyectotareas[i].estimadohoras).toFixed(2);
                    me.proyectos[index].estimadomonto = me.proyectotareas[i].estimadomonto;
                    me.proyectos[index].estimadohoras  = me.proyectotareas[i].estimadohoras;
                    me.proyectos[index].notas          = me.proyectotareas[i].notas;
                }
            };
            me.workgroupId = item.id;
            me.userheader = 'Proyectos vinculados a ' + item.nombre;
            me.userdialog=!me.userdialog;
        },
        accionProyecto(item){
            var me=this;
            let index = 0;
            index = me.proyectos.findIndex(elemento => elemento.value === item.value );
            if (item.selected === true ) {
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Proyectotareas/Crear',{
                    'tareaid':this.workgroupId,
                    'proyectoid':item.value,
                    'estimadohoras':item.estimadohoras,
                    'estimadomonto':item.estimadomonto,
                    'notas':item.notas,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.proyectotareas.push({tareaid: response.data.tareaid, proyectoid: response.data.proyectoid, estimadomonto: 0, estimadohoras: 0, estimadotarifa: 0, value: response.data.id});
                    me.proyectos[index].relid = response.data.id;
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
                var indice = me.proyectotareas.find(x => item.value === x.proyectoid && me.workgroupId === x.tareaid).value;
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Proyectotareas/Eliminar/'+indice,configuracion).then( () => {
                    me.proyectotareas = me.proyectotareas.filter(x => x.value != indice);
                    me.proyectos[index].relid = 0;
                    me.proyectos[index].estimadotarifa = 0;
                    me.proyectos[index].estimadohoras = 0;
                    me.proyectos[index].estimadomonto = 0;
                    me.proyectos[index].notas = '';
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
            index = me.proyectotareas.findIndex(elemento => elemento.value === item.relid );
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};

            axios.put('api/Proyectotareas/Actualizar',{
                'Id':item.relid,
                'tareaid':this.workgroupId,
                'proyectoid':item.value,
                'estimadohoras':item.estimadohoras,
                'estimadomonto':item.estimadomonto,
                'notas':item.notas,
                'iduseralta': me.$store.state.usuario.idusuario
            },configuracion).then( () => {
                me.proyectotareas[index].estimadotarifa = (Number(item.estimadomonto) / Number(item.estimadohoras)).toFixed(2);
                me.proyectotareas[index].estimadomonto = Number(item.estimadomonto);
                me.proyectotareas[index].estimadohoras  = Number(item.estimadohoras);
                me.proyectotareas[index].notas          = item.notas;
                me.proyectos[me.proyectos.findIndex(elemento => elemento.value === me.proyectotareas[index].proyectoid )].estimadotarifa = me.proyectotareas[index].estimadotarifa;
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
                this.userdialog = false;
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
                axios.put('api/Registros/Actualizar',{
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
                axios.post('api/Registros/Crear',{
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
   },
  }
</script>
