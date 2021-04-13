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
                        save-text="Guardar"
                        @save="editRegistro(props.item, 'lu')"
                        persistent
                    >
                        {{ props.item.luhoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.luhoras"
                            type="time"
                            label="Editar"
                            single-line
                            clearable
                            prepend-icon="mdi-dots-vertical"
                            @click:prepend="editRegistroFull(props.item, 'lu')"
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                    <v-dialog v-model="ludialog" max-width="400px">
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{formTitle}}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-row dense>
                                        <v-col cols="12" sm="9" md="9">
                                            <v-text-field 
                                            dense
                                            v-model="lufdesde"
                                            type='date'
                                            label="Fecha Desde"
                                            disabled
                                            >
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="3" md="3">
                                            <v-text-field 
                                            dense
                                            v-model="luhdesde"
                                            type='time'
                                            label="Hora Desde"
                                            @change="armaluhoras"
                                            >
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="9" md="9">
                                            <v-text-field 
                                            dense
                                            v-model="lufhasta"
                                            type='date'
                                            label="Fecha Hasta"
                                            @change="armaluhoras"
                                            >
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="3" md="3">
                                            <v-text-field 
                                            dense
                                            v-model="luhhasta"
                                            type='time'
                                            label="Hora Hasta" 
                                            @change="armaluhoras"
                                            >
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="9" md="9"/>
                                        <v-col cols="12" sm="3" md="3">
                                            <v-text-field
                                            dense 
                                            v-model="luhoras"
                                            label="Horas" 
                                            type='time'
                                            disabled
                                            >
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closelu">Cancelar</v-btn>
                                <v-btn color="blue darken-1" text @click="confirmalu(props.item)">Confirmar</v-btn>
                            </v-card-actions>
                            </v-card>
                    </v-dialog>
                </template>
                <template v-slot:[`item.mahoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.mahoras"
                        large
                        cancel-text="Salir"
                        save-text="Guardar"
                        @save="editRegistro(props.item, 'ma')"
                        persistent
                    >
                        {{ props.item.mahoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.mahoras"
                            type="time"
                            label="Editar"
                            single-line
                            clearable
                            prepend-icon="mdi-dots-vertical"
                            @click:prepend="editRegistroFull(props.item, 'ma')"
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
        fdesde: new Date(), fhasta: new Date(),
        menulu1: false, menuma1: false, menumi1: false, menuju1: false, menuvi1: false, menusa1: false, menudo1: false,
        menulu2: false, menuma2: false, menumi2: false, menuju2: false, menuvi2: false, menusa2: false, menudo2: false,
        ludialog: false, madialog: false, midialog: false, judialog: false, vidialog: false, sadialog: false, dodialog: false,
        max256chars: v => v.length <= 256 || 'Demasiado largo!',
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
        stlu:0,
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
        empresas:[],
        clientes:[],
        proyectousuarios:[],
        proyectogrupos:[],
        tareas:[],
        proyectotareas:[],
        workgroupId:'',
        imageUrl:'',
        userheader: '',
        dialog: false,
        userdialog: false,
        lufdesde: '', mafdesde: '', mifdesde: '', jufdesde: '', vifdesde: '', safdesde: '', dofdesde: '',
        luhdesde: '', mahdesde: '', mihdesde: '', juhdesde: '', vihdesde: '', sahdesde: '', dohdesde: '',
        lufhasta: '', mafhasta: '', mifhasta: '', jufhasta: '', vifhasta: '', safhasta: '', dofhasta: '',
        luhhasta: '', mahhasta: '', mihhasta: '', juhhasta: '', vihhasta: '', sahhasta: '', dohhasta: '',
        luhoras:'', mahoras:'', mihoras:'', juhoras:'', vihoras:'', sahoras:'', dohoras:'',
        totalLun:'', totalMar:'', totalMie:'', totalJue:'', totalVie:'', totalSab:'', totalDom:'', totalGral:'',
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
        headersregistros(){
            return [
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
                ]
        },
        headersproyectos(){
            return [
                    { text: '#', value: 'selected', align: 'center', sortable: false },
                    { text: '[Opciones]', value: 'actions', align: 'center', sortable: false },
                    { text: 'Proyecto', value: 'proyecto', align: 'start', sortable: false },
                    { text: 'Tarea', value: 'tarea', align: 'end', sortable: true },
                    { text: 'Est.Tarifa', value: 'estimadotarifa', align: 'end', sortable: true },
                    { text: 'Est.Monto', value: 'estimadomonto', align: 'end', sortable: true },
                    { text: 'Notas', value: 'notas', align: 'start', sortable: true },
                ]
        },
        formTitle () {
            let me=this;
            var title='';
            switch (this.editedIndex){
                case 1: {
                    title = 'Detalle horario dia ' + me.headersregistros[3].text;
                }
            }
            return title
        },
        calcularStLu: function(){
            var msec = 0;
            var aux = 0;
            for (let index = 0; index < this.registros.length; index++) {
                aux = new Date(new Date(this.registros[index].lufhhasta).getTime() - new Date(this.registros[index].lufhhasta).getTimezoneOffset() * 60000) 
                    - new Date(new Date(this.registros[index].lufhdesde).getTime() - new Date(this.registros[index].lufhdesde).getTimezoneOffset() * 60000);
                msec += aux?aux:0;
            };
            var mins = Math.floor(msec / 60000);
            var hrs = Math.floor(mins / 60);
            mins = mins % 60;
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
        this.calendario();
        this.listar();
        this.position();
        this.select();
    },
    methods: {
        nextsem(){
            var index = this.semanas.findIndex(x => x.value == this.semana);
            (index<this.semanas.length)?index++:index;
            this.semana=this.semanas[index].value;
            this.setHeaders(new Date(this.semanas[index].lun))
            this.setItems("Week");
        },
        prevsem(){
            var index = this.semanas.findIndex(x => x.value == this.semana);
            (index>0)?index--:index;
            this.semana=this.semanas[index].value;
            this.setHeaders(new Date(this.semanas[index].lun))
            this.setItems("Week");
        },
        inputsem(){
            var index = this.semanas.findIndex(x => x.value == this.semana);
            this.semana=this.semanas[index].value;
            this.setHeaders(new Date(this.semanas[index].lun))
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
                me.semana = me.fechas.find(x => x.fecha.substr(0,10) === day).snum;
            }
            var lun = me.semanas[me.semanas.findIndex(x => x.value == me.semana)].lun
            var mar = new Date(new Date(lun).setDate(new Date(lun).getDate()+1));
            mar = new Date(mar.getTime() - mar.getTimezoneOffset() * 60000).toISOString().substr(0,19);
            var mie = new Date(new Date(lun).setDate(new Date(lun).getDate()+2));
            mie = new Date(mie.getTime() - mie.getTimezoneOffset() * 60000).toISOString().substr(0,19);
            var jue = new Date(new Date(lun).setDate(new Date(lun).getDate()+3));
            jue = new Date(jue.getTime() - jue.getTimezoneOffset() * 60000).toISOString().substr(0,19);
            var vie = new Date(new Date(lun).setDate(new Date(lun).getDate()+4));
            vie = new Date(vie.getTime() - vie.getTimezoneOffset() * 60000).toISOString().substr(0,19);
            var sab = new Date(new Date(lun).setDate(new Date(lun).getDate()+5));
            sab = new Date(sab.getTime() - sab.getTimezoneOffset() * 60000).toISOString().substr(0,19);
            var dom = me.semanas[me.semanas.findIndex(x => x.value == me.semana)].dom
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
                    luhoras: '', mahoras: '', mihoras: '', juhoras: '', vihoras: '', sahoras: '', dohoras: '',
                    lufecregistracion: lun, mafecregistracion: mar, mifecregistracion: mie, jufecregistracion: jue, vifecregistracion: vie,
                    safecregistracion: sab, dofecregistracion: dom
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
                        me.registros[index].lufhdesde = new Date(new Date(registrosArray[i].fhdesde).getTime() - new Date(registrosArray[i].fhdesde).getTimezoneOffset() * 60000 ).toISOString();
                        me.registros[index].lufhhasta = new Date(new Date(registrosArray[i].fhhasta).getTime() - new Date(registrosArray[i].fhhasta).getTimezoneOffset() * 60000 ).toISOString();
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
            var empresasArray=[];
            var clientesArray=[];
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
            axios.get('api/Empresas/Listar',configuracion).then(function(response){
                empresasArray=response.data;
                empresasArray.map(function(x){
                    me.empresas.push({costodefault: x.costodefault, tarifadefault: x.tarifadefault, nombre: x.nombre, value:x.id});
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
                    me.clientes.push({tarifadefault: x.tarifadefault, nombre: x.nombre,
                    value:x.id});
                });
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
            axios.get('api/Proyectos/Listar',configuracion).then(function(response){
                proyectosArray=response.data;
                proyectosArray.map(function(x){
                    me.proyectos.push({value:x.id, text: x.nombre, tarifadefault: x.tarifadefault, clienteid:x.clienteid, empresaid:x.empresaid, 
                    facturable: x.facturable, reservado:x.reservado});
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
        editRegistro(item, dia){
            var me=this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            debugger
            switch(dia){
                case 'lu' : {
                    if (!item.luhoras){
                        var indice = item.luid;
                        axios.delete('api/Registros/Eliminar/'+indice,configuracion).then( () => {
                            let itemIndex = me.registros.indexOf(item);
                            me.registros[itemIndex].luhoras = '';
                            var fhaux = new Date(item.lufecregistracion).toISOString();
                            me.registros[itemIndex].lufhdesde = fhaux;
                            me.registros[itemIndex].lufhhasta = fhaux;
                            me.registros[itemIndex].lutarifa = 0;
                            me.registros[itemIndex].lucosto = 0;
                            me.registros[itemIndex].luid = '';
                            me.registrosAll = me.registrosAll.filter(x => x.id != indice);
                            let editedItem = me.registros[itemIndex];
                            me.registros.splice(itemIndex, 1, editedItem);
                            me.snacktext = 'Eliminacion exitosa';
                            me.snackcolor = "success";
                            me.snackbar = true;
                            me.setItems("Week");
                        }).catch(function(error){
                            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                            me.snackcolor = "error";
                            me.snackbar = true;
                            console.log(error);
                        });

                    } else if (item.luid){
                        var index = '';
                        var a = item.luhoras.split(':')
                        var luminutos = (+a[0] * 60 + (+a[1]));
                        debugger
                        item.lufhhasta = new Date(new Date(item.lufhdesde).getTime() 
                                                + luminutos * 60000).toISOString();
                        item.lulathasta = me.latitude;
                        item.lulonghasta = me.longitude;
                        axios.put('api/Registros/Actualizarhoras',{
                            'Id':item.luid,
                            'fhdesde':item.lufhdesde,
                            'fhhasta':item.lufhhasta,
                            'minutos':luminutos,
                            'latdesde':item.lulatdesde,
                            'longdesde':item.lulongdesde,
                            'lathasta':item.lulathasta,
                            'longhasta':item.lulonghasta,
                            'iduserumod': me.$store.state.usuario.idusuario
                        },configuracion).then( () => {
                            index = me.registrosAll.findIndex(x => x.id == item.luid);
                            me.registrosAll[index].fhdesde = item.lufhdesde;
                            me.registrosAll[index].fhhasta = item.lufhhasta;
                            me.registrosAll[index].minutos = luminutos;
                            let itemIndex = me.registros.indexOf(item);
                            let editedItem = me.registros[itemIndex];
                            me.registros.splice(itemIndex, 1, editedItem);
                            me.snacktext = 'Modificacion exitosa';
                            me.snackcolor = "success";
                            me.snackbar = true;
                            me.setItems("Week");
                        }).catch(function(error){
                            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                            me.snackbar = true;
                            me.snackcolor = 'error'
                            console.log(error);
                        });
                    } else {
                        item.lufhdesde = new Date(new Date(item.lufecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.lufecregistracion).getTimezoneOffset() * 60000).toISOString();
                        item.lulatdesde = me.latitude;
                        item.lulongdesde = me.longitude; 
                        item.lulathasta = me.latitude;
                        item.lulonghasta = me.longitude;
                        var a = item.luhoras.split(':')
                        var luminutos = (+a[0] * 60 + (+a[1]));
                        item.lufhhasta = new Date(new Date(item.lufhdesde).getTime() + luminutos * 60000 - new Date(item.lufhdesde).getTimezoneOffset() * 60000).toISOString();
                        var tarifa = me.determinaTarifa(item.proyectoid, item.usuarioid);
                        var costo = me.determinaCosto(item.proyectoid, item.usuarioid);
                        axios.post('api/Registros/Crear',{
                            'actividad': '',
                            'usuarioid': item.usuarioid,
                            'proyectoid': item.proyectoid,
                            'tareaid': item.tareaid,
                            'fecregistracion': item.lufecregistracion.substr(0,10),
                            'facturable': me.proyectos.find(x => x.value == item.proyectoid).facturable,
                            'liquidable': true,
                            'fhdesde': item.lufhdesde,
                            'fhhasta': item.lufhhasta,
                            'minutos':luminutos,
                            'latdesde':item.lulatdesde,
                            'longdesde':item.lulongdesde,
                            'lathasta':item.lulathasta,
                            'longhasta':item.lulonghasta,
                            'tarifa': tarifa,
                            'costo': costo,
                            'facturado': false,
                            'iduserfact': '',
                            'fhfact': '',
                            'liquidado': false,
                            'iduserliqui': '',
                            'fhliqui': '',
                            'iduseralta': me.$store.state.usuario.idusuario
                        },configuracion).then( function(response) {
                            me.registrosAll.push(response.data);
                            var index = me.registros.findIndex(x => x.usuarioid === item.usuarioid &&
                                                                x.proyectoid == item.proyectoid &&
                                                                x.tareaid == item.tareaid);
                            me.registros[index].lufacturable = me.proyectos.find(x => x.value == item.proyectoid).facturable;
                            me.registros[index].luliquidable = true;
                            me.registros[index].lufhdesde = item.lufhdesde;
                            me.registros[index].lufhhasta = item.lufhhasta;
                            me.registros[index].luhoras = item.luhoras;
                            me.registros[index].luid = response.data.id;
                            me.registros[index].lulatdesde = item.lulatdesde;
                            me.registros[index].lulongdesde = item.lulongdesde;
                            me.registros[index].lulathasta = item.lulathasta;
                            me.registros[index].lulonghasta = item.lulonghasta;
                            me.registros[index].luliquidable = item.luliquidable;
                            me.registros[index].lutarifa = item.lutarifa;
                            let itemIndex = me.registros.indexOf(item);
                            let editedItem = me.registros[itemIndex];
                            me.registros.splice(itemIndex, 1, editedItem);
                            me.snacktext = 'Creacion exitosa';
                            me.snackcolor = "success";
                            me.snackbar = true;
                            me.setItems("Week");
                        }).catch(function(error){
                            me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                            me.snackbar = true;
                            me.snackcolor = 'error'
                            console.log(error);
                        });
                    }
                    break
                }
                case 'ma' : {
                    if (item.maid){
                        var a = item.mahoras.split(':')
                        var maminutos = (+a[0] * 60 + (+a[1]));
                        item.mafhhasta = new Date(new Date(item.mafhdesde).getTime() + maminutos * 60000 - new Date(item.mafhdesde).getTimezoneOffset() * 60000);
                        item.malathasta = me.latitude;
                        item.malonghasta = me.longitude; 
                        axios.put('api/Registros/Actualizarhoras',{
                            'Id':item.maid,
                            'fhdesde':item.mafhdesde,
                            'fhhasta':item.mafhhasta,
                            'minutos':maminutos,
                            'latdesde':item.malatdesde,
                            'longdesde':item.malongdesde,
                            'lathasta':item.malathasta,
                            'longhasta':item.malonghasta,
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
                        item.malatdesde = me.latitude;
                        item.malongdesde = me.longitude; 
                        item.mafhdesde = new Date(new Date(item.mafecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.mafecregistracion).getTimezoneOffset() * 60000 ).toISOString();
                        var a = item.mahoras.split(':')
                        var maminutos = (+a[0] * 60 + (+a[1]));
                        item.mafhhasta = new Date(new Date(item.mafhdesde).getTime() + maminutos * 60000 - new Date(item.mafhdesde).getTimezoneOffset() * 60000 ).toISOString();
                        item.malathasta = me.latitude;
                        item.malonghasta = me.longitude;
                        var tarifa = this.determinaTarifa(item.proyectoid, item.usuarioid);
                        var costo = this.determinaCosto(item.proyectoid, item.usuarioid);
                        axios.post('api/Registros/Crear',{
                            'actividad': '',
                            'usuarioid': item.usuarioid,
                            'proyectoid': item.proyectoid,
                            'tareaid': item.tareaid,
                            'fecregistracion': item.mafecregistracion.substr(0,10),
                            'facturable': this.proyectos.find(x => x.value == item.proyectoid).facturable,
                            'liquidable': true,
                            'fhdesde':new Date(item.mafhdesde),
                            'fhhasta': new Date(item.mafhhasta),
                            'minutos':maminutos,
                            'latdesde':item.malatdesde,
                            'longdesde':item.malongdesde,
                            'lathasta':item.malathasta,
                            'longhasta':item.malonghasta,
                            'tarifa': tarifa,
                            'costo': costo,
                            'facturado': false,
                            'iduserfact': '',
                            'fhfact': '',
                            'liquidado': false,
                            'iduserliqui': '',
                            'fhliqui': '',
                            'iduseralta': me.$store.state.usuario.idusuario
                        },configuracion).then( () => {
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
                    break
                }
            }
        },
        armaluhoras(){
            let me=this;
            var msec = 0, mins = 0, hrs = 0;
            if (me.lufhasta < me.lufdesde) {
                me.lufhasta = me.lufdesde;
            }
            if (me.lufhasta == me.lufdesde) {
                if (me.luhhasta < me.luhdesde) {
                    me.luhhasta = me.luhdesde;
                }
            }
            if (me.lufhasta > me.lufdesde) {
                me.lufhasta = new Date(new Date(me.lufdesde).getTime()
                            + 24 * 60 * 60 * 1000).toISOString().substr(0,10);
                if (me.luhhasta > me.luhdesde) {
                    me.luhhasta = new Date(new Date(me.lufhasta + ' ' + me.luhdesde).getTime() 
                            - new Date(me.lufhasta + ' ' + me.luhdesde).getTimezoneOffset() * 60000
                            - 1 * 60 * 1000).toISOString().substr(11,5);
                }
            }
            msec = new Date(me.lufhasta + ' '+ me.luhhasta).getTime() - new Date(me.lufdesde + ' ' + me.luhdesde).getTime();
            mins = Math.floor(msec / 60000);
            hrs = Math.floor(mins / 60);
            mins = mins % 60;
            if (hrs >= 24) {
                me.luhhasta = me.luhdesde;
                lu.horas = "24:00";
            } 
            me.luhoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
        },
        confirmalu(item){
            let me=this;
            item.lufhdesde = me.lufdesde + 'T' + me.luhdesde;
            item.lufhhasta = me.lufhasta + 'T' + me.luhhasta;
            item.luhoras = me.luhoras;
            this.closelu();
        },
        closelu () {
            this.ludialog = false
        },
        editRegistroFull(item,dia){
            var me=this;
            switch (dia){
                case 'lu' : {
                    me.lufdesde=item.lufhdesde.substr(0,10);
                    me.luhdesde=item.lufhdesde.substr(11,5);
                    me.lufhasta=item.lufhhasta.substr(0,10);
                    me.luhhasta=item.lufhhasta.substr(11,5);
                    me.luhoras=item.luhoras;
                    me.ludialog=true;
                    me.editedIndex=1;
                    break
                }
            }
        },
        determinaTarifa(proid,usuid){
            var index1 = this.proyectos.findIndex(x => x.value == proid);
            var auxtarifa = this.empresas.find(x => x.value == this.proyectos[index1].empresaid).tarifadefault;
            var tarifa = auxtarifa>0?auxtarifa:0;
            var index2 = this.clientes.findIndex(x => x.value == this.proyectos[index1].clienteid);
            if (index2>-1){
                auxtarifa = this.clientes.find(x => x.value == this.proyectos[index1].clienteid).tarifadefault;
                tarifa = auxtarifa>0?auxtarifa:tarifa;
            } 
            if (this.proyectos[index1].tarifadefault > 0 ){
                auxtarifa = this.proyectos[index1].tarifadefault;
                tarifa = auxtarifa>0?auxtarifa:tarifa;
            }
            var proygrupArray = this.proyectogrupos.find(x => x.proyectoid == proid);
            for (var i=0; i<proygrupArray.length;i++){
                var grupusuArray = this.grupousuarios.find(x => x.grupoid == proygrupArray[i].grupoid && x.usuarioid == usuid);
                for (var ii=0; ii<grupusuArray.length; ii++){
                    if (grupusuArray[ii].usuarioid == proygrupArray[i].usuarioid) {
                        if (this.proyectogrupos[i].tarifaproyectogrupo>0 && this.proyectogrupos[i].tarifaproyectogrupo > tarifa){    
                            auxtarifa = this.proyectogrupos[i].tarifaproyectogrupo;
                            tarifa = auxtarifa>0?auxtarifa:tarifa;
                        }
                    } 
                }
            }
            var index2 = this.proyectousuarios.findIndex(x => x.usuarioid == usuid && x.proyectoid == proid);
            if (index2 > -1 && this.proyectousuarios[index2].tarifadefault > 0){
                auxtarifa = this.proyectousuarios[index2].tarifadefault;
                tarifa = auxtarifa>0?auxtarifa:tarifa;
            }
            return(tarifa)
        },
        determinaCosto(proid,usuid){
            var index1 = this.proyectos.findIndex(x => x.value == proid);
            var auxcosto = this.empresas.find(x => x.value == this.proyectos[index1].empresaid).costodefault;
            var costo = auxcosto>0?auxcosto:0;
            var proygrupArray = this.proyectogrupos.find(x => x.proyectoid == proid);
            for (var i=0; i<proygrupArray.length;i++){
                var grupusuArray = this.grupousuarios.find(x => x.grupoid == proygrupArray[i].grupoid && x.usuarioid == usuid);
                for (var ii=0; ii<grupusuArray.length; ii++){
                    if (grupusuArray[ii].usuarioid == proygrupArray[i].usuarioid) {
                        if (this.proyectogrupos[i].costoproyectogrupo>0 && this.proyectogrupos[i].costoproyectogrupo > costo){    
                            auxcosto = this.proyectogrupos[i].costoproyectogrupo;
                            costo = auxcosto>0?auxcosto:costo;
                        }
                    } 
                }
            }
            var index2 = this.proyectousuarios.findIndex(x => x.usuarioid == usuid && x.proyectoid == proid);
            if (index2 > -1 && this.proyectousuarios[index2].costodefault > 0){
                costo = this.proyectousuarios[index2].costodefault;
            }
            return(costo)
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
        }
   },
  }
</script>
