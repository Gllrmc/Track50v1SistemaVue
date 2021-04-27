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
            :headers="headersproyecto"
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
                                        <v-text-field 
                                        dense 
                                        v-model="nombre" 
                                        label="Proyecto" 
                                        counter="50">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-select 
                                        dense 
                                        v-model="clienteid"
                                        :items = "clientes" 
                                        label = "Cliente"
                                        clearable>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field dense 
                                        v-model="tarifadefault" 
                                        type="number" 
                                        label="Tarifa x omision">
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
                                    <v-col cols="12" sm="4" md="4">
                                        <v-switch dense v-model="facturable"
                                        flat
                                        label="Facturable?"
                                        ></v-switch>                                    
                                    </v-col>
                                    <v-col cols="12" sm="4" md="4">
                                        <v-switch dense v-model="liquidable"
                                        flat
                                        label="Liquidable?"
                                        ></v-switch>                                    
                                    </v-col>
                                    <v-col cols="12" sm="4" md="4">
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
                            @click="tratarTareas(item)"
                            >
                            mdi-file-tree
                            </v-icon>
                        </template>
                        <span>Tareas</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="tratarUsuarios(item)"
                            >
                            mdi-account-hard-hat
                            </v-icon>
                        </template>
                        <span>Personas</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="tratarGrupos(item)"
                            >
                            mdi-account-group
                            </v-icon>
                        </template>
                        <span>Grupos</span>
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
                <v-chip class="ma-2" :text-color="item.coltexto" :color="item.colfondo">{{item.nombre}}</v-chip>
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
            <template v-slot:[`item.liquidable`]="{ item }">
                <td>
                    <div v-if="item.liquidable">
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
        <v-col cols="12" md="6" sm="3">
            <v-dialog v-model="taskdialog" max-width="750px">
                <v-data-table
                dense
                :headers="headerstareas"
                :items="tareas"
                :search="searcht"
                class="elevation-1"
                no-data-text="Nada para mostrar"
                >
                    <template v-slot:top>
                        <v-card flat color="white">
                            <v-card-title>{{taskheader}}</v-card-title>
                            <v-card-actions>
                                <v-row>
                                    <v-col cols="12" md="6" sm="6">
                                        <v-text-field label="Búsqueda" class="ma-2" 
                                        outlined 
                                        dense 
                                        v-model="searcht" 
                                        append-icon="search" 
                                        single-line 
                                        hide-details
                                        clearable 
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="5" sm="5">
                                        <v-text-field 
                                            label="Agregar tarea"
                                            class="ma-2"
                                            outlined 
                                            dense 
                                            hide-details
                                            v-model="addtask"
                                            clearable
                                            counter="50"
                                            append-icon="mdi-plus-circle"
                                            @click:append="agregarTarea(addtask)"
                                            ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-btn color="primary" dense dark class="ma-2" @click.native="taskdialog=false">Salir</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                    <template v-slot:[`item.selected`]="{ item }">
                        <v-simple-checkbox
                            v-model="item.selected"
                            :ripple="false"
                            @click="accionTarea(item)"
                        ></v-simple-checkbox>
                    </template>
                    <template v-slot:[`item.estimadomonto`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.estimadomonto"
                            large
                            cancel-text="Salir"
                            save-text="Grabar"
                            persistent
                            @save="editTareas(props.item)"
                            @cancel="cancel"
                            >
                            {{ props.item.estimadomonto }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.estimadomonto"
                                type="number"
                                label="Editar"
                                single-line
                                counter
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.estimadotarifa`]="{ item }">
                        <div v-if="item.selected" class="d-flex align-end flex-column">
                            <td>{{ Number(item.estimadotarifa).toFixed(2)}}</td>
                        </div>
                    </template>
                    <template v-slot:[`item.estimadohoras`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.estimadohoras"
                            large
                            cancel-text="Salir"
                            save-text="Grabar"
                            @save="editTareas(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.estimadohoras }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.estimadohoras"
                                type="number"
                                label="Editar"
                                single-line
                                counter
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.notas`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.notas"
                            large
                            cancel-text="Salir"
                            save-text="Grabar"
                            @save="editTareas(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.notas }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.notas"
                                counter="256"
                                label="Editar"
                                single-line
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
            <v-dialog v-model="userdialog" max-width="750px">
                <v-data-table
                dense
                :headers="headersusuarios"
                :items="usuarios"
                :search="searchu"
                class="elevation-1"
                no-data-text="Nada para mostrar"
                >
                    <template v-slot:top>
                        <v-card flat color="white">
                            <v-card-title>{{userheader}}</v-card-title>
                            <v-card-actions>
                                <v-row>
                                    <v-col cols="12" md="8" sm="8">
                                        <v-text-field label="Búsqueda" class="ma-2" 
                                        outlined 
                                        dense 
                                        v-model="searchu" 
                                        append-icon="search" 
                                        single-line 
                                        hide-details
                                        clearable 
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-btn color="primary" dense dark class="ma-2" @click.native="userdialog=false">Salir</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                    <template v-slot:[`item.selected`]="{ item }">
                        <v-simple-checkbox
                            v-model="item.selected"
                            :ripple="false"
                            @click="accionUsuario(item)"
                        ></v-simple-checkbox>
                    </template>

                    <template v-slot:[`item.tarifaproyectousuario`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.tarifaproyectousuario"
                            large
                            cancel-text="Salir"
                            save-text="Grabar"
                            @save="editUsuario(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.tarifaproyectousuario }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.tarifaproyectousuario"
                                type="number"
                                label="Editar"
                                single-line
                                counter
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.costoproyectousuario`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.costoproyectousuario"
                            large
                            cancel-text="Salir"
                            save-text="Grabar"
                            @save="editUsuario(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.costoproyectousuario }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.costoproyectousuario"
                                type="number"
                                label="Editar"
                                single-line
                                counter
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.notas`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.notas"
                            large
                            cancel-text="Salir"
                            save-text="Grabar"
                            @save="editUsuario(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.notas }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.notas"
                                counter="256"
                                label="Editar"
                                single-line
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
            <v-dialog v-model="groupdialog" max-width="750px">
                <v-data-table
                dense
                :headers="headersgrupos"
                :items="grupos"
                :search="searchg"
                class="elevation-1"
                no-data-text="Nada para mostrar"
                >
                    <template v-slot:top>
                        <v-card flat color="white">
                            <v-card-title>{{groupheader}}</v-card-title>
                            <v-card-actions>
                                <v-row>
                                    <v-col cols="12" md="6" sm="6">
                                        <v-text-field label="Búsqueda" class="ma-2" 
                                        outlined 
                                        dense 
                                        v-model="searchg" 
                                        append-icon="search" 
                                        single-line 
                                        hide-details
                                        clearable 
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="5" sm="5">
                                        <v-text-field 
                                            label="Agregar grupo"
                                            class="ma-2"
                                            outlined 
                                            dense 
                                            hide-details
                                            v-model="addgroup"
                                            clearable
                                            counter="50"
                                            append-icon="mdi-plus-circle"
                                            @click:append="agregarGrupo(addgroup)"
                                            ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-btn color="primary" dense dark class="ma-2" @click.native="groupdialog=false">Salir</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                    <template v-slot:[`item.selected`]="{ item }">
                        <v-simple-checkbox
                            v-model="item.selected"
                            :ripple="false"
                            @click="accionGrupo(item)"
                        ></v-simple-checkbox>
                    </template>
                    <template v-slot:[`item.tarifaproyectogrupo`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.tarifaproyectogrupo"
                            large
                            cancel-text="Salir"
                            save-text="Grabar"
                            persistent
                            @save="editGrupo(props.item)"
                            @cancel="cancel"
                        >
                            {{ props.item.tarifaproyectogrupo }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.tarifaproyectogrupo"
                                type="number"
                                label="Editar"
                                single-line
                                counter
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.costoproyectogrupo`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.costoproyectogrupo"
                            large
                            cancel-text="Salir"
                            save-text="Grabar"
                            @save="editGrupo(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.costoproyectogrupo }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.costoproyectogrupo"
                                type="number"
                                label="Editar"
                                single-line
                                counter
                                clearable
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.notas`]="props">
                        <v-edit-dialog
                            v-if="props.item.selected"  
                            :return-value.sync="props.item.notas"
                            large
                            cancel-text="Salir"
                            save-text="Grabar"
                            @save="editGrupo(props.item)"
                            @cancel="cancel"
                            persistent
                        >
                            {{ props.item.notas }}
                            <template v-if="props.item.selected" v-slot:input>
                                <v-text-field
                                dense
                                v-model="props.item.notas"
                                counter="256"
                                label="Editar"
                                single-line
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
        usuarios:[],
        empresas: [],
        clientes:[],
        proyectos:[],
        tareas:[],
        proyectotareas:[],
        proyectousuarios:[],
        grupos:[],
        proyectogrupos:[],
        taskheader:'',
        userheader:'',
        groupheader:'',
        userdialog: false,
        taskdialog: false,
        groupdialog: false,
        dialog: false,
        headersproyecto: [
            { text: '[Opciones]', value: 'actions', align: 'center', sortable: false },
            { text: 'Proyecto', value: 'nombre', align: 'start', sortable: true },
            { text: 'Cliente', value: 'cliente', align: 'start', sortable: true },
            { text: 'Facturable?', value: 'facturable', align: 'start', sortable: true },
            { text: 'Liquidable?', value: 'liquidable', align: 'start', sortable: true },
            { text: 'Tarifa default', value: 'tarifadefault', align: 'start', sortable: true },
            { text: 'Reservado?', value: 'reservado', align: 'start', sortable: true },
            { text: 'Cargas desde', value: 'fecregdesde', align: 'start', sortable: true },
            { text: 'Ult.Facturacion', value: 'fecultfact', align: 'start', sortable: true },
            { text: 'Ult.Liquidacion', value: 'fecultliqui', align: 'start', sortable: true },
            { text: 'Estado', value: 'activo', align: 'start', sortable: true  }
//            { text: 'Empresa', value: 'empresa', align: 'start', sortable: true },
        ],
        headerstareas: [
            { text: '#', value: 'selected', align: 'center', sortable: false },
            { text: 'Nombre tarea', value: 'nombre', align: 'start', sortable: true },
            { text: 'Est.Horas', value: 'estimadohoras', align: 'end', sortable: true },
            { text: 'Est.Tarifa', value: 'estimadotarifa', align: 'end', sortable: true },
            { text: 'Est.Monto', value: 'estimadomonto', align: 'end', sortable: true },
            { text: 'Notas', value: 'notas', align: 'start', sortable: true },
            //{ text: 'Estado', value: 'activo', align: 'start', sortable: true  },
            //{ text: 'Creador Id', value: 'iduseralta', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Creación', value: 'fecalta', align: 'start', sortable: true },
            //{ text: 'Mod. Id', value: 'iduserumod', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Ult.Mod.', value: 'fecumod', align: 'start', sortable: true }                   
        ],
        headersusuarios: [
            { text: '#', value: 'selected', align: 'center', sortable: false },
            { text: 'Persona', value: "email", align: 'start', sortable: true },
            { text: 'Tarifa', value: 'tarifaproyectousuario', align: 'end', sortable: true },
            { text: 'Costo', value: 'costoproyectousuario', align: 'end', sortable: true },
            { text: 'Notas', value: 'notas', align: 'start', sortable: true },
            //{ text: 'Estado', value: 'activo', align: 'start', sortable: true  },
            //{ text: 'Creador Id', value: 'iduseralta', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Creación', value: 'fecalta', align: 'start', sortable: true },
            //{ text: 'Mod. Id', value: 'iduserumod', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Ult.Mod.', value: 'fecumod', align: 'start', sortable: true }                   
        ],
        headersgrupos: [
            { text: '#', value: 'selected', align: 'center', sortable: false },
            { text: 'Nombre grupo', value: 'nombre', align: 'start', sortable: true },
            { text: 'Tarifa', value: 'tarifaproyectogrupo', align: 'end', sortable: true },
            { text: 'Costo', value: 'costoproyectogrupo', align: 'end', sortable: true },
            { text: 'Notas', value: 'notas', align: 'start', sortable: true },
            //{ text: 'Estado', value: 'activo', align: 'start', sortable: true  },
            //{ text: 'Creador Id', value: 'iduseralta', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Creación', value: 'fecalta', align: 'start', sortable: true },
            //{ text: 'Mod. Id', value: 'iduserumod', align: 'center', sortable: true },
            //{ text: 'Fecha Hora Ult.Mod.', value: 'fecumod', align: 'start', sortable: true }                   
        ],
        search: '',
        searchu: '',
        searcht: '',
        searchg: '',
        editedIndex: -1,
        id: '',
        nombre: '',
        empresaid: '',
        empresa: '',
        clienteid: '',
        cliente: '',
        facturable: true,
        liquidable: true,
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
        addtask: '',
        addgroup: '',
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
        save () {
        },
        cancel () {
        },
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
            var gruposArray=[];
            var proyectogruposArray=[];
            var empresasArray=[];
            var clientesArray=[];
            var tareasArray=[];
            var proyectotareasArray=[];
            var proyectousuariosArray=[];
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Usuarios/Listar',configuracion).then(function(response){
                usuariosArray=response.data;
                usuariosArray.map(function(x){
                    me.usuarios.push({selected: false,iduseralta: x.iduseralta, iduserumod: x.iduserumod,
                    imgusuario: x.imgusuario, colfondo: x.colfondo, coltexto: x.coltexto, 
                    tarifaproyectousuario: 0, costoproyectousuario: 0,
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
                    me.empresas.push({iduseralta: x.iduseralta, iduserumod: x.iduserumod,monedadefault: x.monedadefault, tarifadefault: x.tarifadefault, reservadodefaultcolfondo: x.reservadodefault, 
                                facturabledefault: x.facturabledefault, 
                                aceptacargatiempos: x.aceptacargatiempos, aceptacargalapsos: x.aceptacargalapsos, text: x.nombre, value:x.id});
                                if (me.empresas.length > 1){
                        me.headersproyecto.push({"text": 'Empresa', "value": 'empresa', "align": 'start', "sortable": true});
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
            axios.get('api/Tareas/Listar',configuracion).then(function(response){
                tareasArray=response.data;
                tareasArray.map(function(x){
                    me.tareas.push({selected: false, value:x.id, nombre: x.nombre, relid: 0, 
                    estimadohoras:0, estimadomonto:0, estimadotarifa:0, notas:''});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Proyectotareas/Listar',configuracion).then(function(response){
                proyectotareasArray=response.data;
                proyectotareasArray.map(function(x){
                    me.proyectotareas.push({tareaid: x.tareaid, proyectoid: x.proyectoid, estimadohoras: x.estimadohoras,
                        estimadomonto: x.estimadomonto, estimadotarifa: (x.estimadomonto / x.estimadohoras).toFixed(2), 
                        notas: x.notas, value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Proyectousuarios/Listar',configuracion).then(function(response){
                proyectousuariosArray=response.data;
                proyectousuariosArray.map(function(x){
                    me.proyectousuarios.push({proyectoid: x.proyectoid, usuarioid: x.usuarioid, 
                    tarifaproyectousuario: x.tarifaproyectousuario, costoproyectousuario: x.costoproyectousuario, 
                    notas: x.notas, value:x.id});
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
                    me.grupos.push({selected: false, nombre: x.nombre, relid: 0, 
                    tarifaproyectogrupo:0, costoproyectogrupo:0, notas:'', value:x.id});
                });
            }).catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            axios.get('api/Proyectogrupos/Listar',configuracion).then(function(response){
                proyectogruposArray=response.data;
                proyectogruposArray.map(function(x){
                    me.proyectogrupos.push({grupoid: x.grupoid, proyectoid: x.proyectoid,
                    tarifaproyectogrupo: x.tarifaproyectogrupo, costoproyectogrupo: x.costoproyectogrupo, 
                    notas: x.notas, value:x.id});
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
            this.liquidable = item.liquidable;
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
            this.taskdialog = false;
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
        tratarTareas(item){
            var me=this;
            let index = 0;
            for (var l = 0; l < me.tareas.length; l++){
                me.tareas[l].selected = false;
                me.tareas[l].relid = 0;
                me.tareas[l].estimadotarifa = 0;
                me.tareas[l].estimadomonto = 0;
                me.tareas[l].estimadohoras = 0;
                me.tareas[l].notas = '';
            };
            for (var i = 0; i < me.proyectotareas.length; i++){
                if (me.proyectotareas[i].proyectoid === item.id){
                    index = me.tareas.findIndex(elemento => elemento.value === me.proyectotareas[i].tareaid );
                    me.tareas[index].selected = true;
                    me.tareas[index].relid = me.proyectotareas[i].value;
                    me.tareas[index].estimadotarifa = (me.proyectotareas[i].estimadomonto / me.proyectotareas[i].estimadohoras).toFixed(2);
                    me.tareas[index].estimadomonto = me.proyectotareas[i].estimadomonto;
                    me.tareas[index].estimadohoras  = me.proyectotareas[i].estimadohoras;
                    me.tareas[index].notas          = me.proyectotareas[i].notas;
                }
            };
            me.workproyId = item.id;
            me.taskheader = 'Tareas vinculadas a ' + item.nombre;
            me.taskdialog=!me.taskdialog;
        },
        accionTarea(item){
            var me=this;
            let index = 0;
            index = me.tareas.findIndex(elemento => elemento.value === item.value );
            if (item.selected === true ) {
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Proyectotareas/Crear',{
                    'tareaid':item.value,
                    'proyectoid':this.workproyId,
                    'estimadohoras':item.estimadohoras,
                    'estimadomonto':item.estimadomonto,
                    'notas':item.notas,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.proyectotareas.push({tareaid: response.data.tareaid, proyectoid: response.data.proyectoid, estimadomonto: 0, estimadohoras: 0, estimadotarifa: 0, value: response.data.id});
                    me.tareas[index].relid = response.data.id;
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
                var indice = me.proyectotareas.find(x => item.value === x.tareaid && me.workproyId === x.proyectoid).value;
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Proyectotareas/Eliminar/'+indice,configuracion).then( () => {
                    me.proyectotareas = me.proyectotareas.filter(x => x.value != indice);
                    me.tareas[index].relid = 0;
                    me.tareas[index].estimadotarifa = 0;
                    me.tareas[index].estimadohoras = 0;
                    me.tareas[index].estimadomonto = 0;
                    me.tareas[index].notas = '';
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
        editTareas(item){
            var me=this;
            let index=0;
            index = me.proyectotareas.findIndex(elemento => elemento.value === item.relid );
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};

            axios.put('api/Proyectotareas/Actualizar',{
                'Id':item.relid,
                'tareaid':item.value,
                'proyectoid':this.workproyId,
                'estimadohoras':item.estimadohoras,
                'estimadomonto':item.estimadomonto,
                'notas':item.notas,
                'iduseralta': me.$store.state.usuario.idusuario                      
            },configuracion).then( () => {
                me.proyectotareas[index].estimadotarifa = (Number(item.estimadomonto) / Number(item.estimadohoras)).toFixed(2);
                me.proyectotareas[index].estimadomonto = Number(item.estimadomonto);
                me.proyectotareas[index].estimadohoras  = Number(item.estimadohoras);
                me.proyectotareas[index].notas          = item.notas;
                me.tareas[me.tareas.findIndex(elemento => elemento.value === me.proyectotareas[index].tareaid )].estimadotarifa = me.proyectotareas[index].estimadotarifa;
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
        accionUsuario(item){
            var me=this;
            let index = 0;
            index = me.usuarios.findIndex(elemento => elemento.value === item.value );
            if (item.selected === true ) {
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Proyectousuarios/Crear',{
                    'proyectoid':this.workgroupId,
                    'usuarioid':item.value,
                    'tarifaproyectousuario':item.tarifaproyectousuario,
                    'costopropyectousuario':item.costoproyectousuario,
                    'notas':item.notas,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.proyectousuarios.push({proyectoid: response.data.proyectoid, usuarioid: response.data.usuarioid, value: response.data.id});
                    me.usuarios[index].relid = response.data.id;
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
                var indice = me.proyectousuarios.find(x => item.value === x.usuarioid && me.workproyId === x.proyectoid).value;
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Proyectousuarios/Eliminar/'+indice,configuracion).then( () => {
                    me.proyectousuarios = me.proyectousuarios.filter(x => x.value != indice); 
                    me.usuarios[index].relid = 0;
                    me.usuarios[index].tarifaproyectousuario = 0;
                    me.usuarios[index].costoproyectousuario = 0;
                    me.usuarios[index].notas = '';
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
        tratarUsuarios(item){
            var me=this;
            let index = 0;
            for (var l = 0; l < me.usuarios.length; l++){
                me.usuarios[l].selected = false;
                me.usuarios[l].relid = 0;
                me.usuarios[l].tarifaproyectousuario = 0;
                me.usuarios[l].costoproyectousuario = 0;
                me.usuarios[l].notas = ''
            };
            for (let i = 0; i < me.proyectousuarios.length; i++){
                if (me.proyectousuarios[i].proyectoid === item.id){
                    index = me.usuarios.findIndex(elemento => elemento.value === me.proyectousuarios[i].usuarioid )
                    me.usuarios[index].selected = true;
                    me.usuarios[index].relid = me.proyectousuarios[i].value;
                    me.usuarios[index].tarifaproyectousuario = me.proyectousuarios[i].tarifaproyectousuario;
                    me.usuarios[index].costoproyectousuario = me.proyectousuarios[i].costoproyectousuario;
                    me.usuarios[index].notas = me.proyectousuarios[i].notas;

                }
            };
            me.workproyId = item.id;
            me.userheader = 'Usuarios vinculados a ' + item.nombre;
            me.userdialog=!me.userdialog;
        },
        editUsuario(item){
            var me=this;
            let index=0;
            index = me.proyectousuarios.findIndex(elemento => elemento.value === item.relid );
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};

            axios.put('api/Proyectousuarios/Actualizar',{
                'Id':item.relid,
                'usuarioid':item.value,
                'proyectoid':this.workproyId,
                'tarifaproyectousuario':item.tarifaproyectousuario,
                'costoproyectousuario':item.costoproyectousuario,
                'notas':item.notas,
                'iduseralta': me.$store.state.usuario.idusuario                      
            },configuracion).then( () => {
                me.proyectousuarios[index].tarifaproyectousuario = (Number(item.tarifaproyectousuario)).toFixed(2);
                me.proyectousuarios[index].costoproyectousuario = Number(item.costoproyectousuario);
                me.proyectousuarios[index].notas          = item.notas;
                //me.proyectos[me.proyectos.findIndex(elemento => elemento.value === me.proyectousuarios[index].proyectoid )].estimadotarifa = me.proyectotareas[index].estimadotarifa;
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
        agregarTarea(addtask){
            let me=this;
            if(addtask.length >= 3 && addtask.length <= 50 ){
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Tareas/Crear',{
                    'nombre':addtask,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    //console.log(response);
                    me.tareas.push({selected: false, nombre: response.data.nombre, value: response.data.id});
                    me.snacktext = 'Creacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.addtask = "";
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    me.snackcolor = 'error'
                    console.log(error);
                });
            }
        },
        tratarGrupos(item){
            var me=this;
            let index = 0;
            for (var l = 0; l < me.grupos.length; l++){
                me.grupos[l].selected = false;
                me.grupos[l].relid = 0;
                me.grupos[l].tarifaproyectogrupo = 0;
                me.grupos[l].costoproyectogrupo = 0;
                me.grupos[l].notas = ''
            };
            for (let i = 0; i < me.proyectogrupos.length; i++){
                if (me.proyectogrupos[i].proyectoid === item.id){
                    index = me.grupos.findIndex(elemento => elemento.value === me.proyectogrupos[i].grupoid );
                    me.grupos[index].selected = true;
                    me.grupos[index].relid = me.proyectogrupos[i].value;
                    me.grupos[index].tarifaproyectogrupo = me.proyectogrupos[i].tarifaproyectogrupo;
                    me.grupos[index].costoproyectogrupo = me.proyectogrupos[i].costoproyectogrupo;
                    me.grupos[index].notas = me.proyectogrupos[i].notas;
                }
            };
            me.workgroupId = item.id;
            me.groupheader = 'Grupos vinculados a ' + item.nombre;
            me.groupdialog=!me.groupdialog;
        },
        accionGrupo(item){
            var me=this;
            let index = 0;
            index = me.grupos.findIndex(elemento => elemento.value === item.value );
            if (item.selected === true ) {
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Proyectogrupos/Crear',{
                    'grupoid': item.value,
                    'proyectoid': this.workgroupId,
                    'tarifaproyectogrupo':item.tarifaproyectogrupo,
                    'costopropyectogrupo':item.costoproyectogrupo,
                    'notas':item.notas,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    me.proyectogrupos.push({grupoid: response.data.grupoid, proyectoid: response.data.proyectoid, value: response.data.id});
                    me.grupos[index].relid = response.data.id;
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
                var indice = me.proyectogrupos.find(x => item.value === x.grupoid && me.workgroupId === x.proyectoid).value;
                let header={"Authorization" : "Bearer " + me.$store.state.token};
                let configuracion= {headers : header};
                axios.delete('api/Proyectogrupos/Eliminar/'+indice,configuracion).then( () => {
                    me.proyectogrupos = me.proyectogrupos.filter(x => x.value != indice);
                    me.grupos[index].relid = 0;
                    me.grupos[index].tarifaproyectogrupo = 0;
                    me.grupos[index].costoproyectogrupo = 0;
                    me.grupos[index].notas = '';
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
        agregarGrupo(addgroup){
            let me=this;
            if(addgroup.length >= 3 && addgroup.length <= 50 ){
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.post('api/Grupos/Crear',{
                    'nombre':addgroup,
                    'iduseralta': me.$store.state.usuario.idusuario                      
                },configuracion)
                .then(function(response){
                    //console.log(response);
                    me.grupos.push({selected: false, nombre: response.data.nombre, relid: 0, 
                    tarifaproyectogrupo:0, costoproyectogrupo:0, notas:'', value: response.data.id});
                    me.snacktext = 'Creacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.addgroup = "";
                }).catch(function(error){
                    me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                    me.snackbar = true;
                    me.snackcolor = 'error'
                    console.log(error);
                });
            }
        },
        editGrupo(item){
            var me=this;
            let index=0;
            index = me.proyectogrupos.findIndex(elemento => elemento.value === item.relid );
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};

            axios.put('api/Proyectogrupos/Actualizar',{
                'Id':item.relid,
                'grupoid':item.value,
                'proyectoid':this.workgroupId,
                'tarifaproyectogrupo':item.tarifaproyectogrupo,
                'costoproyectogrupo':item.costoproyectogrupo,
                'notas':item.notas,
                'iduseralta': me.$store.state.usuario.idusuario                      
            },configuracion).then( () => {
                me.proyectogrupos[index].tarifaproyectogrupo = (Number(item.tarifaproyectogrupo)).toFixed(2);
                me.proyectogrupos[index].costoproyectogrupo = Number(item.costoproyectogrupo);
                me.proyectogrupos[index].notas          = item.notas;
                //me.proyectos[me.proyectos.findIndex(elemento => elemento.value === me.proyectousuarios[index].proyectoid )].estimadotarifa = me.proyectotareas[index].estimadotarifa;
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
            this.id = "";
            this.nombre = "";
            this.empresaid = "";
            this.empresa = "";
            this.clienteid = "";
            this.cliente = "";
            this.facturable = true;
            this.liquidable = true;
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
                    'liquidable': me.liquidable,
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
                axios.post('api/Proyectos/Crear',{
                    'nombre': me.nombre,
                    'empresaid': me.pideempresa ? me.empresaid : empresas[0].value,
                    'clienteid': me.clienteid,
                    'facturable': me.facturable,
                    'liquidable': me.liquidable,
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
<style>
.v-data-table {
    white-space: nowrap;
}
</style>