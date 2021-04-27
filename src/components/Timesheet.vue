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
                            <div v-if="i == 2" style="float:right">
                                <strong>{{calcularStLu}}</strong>
                            </div>
                            <div v-if="i == 3" style="float:right">
                                <strong>{{calcularStMa}}</strong>
                            </div>
                            <div v-if="i == 4" style="float:right">
                                <strong>{{calcularStMi}}</strong>
                            </div>
                            <div v-if="i == 5" style="float:right">
                                <strong>{{calcularStJu}}</strong>
                            </div>
                            <div v-if="i == 6" style="float:right">
                                <strong>{{calcularStVi}}</strong>
                            </div>
                            <div v-if="i == 7" style="float:right">
                                <strong>{{calcularStSa}}</strong>
                            </div>
                            <div v-if="i == 8" style="float:right">
                                <strong>{{calcularStDo}}</strong>
                            </div>
                            <div v-if="i == 9" style="float:right">
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
                            <v-dialog v-model="dialog" max-width="600px">
                                <template v-slot:activator="{ on }">
                                <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                                </template>
                                <v-card>
                                <v-card-title>
                                    <span dense class="headline">{{ formTitle }}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-row dense>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-select 
                                                dense 
                                                v-model="proyectoid"
                                                :items = "proyectos"
                                                @change="armaTareas(proyectoid)"
                                                label = "Proyecto"
                                                >
                                                </v-select>
                                            </v-col>                                
                                            <v-col cols="12" sm="12" md="12">
                                                <v-select 
                                                dense
                                                v-model="tareaid" 
                                                label="Tarea" 
                                                :items = 'tareasf'
                                                clearable
                                                counter="0">
                                                </v-select>
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
                            persistent
                            @click:prepend="editLuRegistroFull(props.item)"
                            ></v-text-field>
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
                                                    @change="armaLuHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9">
                                                    <v-text-field 
                                                    dense
                                                    v-model="lufhasta"
                                                    type='date'
                                                    label="Fecha Hasta"
                                                    @change="armaLuHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="luhhasta"
                                                    type='time'
                                                    label="Hora Hasta" 
                                                    @change="armaLuHoras(props.item)"
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
                                        <v-btn color="blue darken-1" text @click="closeLu">Cancelar</v-btn>
                                        <v-btn color="blue darken-1" text @click="confirmaLuhoras(props.item)">Confirmar</v-btn>
                                    </v-card-actions>
                                    </v-card>
                            </v-dialog>
                        </template>
                    </v-edit-dialog>
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
                            persistent
                            @click:prepend="editMaRegistroFull(props.item)"
                            ></v-text-field>
                            <v-dialog v-model="madialog" max-width="400px">
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
                                                    v-model="mafdesde"
                                                    type='date'
                                                    label="Fecha Desde"
                                                    disabled
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="mahdesde"
                                                    type='time'
                                                    label="Hora Desde"
                                                    @change="armaMaHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9">
                                                    <v-text-field 
                                                    dense
                                                    v-model="mafhasta"
                                                    type='date'
                                                    label="Fecha Hasta"
                                                    @change="armaMaHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="mahhasta"
                                                    type='time'
                                                    label="Hora Hasta" 
                                                    @change="armaMaHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9"/>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field
                                                    dense 
                                                    v-model="mahoras"
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
                                        <v-btn color="blue darken-1" text @click="closeMa">Cancelar</v-btn>
                                        <v-btn color="blue darken-1" text @click="confirmaMahoras(props.item)">Confirmar</v-btn>
                                    </v-card-actions>
                                    </v-card>
                            </v-dialog>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.mihoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.mihoras"
                        large
                        cancel-text="Salir"
                        save-text="Guardar"
                        @save="editRegistro(props.item, 'mi')"
                        persistent
                    >
                        {{ props.item.mihoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.mihoras"
                            type="time"
                            label="Editar"
                            single-line
                            clearable
                            prepend-icon="mdi-dots-vertical"
                            persistent
                            @click:prepend="editMiRegistroFull(props.item)"
                            ></v-text-field>
                            <v-dialog v-model="midialog" max-width="400px">
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
                                                    v-model="mifdesde"
                                                    type='date'
                                                    label="Fecha Desde"
                                                    disabled
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="mihdesde"
                                                    type='time'
                                                    label="Hora Desde"
                                                    @change="armaMiHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9">
                                                    <v-text-field 
                                                    dense
                                                    v-model="mifhasta"
                                                    type='date'
                                                    label="Fecha Hasta"
                                                    @change="armaMiHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="mihhasta"
                                                    type='time'
                                                    label="Hora Hasta" 
                                                    @change="armaMiHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9"/>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field
                                                    dense 
                                                    v-model="mihoras"
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
                                        <v-btn color="blue darken-1" text @click="closeMi">Cancelar</v-btn>
                                        <v-btn color="blue darken-1" text @click="confirmaMihoras(props.item)">Confirmar</v-btn>
                                    </v-card-actions>
                                    </v-card>
                            </v-dialog>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.juhoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.juhoras"
                        large
                        cancel-text="Salir"
                        save-text="Guardar"
                        @save="editRegistro(props.item, 'ju')"
                        persistent
                    >
                        {{ props.item.juhoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.juhoras"
                            type="time"
                            label="Editar"
                            single-line
                            clearable
                            prepend-icon="mdi-dots-vertical"
                            persistent
                            @click:prepend="editJuRegistroFull(props.item)"
                            ></v-text-field>
                            <v-dialog v-model="judialog" max-width="400px">
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
                                                    v-model="jufdesde"
                                                    type='date'
                                                    label="Fecha Desde"
                                                    disabled
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="juhdesde"
                                                    type='time'
                                                    label="Hora Desde"
                                                    @change="armaJuHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9">
                                                    <v-text-field 
                                                    dense
                                                    v-model="jufhasta"
                                                    type='date'
                                                    label="Fecha Hasta"
                                                    @change="armaJuHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="juhhasta"
                                                    type='time'
                                                    label="Hora Hasta" 
                                                    @change="armaJuHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9"/>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field
                                                    dense 
                                                    v-model="juhoras"
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
                                        <v-btn color="blue darken-1" text @click="closeJu">Cancelar</v-btn>
                                        <v-btn color="blue darken-1" text @click="confirmaJuhoras(props.item)">Confirmar</v-btn>
                                    </v-card-actions>
                                    </v-card>
                            </v-dialog>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.vihoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.vihoras"
                        large
                        cancel-text="Salir"
                        save-text="Guardar"
                        @save="editRegistro(props.item, 'vi')"
                        persistent
                    >
                        {{ props.item.vihoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.vihoras"
                            type="time"
                            label="Editar"
                            single-line
                            clearable
                            prepend-icon="mdi-dots-vertical"
                            persistent
                            @click:prepend="editViRegistroFull(props.item)"
                            ></v-text-field>
                            <v-dialog v-model="vidialog" max-width="400px">
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
                                                    v-model="vifdesde"
                                                    type='date'
                                                    label="Fecha Desde"
                                                    disabled
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="vihdesde"
                                                    type='time'
                                                    label="Hora Desde"
                                                    @change="armaViHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9">
                                                    <v-text-field 
                                                    dense
                                                    v-model="vifhasta"
                                                    type='date'
                                                    label="Fecha Hasta"
                                                    @change="armaViHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="vihhasta"
                                                    type='time'
                                                    label="Hora Hasta" 
                                                    @change="armaViHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9"/>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field
                                                    dense 
                                                    v-model="vihoras"
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
                                        <v-btn color="blue darken-1" text @click="closeVi">Cancelar</v-btn>
                                        <v-btn color="blue darken-1" text @click="confirmaVihoras(props.item)">Confirmar</v-btn>
                                    </v-card-actions>
                                    </v-card>
                            </v-dialog>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.sahoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.sahoras"
                        large
                        cancel-text="Salir"
                        save-text="Guardar"
                        @save="editRegistro(props.item, 'sa')"
                        persistent
                    >
                        {{ props.item.sahoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.sahoras"
                            type="time"
                            label="Editar"
                            single-line
                            clearable
                            prepend-icon="mdi-dots-vertical"
                            persistent
                            @click:prepend="editSaRegistroFull(props.item)"
                            ></v-text-field>
                            <v-dialog v-model="sadialog" max-width="400px">
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
                                                    v-model="safdesde"
                                                    type='date'
                                                    label="Fecha Desde"
                                                    disabled
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="sahdesde"
                                                    type='time'
                                                    label="Hora Desde"
                                                    @change="armaSaHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9">
                                                    <v-text-field 
                                                    dense
                                                    v-model="safhasta"
                                                    type='date'
                                                    label="Fecha Hasta"
                                                    @change="armaSaHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="sahhasta"
                                                    type='time'
                                                    label="Hora Hasta" 
                                                    @change="armaSaHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9"/>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field
                                                    dense 
                                                    v-model="juhoras"
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
                                        <v-btn color="blue darken-1" text @click="closeSa">Cancelar</v-btn>
                                        <v-btn color="blue darken-1" text @click="confirmaSahoras(props.item)">Confirmar</v-btn>
                                    </v-card-actions>
                                    </v-card>
                            </v-dialog>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.dohoras`]="props">
                    <v-edit-dialog
                        :return-value.sync="props.item.dohoras"
                        large
                        cancel-text="Salir"
                        save-text="Guardar"
                        @save="editRegistro(props.item, 'do')"
                        persistent
                    >
                        {{ props.item.dohoras }}
                        <template v-slot:input>
                            <v-text-field
                            dense
                            v-model="props.item.dohoras"
                            type="time"
                            label="Editar"
                            single-line
                            clearable
                            prepend-icon="mdi-dots-vertical"
                            persistent
                            @click:prepend="editDoRegistroFull(props.item)"
                            ></v-text-field>
                            <v-dialog v-model="dodialog" max-width="400px">
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
                                                    v-model="dofdesde"
                                                    type='date'
                                                    label="Fecha Desde"
                                                    disabled
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="dohdesde"
                                                    type='time'
                                                    label="Hora Desde"
                                                    @change="armaDoHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9">
                                                    <v-text-field 
                                                    dense
                                                    v-model="dofhasta"
                                                    type='date'
                                                    label="Fecha Hasta"
                                                    @change="armaDoHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field 
                                                    dense
                                                    v-model="dohhasta"
                                                    type='time'
                                                    label="Hora Hasta" 
                                                    @change="armaDoHoras(props.item)"
                                                    >
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="9" md="9"/>
                                                <v-col cols="12" sm="3" md="3">
                                                    <v-text-field
                                                    dense 
                                                    v-model="dohoras"
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
                                        <v-btn color="blue darken-1" text @click="closeDo">Cancelar</v-btn>
                                        <v-btn color="blue darken-1" text @click="confirmaDohoras(props.item)">Confirmar</v-btn>
                                    </v-card-actions>
                                    </v-card>
                            </v-dialog>
                        </template>
                    </v-edit-dialog>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
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
                <template v-slot:[`item.tarea`]="{ item }">
                    <v-chip v-if="item.tarea" color="secondary" class="ma-2">{{item.tarea}}</v-chip>
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
        selected:[],
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
        tareasf:[],
        userid:'',
        proyectoid:'',
        tareaid:'',
        proyectotareas:[],
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
        formTitle () {
            let me=this;
            var title='';
            switch (this.editedIndex){
                case -1:{
                    title = 'Nuevo Registro'
                    break
                }
                case 1: {
                    title = 'Detalle horario dia ' + me.headersregistros[3].text;
                    break
                }
                case 2: {
                    title = 'Detalle horario dia ' + me.headersregistros[4].text;
                    break
                }
                case 3: {
                    title = 'Detalle horario dia ' + me.headersregistros[5].text;
                    break
                }
                case 4: {
                    title = 'Detalle horario dia ' + me.headersregistros[6].text;
                    break
                }
                case 1: {
                    title = 'Detalle horario dia ' + me.headersregistros[7].text;
                    break
                }
                case 6: {
                    title = 'Detalle horario dia ' + me.headersregistros[8].text;
                    break
                }
                case 7: {
                    title = 'Detalle horario dia ' + me.headersregistros[9].text;
                    break
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
            this.totalLun = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2)
            return this.totalLun
        },
        calcularStMa: function(){
            var msec = 0;
            var aux = 0;
            for (let index = 0; index < this.registros.length; index++) {
                aux = new Date(new Date(this.registros[index].mafhhasta).getTime() - new Date(this.registros[index].mafhhasta).getTimezoneOffset() * 60000) 
                    - new Date(new Date(this.registros[index].mafhdesde).getTime() - new Date(this.registros[index].mafhdesde).getTimezoneOffset() * 60000);
                msec += aux?aux:0;
            };
            var mins = Math.floor(msec / 60000);
            var hrs = Math.floor(mins / 60);
            mins = mins % 60;
            this.totalMar = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2)
            return this.totalMar
        },
        calcularStMi: function(){
            var msec = 0;
            var aux = 0;
            for (let index = 0; index < this.registros.length; index++) {
                aux = new Date(new Date(this.registros[index].mifhhasta).getTime() - new Date(this.registros[index].mifhhasta).getTimezoneOffset() * 60000) 
                    - new Date(new Date(this.registros[index].mifhdesde).getTime() - new Date(this.registros[index].mifhdesde).getTimezoneOffset() * 60000);
                msec += aux?aux:0;
            };
            var mins = Math.floor(msec / 60000);
            var hrs = Math.floor(mins / 60);
            mins = mins % 60;
            this.totalMie = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
            return this.totalMie
        },
        calcularStJu: function(){
            var msec = 0;
            var aux = 0;
            for (let index = 0; index < this.registros.length; index++) {
                aux = new Date(new Date(this.registros[index].jufhhasta).getTime() - new Date(this.registros[index].jufhhasta).getTimezoneOffset() * 60000) 
                    - new Date(new Date(this.registros[index].jufhdesde).getTime() - new Date(this.registros[index].jufhdesde).getTimezoneOffset() * 60000);
                msec += aux?aux:0;
            };
            var mins = Math.floor(msec / 60000);
            var hrs = Math.floor(mins / 60);
            mins = mins % 60;
            this.totalJue = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
            return this.totalJue
        },
        calcularStVi: function(){
            var msec = 0;
            var aux = 0;
            for (let index = 0; index < this.registros.length; index++) {
                aux = new Date(new Date(this.registros[index].vifhhasta).getTime() - new Date(this.registros[index].vifhhasta).getTimezoneOffset() * 60000) 
                    - new Date(new Date(this.registros[index].vifhdesde).getTime() - new Date(this.registros[index].vifhdesde).getTimezoneOffset() * 60000);
                msec += aux?aux:0;
            };
            var mins = Math.floor(msec / 60000);
            var hrs = Math.floor(mins / 60);
            mins = mins % 60;
            this.totalVie = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
            return this.totalVie
        },
        calcularStSa: function(){
            var msec = 0;
            var aux = 0;
            for (let index = 0; index < this.registros.length; index++) {
                aux = new Date(new Date(this.registros[index].safhhasta).getTime() - new Date(this.registros[index].safhhasta).getTimezoneOffset() * 60000) 
                    - new Date(new Date(this.registros[index].safhdesde).getTime() - new Date(this.registros[index].safhdesde).getTimezoneOffset() * 60000);
                msec += aux?aux:0;
            };
            var mins = Math.floor(msec / 60000);
            var hrs = Math.floor(mins / 60);
            mins = mins % 60;
            this.totalSab = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
            return this.totalSab
        },
        calcularStDo: function(){
            var msec = 0;
            var aux = 0;
            for (let index = 0; index < this.registros.length; index++) {
                aux = new Date(new Date(this.registros[index].dofhhasta).getTime() - new Date(this.registros[index].dofhhasta).getTimezoneOffset() * 60000) 
                    - new Date(new Date(this.registros[index].dofhdesde).getTime() - new Date(this.registros[index].dofhdesde).getTimezoneOffset() * 60000);
                msec += aux?aux:0;
            };
            var mins = Math.floor(msec / 60000);
            var hrs = Math.floor(mins / 60);
            mins = mins % 60;
            this.totalDom = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
            return this.totalDom
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
            this.totalGral = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
            return this.totalGral
        },
        },
        watch: {
            dialog (val) {
                val || this.close()
            },
        },

    created () {
        this.position();
        this.select();
        this.listar();
    },
    methods: {
        listar(){
            let me=this;
            let header={"Authorization" : "Bearer " + this.$store.state.token};
            let configuracion= {headers : header};
            axios.get('api/Registros/Listaractivos',configuracion).then(function(response){
                //console.log(response);
                me.registrosAll=response.data;
                me.$nextTick(function(){
                    this.calendario();
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
                    me.proyectos.push({value:x.id, text: x.nombre, tarifadefault: x.tarifadefault, clienteid:x.clienteid, 
                    empresaid:x.empresaid, coltexto: x.coltexto, colfondo: x.colfondo,
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
                    me.tareas.push({value:x.id, nombre: x.nombre, text: x.nombre});
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
            })
            .catch(function(error){
                me.snacktext = 'Se detectó un error. Código: '+ error.response.status;
                me.snackcolor = 'error'
                me.snackbar = true;
                console.log(error);
            });
            this.setHeaders(new Date());
            this.buildWeek();
            this.setItems("Date",new Date());
        },
        editRegistro(item, dia){
            var me=this;
            let header={"Authorization" : "Bearer " + me.$store.state.token};
            let configuracion= {headers : header};
            switch(dia){
                case 'lu' : {
                    if (!item.luhoras){
                        var indice = item.luid;
                        axios.delete('api/Registros/Eliminar/'+indice,configuracion).then( () => {
                            let itemIndex = me.registros.indexOf(item);
                            var fhaux = new Date(new Date(item.lufecregistracion).getTime() 
                            - new Date(item.lufecregistracion).getTimezoneOffset() * 60000).toISOString();
                            //console.log(new Date(), item.lufecregistracion, new Date(item.lufecregistracion), fhaux);
                            me.registros[itemIndex].luhoras = '';
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
                        item.lufhhasta = new Date(new Date(item.lufhdesde).getTime() 
                                                + luminutos * 60000).toISOString();
                        item.lulathasta = me.latitude;
                        item.lulonghasta = me.longitude;
                        //console.log(item.lufecregistracion, item.lufhdesde, item.lufhhasta);
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
                            me.registrosAll[index].fhdesde = new Date(item.lufhdesde).toISOString().substr(0,19);
                            me.registrosAll[index].fhhasta = new Date(item.lufhhasta).toISOString().substr(0,19);
                            me.registrosAll[index].minutos = luminutos;
                            let itemIndex = me.registros.indexOf(item);
                            me.registros[itemIndex].lufhdesde = new Date(item.lufhdesde).toISOString().substr(0,19);
                            me.registros[itemIndex].lufhhasta = new Date(item.lufhhasta).toISOString().substr(0,19);
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
                        var a = item.luhoras.split(':')
                        var luminutos = (+a[0] * 60 + (+a[1]));
                        item.lufhdesde = new Date(new Date(item.lufecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 
                                        - new Date(item.lufecregistracion).getTimezoneOffset() * 60000).toISOString();
                        item.lufhhasta = new Date(new Date(item.lufecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 
                                        - new Date(item.lufecregistracion).getTimezoneOffset() * 60000 + luminutos * 60000).toISOString();
                        item.lulatdesde = me.latitude;
                        item.lulongdesde = me.longitude; 
                        item.lulathasta = me.latitude;
                        item.lulonghasta = me.longitude;
                        var tarifa = me.determinaTarifa(item.proyectoid, item.usuarioid);
                        var costo = me.determinaCosto(item.proyectoid, item.usuarioid);
                        //console.log(item.lufecregistracion, item.lufhdesde, item.lufhhasta);
                        axios.post('api/Registros/Crear',{
                            'actividad': '',
                            'usuarioid': item.usuarioid,
                            'proyectoid': item.proyectoid,
                            'tareaid': item.tareaid,
                            'fecregistracion': item.lufecregistracion.substr(0,10),
                            'facturable': me.proyectos.find(x => x.value == item.proyectoid).facturable,
                            'liquidable': me.proyectos.find(x => x.value == item.proyectoid).liquidable,
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
                            var index = 0;
                            var auxpro = '';
                            var auxtar = '';
                            var auxusu = '';
                            index = me.registrosAll.push(response.data);
                            auxusu = +me.$store.state.usuario.idusuario;
                            auxpro = me.registrosAll[index-1].proyectoid;
                            auxtar = me.registrosAll[index-1].tareaid;
                            me.registrosAll[index-1].proyecto = me.proyectos.find(x => x.value === auxpro).text;
                            me.registrosAll[index-1].tarea = auxtar?me.tareas.find(x => x.value === auxtar).text:'';
                            index = me.registros.findIndex(x => x.usuarioid === auxusu &&
                                                                x.proyectoid == auxpro &&
                                                                x.tareaid == auxtar);
                            me.registros[index].lufacturable = me.proyectos.find(x => x.value == auxpro).facturable;
                            me.registros[index].luliquidable = me.proyectos.find(x => x.value == auxpro).liquidable;
                            me.registros[index].lufhdesde = new Date(item.lufhdesde).toISOString().substr(0,19);
                            me.registros[index].lufhhasta = new Date(item.lufhhasta).toISOString().substr(0,19);
                            me.registros[index].luhoras = item.luhoras;
                            me.registros[index].luid = response.data.id;
                            me.registros[index].lulatdesde = item.lulatdesde;
                            me.registros[index].lulongdesde = item.lulongdesde;
                            me.registros[index].lulathasta = item.lulathasta;
                            me.registros[index].lulonghasta = item.lulonghasta;
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
                    if (!item.mahoras){
                        var indice = item.maid;
                        axios.delete('api/Registros/Eliminar/'+indice,configuracion).then( () => {
                            let itemIndex = me.registros.indexOf(item);
                            var fhaux = new Date(new Date(item.mafecregistracion).getTime() 
                                    - new Date(item.mafecregistracion).getTimezoneOffset() * 60000).toISOString();
                            //console.log(new Date(), item.mafecregistracion, new Date(item.mafecregistracion), fhaux);
                            me.registros[itemIndex].mahoras = '';
                            me.registros[itemIndex].mafhdesde = fhaux;
                            me.registros[itemIndex].mafhhasta = fhaux;
                            me.registros[itemIndex].matarifa = 0;
                            me.registros[itemIndex].macosto = 0;
                            me.registros[itemIndex].maid = '';
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

                    } else if (item.maid){
                        var index = '';
                        var a = item.mahoras.split(':')
                        var maminutos = (+a[0] * 60 + (+a[1]));
                        item.mafhhasta = new Date(new Date(item.mafhdesde).getTime() 
                                                + maminutos * 60000).toISOString();
                        item.malathasta = me.latitude;
                        item.malonghasta = me.longitude;
                        //console.log(item.mafecregistracion, item.mafhdesde, item.mafhhasta);
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
                            index = me.registrosAll.findIndex(x => x.id == item.maid);
                            me.registrosAll[index].fhdesde = new Date(item.mafhdesde).toISOString().substr(0,19);
                            me.registrosAll[index].fhhasta = new Date(item.mafhhasta).toISOString().substr(0,19);
                            me.registrosAll[index].minutos = maminutos;
                            let itemIndex = me.registros.indexOf(item);
                            me.registros[itemIndex].mafhdesde = new Date(item.mafhdesde).toISOString().substr(0,19);
                            me.registros[itemIndex].mafhhasta = new Date(item.mafhhasta).toISOString().substr(0,19);
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
                        var a = item.mahoras.split(':')
                        var maminutos = (+a[0] * 60 + (+a[1]));
                        item.mafhdesde = new Date(new Date(item.mafecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 
                                        - new Date(item.mafecregistracion).getTimezoneOffset() * 60000).toISOString();
                        item.mafhhasta = new Date(new Date(item.mafecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 
                                        - new Date(item.mafecregistracion).getTimezoneOffset() * 60000 + maminutos * 60000).toISOString();
                        item.malatdesde = me.latitude;
                        item.malongdesde = me.longitude; 
                        item.malathasta = me.latitude;
                        item.malonghasta = me.longitude;
                        var tarifa = me.determinaTarifa(item.proyectoid, item.usuarioid);
                        var costo = me.determinaCosto(item.proyectoid, item.usuarioid);
                        //console.log(item.mafecregistracion, item.mafhdesde, item.mafhhasta);
                        axios.post('api/Registros/Crear',{
                            'actividad': '',
                            'usuarioid': item.usuarioid,
                            'proyectoid': item.proyectoid,
                            'tareaid': item.tareaid,
                            'fecregistracion': item.mafecregistracion.substr(0,10),
                            'facturable': me.proyectos.find(x => x.value == item.proyectoid).facturable,
                            'liquidable': me.proyectos.find(x => x.value == item.proyectoid).liquidable,
                            'fhdesde': item.mafhdesde,
                            'fhhasta': item.mafhhasta,
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
                        },configuracion).then( function(response) {
                            var index = 0;
                            var auxpro = '';
                            var auxtar = '';
                            var auxusu = '';
                            index = me.registrosAll.push(response.data);
                            auxusu = +me.$store.state.usuario.idusuario;
                            auxpro = me.registrosAll[index-1].proyectoid;
                            auxtar = me.registrosAll[index-1].tareaid;
                            me.registrosAll[index-1].proyecto = me.proyectos.find(x => x.value === auxpro).text;
                            me.registrosAll[index-1].tarea = auxtar?me.tareas.find(x => x.value === auxtar).text:'';
                            index = me.registros.findIndex(x => x.usuarioid === auxusu &&
                                                                x.proyectoid == auxpro &&
                                                                x.tareaid == auxtar);
                            me.registros[index].mafacturable = me.proyectos.find(x => x.value == auxpro).facturable;
                            me.registros[index].maliquidable = me.proyectos.find(x => x.value == auxpro).liquidable;
                            me.registros[index].mafhdesde = new Date(item.mafhdesde).toISOString().substr(0,19);
                            me.registros[index].mafhhasta = new Date(item.mafhhasta).toISOString().substr(0,19);
                            me.registros[index].mahoras = item.mahoras;
                            me.registros[index].maid = response.data.id;
                            me.registros[index].malatdesde = item.malatdesde;
                            me.registros[index].malongdesde = item.malongdesde;
                            me.registros[index].malathasta = item.malathasta;
                            me.registros[index].malonghasta = item.malonghasta;
                            me.registros[index].matarifa = item.matarifa;
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
                case 'mi' : {
                    if (!item.mihoras){
                        var indice = item.miid;
                        axios.delete('api/Registros/Eliminar/'+indice,configuracion).then( () => {
                            let itemIndex = me.registros.indexOf(item);
                            var fhaux = new Date(new Date(item.mifecregistracion).getTime() - new Date(item.mifecregistracion).getTimezoneOffset() * 60000).toISOString();
                            //console.log(new Date(), item.mifecregistracion, new Date(item.mifecregistracion), fhaux);
                            me.registros[itemIndex].mihoras = '';
                            me.registros[itemIndex].mifhdesde = fhaux;
                            me.registros[itemIndex].mifhhasta = fhaux;
                            me.registros[itemIndex].mitarifa = 0;
                            me.registros[itemIndex].micosto = 0;
                            me.registros[itemIndex].miid = '';
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

                    } else if (item.miid){
                        var index = '';
                        var a = item.mihoras.split(':')
                        var miminutos = (+a[0] * 60 + (+a[1]));
                        item.mifhhasta = new Date(new Date(item.mifhdesde).getTime() 
                                                + miminutos * 60000).toISOString();
                        item.milathasta = me.latitude;
                        item.milonghasta = me.longitude;
                        //console.log(item.mifecregistracion, item.mifhdesde, item.mifhhasta);
                        axios.put('api/Registros/Actualizarhoras',{
                            'Id':item.miid,
                            'fhdesde':item.mifhdesde,
                            'fhhasta':item.mifhhasta,
                            'minutos':miminutos,
                            'latdesde':item.milatdesde,
                            'longdesde':item.milongdesde,
                            'lathasta':item.milathasta,
                            'longhasta':item.milonghasta,
                            'iduserumod': me.$store.state.usuario.idusuario
                        },configuracion).then( () => {
                            index = me.registrosAll.findIndex(x => x.id == item.miid);
                            me.registrosAll[index].fhdesde = new Date(item.mifhdesde).toISOString().substr(0,19);
                            me.registrosAll[index].fhhasta = new Date(item.mifhhasta).toISOString().substr(0,19);
                            me.registrosAll[index].minutos = miminutos;
                            let itemIndex = me.registros.indexOf(item);
                            me.registros[itemIndex].mifhdesde = new Date(item.mifhdesde).toISOString().substr(0,19);
                            me.registros[itemIndex].mifhhasta = new Date(item.mifhhasta).toISOString().substr(0,19);
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
                        var a = item.mihoras.split(':')
                        var miminutos = (+a[0] * 60 + (+a[1]));
                        item.mifhdesde = new Date(new Date(item.mifecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.mifecregistracion).getTimezoneOffset() * 60000).toISOString();
                        item.mifhhasta = new Date(new Date(item.mifecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.mifecregistracion).getTimezoneOffset() * 60000 + miminutos * 60000).toISOString();
                        item.milatdesde = me.latitude;
                        item.milongdesde = me.longitude; 
                        item.milathasta = me.latitude;
                        item.milonghasta = me.longitude;
                        var tarifa = me.determinaTarifa(item.proyectoid, item.usuarioid);
                        var costo = me.determinaCosto(item.proyectoid, item.usuarioid);
                        //console.log(item.mifecregistracion, item.mifhdesde, item.mifhhasta);
                        axios.post('api/Registros/Crear',{
                            'actividad': '',
                            'usuarioid': item.usuarioid,
                            'proyectoid': item.proyectoid,
                            'tareaid': item.tareaid,
                            'fecregistracion': item.mifecregistracion.substr(0,10),
                            'facturable': me.proyectos.find(x => x.value == item.proyectoid).facturable,
                            'liquidable': me.proyectos.find(x => x.value == item.proyectoid).liquidable,
                            'fhdesde': item.mifhdesde,
                            'fhhasta': item.mifhhasta,
                            'minutos':miminutos,
                            'latdesde':item.milatdesde,
                            'longdesde':item.milongdesde,
                            'lathasta':item.milathasta,
                            'longhasta':item.milonghasta,
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
                            var index = 0;
                            var auxpro = '';
                            var auxtar = '';
                            var auxusu = '';
                            index = me.registrosAll.push(response.data);
                            auxusu = +me.$store.state.usuario.idusuario;
                            auxpro = me.registrosAll[index-1].proyectoid;
                            auxtar = me.registrosAll[index-1].tareaid;
                            me.registrosAll[index-1].proyecto = me.proyectos.find(x => x.value === auxpro).text;
                            me.registrosAll[index-1].tarea = auxtar?me.tareas.find(x => x.value === auxtar).text:'';
                            index = me.registros.findIndex(x => x.usuarioid === auxusu &&
                                                                x.proyectoid == auxpro &&
                                                                x.tareaid == auxtar);
                            me.registros[index].mifacturable = me.proyectos.find(x => x.value == auxpro).facturable;
                            me.registros[index].miliquidable = me.proyectos.find(x => x.value == auxpro).liquidable;
                            me.registros[index].mifhdesde = new Date(item.mifhdesde).toISOString().substr(0,19);
                            me.registros[index].mifhhasta = new Date(item.mifhhasta).toISOString().substr(0,19);
                            me.registros[index].mihoras = item.mihoras;
                            me.registros[index].miid = response.data.id;
                            me.registros[index].milatdesde = item.milatdesde;
                            me.registros[index].milongdesde = item.milongdesde;
                            me.registros[index].milathasta = item.milathasta;
                            me.registros[index].milonghasta = item.milonghasta;
                            me.registros[index].mitarifa = item.mitarifa;
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
                case 'ju' : {
                    if (!item.juhoras){
                        var indice = item.juid;
                        axios.delete('api/Registros/Eliminar/'+indice,configuracion).then( () => {
                            let itemIndex = me.registros.indexOf(item);
                            var fhaux = new Date(new Date(item.jufecregistracion).getTime() - new Date(item.jufecregistracion).getTimezoneOffset() * 60000).toISOString();
                            //console.log(new Date(), item.jufecregistracion, new Date(item.jufecregistracion), fhaux);
                            me.registros[itemIndex].juhoras = '';
                            me.registros[itemIndex].jufhdesde = fhaux;
                            me.registros[itemIndex].jufhhasta = fhaux;
                            me.registros[itemIndex].jutarifa = 0;
                            me.registros[itemIndex].jucosto = 0;
                            me.registros[itemIndex].juid = '';
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

                    } else if (item.juid){
                        var index = '';
                        var a = item.juhoras.split(':')
                        var juminutos = (+a[0] * 60 + (+a[1]));
                        item.jufhhasta = new Date(new Date(item.jufhdesde).getTime() 
                                                + juminutos * 60000).toISOString();
                        item.julathasta = me.latitude;
                        item.julonghasta = me.longitude;
                        //console.log(item.jufecregistracion, item.jufhdesde, item.jufhhasta);
                        axios.put('api/Registros/Actualizarhoras',{
                            'Id':item.juid,
                            'fhdesde':item.jufhdesde,
                            'fhhasta':item.jufhhasta,
                            'minutos':juminutos,
                            'latdesde':item.julatdesde,
                            'longdesde':item.julongdesde,
                            'lathasta':item.julathasta,
                            'longhasta':item.julonghasta,
                            'iduserumod': me.$store.state.usuario.idusuario
                        },configuracion).then( () => {
                            index = me.registrosAll.findIndex(x => x.id == item.juid);
                            me.registrosAll[index].fhdesde = new Date(item.jufhdesde).toISOString().substr(0,19);
                            me.registrosAll[index].fhhasta = new Date(item.jufhhasta).toISOString().substr(0,19);
                            me.registrosAll[index].minutos = juminutos;
                            let itemIndex = me.registros.indexOf(item);
                            me.registros[itemIndex].jufhdesde = new Date(item.jufhdesde).toISOString().substr(0,19);
                            me.registros[itemIndex].jufhhasta = new Date(item.jufhhasta).toISOString().substr(0,19);
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
                        var a = item.juhoras.split(':')
                        var juminutos = (+a[0] * 60 + (+a[1]));
                        item.jufhdesde = new Date(new Date(item.jufecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.jufecregistracion).getTimezoneOffset() * 60000).toISOString();
                        item.jufhhasta = new Date(new Date(item.jufecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.jufecregistracion).getTimezoneOffset() * 60000 + juminutos * 60000).toISOString();
                        item.julatdesde = me.latitude;
                        item.julongdesde = me.longitude; 
                        item.julathasta = me.latitude;
                        item.julonghasta = me.longitude;
                        var tarifa = me.determinaTarifa(item.proyectoid, item.usuarioid);
                        var costo = me.determinaCosto(item.proyectoid, item.usuarioid);
                        //console.log(item.jufecregistracion, item.jufhdesde, item.jufhhasta);
                        axios.post('api/Registros/Crear',{
                            'actividad': '',
                            'usuarioid': item.usuarioid,
                            'proyectoid': item.proyectoid,
                            'tareaid': item.tareaid,
                            'fecregistracion': item.jufecregistracion.substr(0,10),
                            'facturable': me.proyectos.find(x => x.value == item.proyectoid).facturable,
                            'liquidable': me.proyectos.find(x => x.value == item.proyectoid).liquidable,
                            'fhdesde': item.jufhdesde,
                            'fhhasta': item.jufhhasta,
                            'minutos':juminutos,
                            'latdesde':item.julatdesde,
                            'longdesde':item.julongdesde,
                            'lathasta':item.julathasta,
                            'longhasta':item.julonghasta,
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
                            var index = 0;
                            var auxpro = '';
                            var auxtar = '';
                            var auxusu = '';
                            index = me.registrosAll.push(response.data);
                            auxusu = +me.$store.state.usuario.idusuario;
                            auxpro = me.registrosAll[index-1].proyectoid;
                            auxtar = me.registrosAll[index-1].tareaid;
                            me.registrosAll[index-1].proyecto = me.proyectos.find(x => x.value === auxpro).text;
                            me.registrosAll[index-1].tarea = auxtar?me.tareas.find(x => x.value === auxtar).text:'';
                            index = me.registros.findIndex(x => x.usuarioid === auxusu &&
                                                                x.proyectoid == auxpro &&
                                                                x.tareaid == auxtar);
                            me.registros[index].jufacturable = me.proyectos.find(x => x.value == auxpro).facturable;
                            me.registros[index].juliquidable = me.proyectos.find(x => x.value == auxpro).liquidable;
                            me.registros[index].jufhdesde = new Date(item.jufhdesde).toISOString().substr(0,19);
                            me.registros[index].jufhhasta = new Date(item.jufhhasta).toISOString().substr(0,19);
                            me.registros[index].juhoras = item.juhoras;
                            me.registros[index].juid = response.data.id;
                            me.registros[index].julatdesde = item.julatdesde;
                            me.registros[index].julongdesde = item.julongdesde;
                            me.registros[index].julathasta = item.julathasta;
                            me.registros[index].julonghasta = item.julonghasta;
                            me.registros[index].jutarifa = item.jutarifa;
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
                case 'vi' : {
                    if (!item.vihoras){
                        var indice = item.viid;
                        axios.delete('api/Registros/Eliminar/'+indice,configuracion).then( () => {
                            let itemIndex = me.registros.indexOf(item);
                            var fhaux = new Date(new Date(item.vifecregistracion).getTime() - new Date(item.vifecregistracion).getTimezoneOffset() * 60000).toISOString();
                            //console.log(new Date(), item.vifecregistracion, new Date(item.vifecregistracion), fhaux);
                            me.registros[itemIndex].vihoras = '';
                            me.registros[itemIndex].vifhdesde = fhaux;
                            me.registros[itemIndex].vifhhasta = fhaux;
                            me.registros[itemIndex].vitarifa = 0;
                            me.registros[itemIndex].vicosto = 0;
                            me.registros[itemIndex].viid = '';
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

                    } else if (item.viid){
                        var index = '';
                        var a = item.vihoras.split(':')
                        var viminutos = (+a[0] * 60 + (+a[1]));
                        item.vifhhasta = new Date(new Date(item.vifhdesde).getTime() 
                                                + viminutos * 60000).toISOString();
                        item.vilathasta = me.latitude;
                        item.vilonghasta = me.longitude;
                        //console.log(item.vifecregistracion, item.vifhdesde, item.vifhhasta);
                        axios.put('api/Registros/Actualizarhoras',{
                            'Id':item.viid,
                            'fhdesde':item.vifhdesde,
                            'fhhasta':item.vifhhasta,
                            'minutos':viminutos,
                            'latdesde':item.vilatdesde,
                            'longdesde':item.vilongdesde,
                            'lathasta':item.vilathasta,
                            'longhasta':item.vilonghasta,
                            'iduserumod': me.$store.state.usuario.idusuario
                        },configuracion).then( () => {
                            index = me.registrosAll.findIndex(x => x.id == item.viid);
                            me.registrosAll[index].fhdesde = new Date(item.vifhdesde).toISOString().substr(0,19);
                            me.registrosAll[index].fhhasta = new Date(item.vifhhasta).toISOString().substr(0,19);
                            me.registrosAll[index].minutos = viminutos;
                            let itemIndex = me.registros.indexOf(item);
                            me.registros[itemIndex].vifhdesde = new Date(item.vifhdesde).toISOString().substr(0,19);
                            me.registros[itemIndex].vifhhasta = new Date(item.vifhhasta).toISOString().substr(0,19);
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
                        var a = item.vihoras.split(':')
                        var viminutos = (+a[0] * 60 + (+a[1]));
                        item.vifhdesde = new Date(new Date(item.vifecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.vifecregistracion).getTimezoneOffset() * 60000).toISOString();
                        item.vifhhasta = new Date(new Date(item.vifecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.vifecregistracion).getTimezoneOffset() * 60000 + viminutos * 60000).toISOString();
                        item.vilatdesde = me.latitude;
                        item.vilongdesde = me.longitude; 
                        item.vilathasta = me.latitude;
                        item.vilonghasta = me.longitude;
                        var tarifa = me.determinaTarifa(item.proyectoid, item.usuarioid);
                        var costo = me.determinaCosto(item.proyectoid, item.usuarioid);
                        //console.log(item.vifecregistracion, item.vifhdesde, item.vifhhasta);
                        axios.post('api/Registros/Crear',{
                            'actividad': '',
                            'usuarioid': item.usuarioid,
                            'proyectoid': item.proyectoid,
                            'tareaid': item.tareaid,
                            'fecregistracion': item.vifecregistracion.substr(0,10),
                            'facturable': me.proyectos.find(x => x.value == item.proyectoid).facturable,
                            'liquidable': me.proyectos.find(x => x.value == item.proyectoid).liquidable,
                            'fhdesde': item.vifhdesde,
                            'fhhasta': item.vifhhasta,
                            'minutos':viminutos,
                            'latdesde':item.vilatdesde,
                            'longdesde':item.vilongdesde,
                            'lathasta':item.vilathasta,
                            'longhasta':item.vilonghasta,
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
                            var index = 0;
                            var auxpro = '';
                            var auxtar = '';
                            var auxusu = '';
                            index = me.registrosAll.push(response.data);
                            auxusu = +me.$store.state.usuario.idusuario;
                            auxpro = me.registrosAll[index-1].proyectoid;
                            auxtar = me.registrosAll[index-1].tareaid;
                            me.registrosAll[index-1].proyecto = me.proyectos.find(x => x.value === auxpro).text;
                            me.registrosAll[index-1].tarea = auxtar?me.tareas.find(x => x.value === auxtar).text:'';
                            index = me.registros.findIndex(x => x.usuarioid === auxusu &&
                                                                x.proyectoid == auxpro &&
                                                                x.tareaid == auxtar);
                            me.registros[index].vifacturable = me.proyectos.find(x => x.value == auxpro).facturable;
                            me.registros[index].viliquidable = me.proyectos.find(x => x.value == auxpro).liquidable;
                            me.registros[index].vifhdesde = new Date(item.vifhdesde).toISOString().substr(0,19);
                            me.registros[index].vifhhasta = new Date(item.vifhhasta).toISOString().substr(0,19);
                            me.registros[index].vihoras = item.vihoras;
                            me.registros[index].viid = response.data.id;
                            me.registros[index].vilatdesde = item.vilatdesde;
                            me.registros[index].vilongdesde = item.vilongdesde;
                            me.registros[index].vilathasta = item.vilathasta;
                            me.registros[index].vilonghasta = item.vilonghasta;
                            me.registros[index].vitarifa = item.vitarifa;
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
                case 'sa' : {
                    if (!item.sahoras){
                        var indice = item.said;
                        axios.delete('api/Registros/Eliminar/'+indice,configuracion).then( () => {
                            let itemIndex = me.registros.indexOf(item);
                            var fhaux = new Date(new Date(item.safecregistracion).getTime() - new Date(item.safecregistracion).getTimezoneOffset() * 60000).toISOString();
                            //console.log(new Date(), item.safecregistracion, new Date(item.safecregistracion), fhaux);
                            me.registros[itemIndex].sahoras = '';
                            me.registros[itemIndex].safhdesde = fhaux;
                            me.registros[itemIndex].safhhasta = fhaux;
                            me.registros[itemIndex].satarifa = 0;
                            me.registros[itemIndex].sacosto = 0;
                            me.registros[itemIndex].said = '';
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

                    } else if (item.said){
                        var index = '';
                        var a = item.sahoras.split(':')
                        var saminutos = (+a[0] * 60 + (+a[1]));
                        item.safhhasta = new Date(new Date(item.safhdesde).getTime() 
                                                + saminutos * 60000).toISOString();
                        item.salathasta = me.latitude;
                        item.salonghasta = me.longitude;
                        //console.log(item.safecregistracion, item.safhdesde, item.safhhasta);
                        axios.put('api/Registros/Actualizarhoras',{
                            'Id':item.said,
                            'fhdesde':item.safhdesde,
                            'fhhasta':item.safhhasta,
                            'minutos':saminutos,
                            'latdesde':item.salatdesde,
                            'longdesde':item.salongdesde,
                            'lathasta':item.salathasta,
                            'longhasta':item.salonghasta,
                            'iduserumod': me.$store.state.usuario.idusuario
                        },configuracion).then( () => {
                            index = me.registrosAll.findIndex(x => x.id == item.said);
                            me.registrosAll[index].fhdesde = new Date(item.safhdesde).toISOString().substr(0,19);
                            me.registrosAll[index].fhhasta = new Date(item.safhhasta).toISOString().substr(0,19);
                            me.registrosAll[index].minutos = saminutos;
                            let itemIndex = me.registros.indexOf(item);
                            me.registros[itemIndex].safhdesde = new Date(item.safhdesde).toISOString().substr(0,19);
                            me.registros[itemIndex].safhhasta = new Date(item.safhhasta).toISOString().substr(0,19);
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
                        var a = item.sahoras.split(':')
                        var saminutos = (+a[0] * 60 + (+a[1]));
                        item.safhdesde = new Date(new Date(item.safecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.safecregistracion).getTimezoneOffset() * 60000).toISOString();
                        item.safhhasta = new Date(new Date(item.safecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.safecregistracion).getTimezoneOffset() * 60000 + saminutos * 60000).toISOString();
                        item.salatdesde = me.latitude;
                        item.salongdesde = me.longitude; 
                        item.salathasta = me.latitude;
                        item.salonghasta = me.longitude;
                        var tarifa = me.determinaTarifa(item.proyectoid, item.usuarioid);
                        var costo = me.determinaCosto(item.proyectoid, item.usuarioid);
                        //console.log(item.safecregistracion, item.safhdesde, item.safhhasta);
                        axios.post('api/Registros/Crear',{
                            'actividad': '',
                            'usuarioid': item.usuarioid,
                            'proyectoid': item.proyectoid,
                            'tareaid': item.tareaid,
                            'fecregistracion': item.safecregistracion.substr(0,10),
                            'facturable': me.proyectos.find(x => x.value == item.proyectoid).facturable,
                            'liquidable': me.proyectos.find(x => x.value == item.proyectoid).liquidable,
                            'fhdesde': item.safhdesde,
                            'fhhasta': item.safhhasta,
                            'minutos':saminutos,
                            'latdesde':item.salatdesde,
                            'longdesde':item.salongdesde,
                            'lathasta':item.salathasta,
                            'longhasta':item.salonghasta,
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
                            var index = 0;
                            var auxpro = '';
                            var auxtar = '';
                            var auxusu = '';
                            index = me.registrosAll.push(response.data);
                            auxusu = +me.$store.state.usuario.idusuario;
                            auxpro = me.registrosAll[index-1].proyectoid;
                            auxtar = me.registrosAll[index-1].tareaid;
                            me.registrosAll[index-1].proyecto = me.proyectos.find(x => x.value === auxpro).text;
                            me.registrosAll[index-1].tarea = auxtar?me.tareas.find(x => x.value === auxtar).text:'';
                            index = me.registros.findIndex(x => x.usuarioid === auxusu &&
                                                                x.proyectoid == auxpro &&
                                                                x.tareaid == auxtar);
                            me.registros[index].safacturable = me.proyectos.find(x => x.value == auxpro).facturable;
                            me.registros[index].saliquidable = me.proyectos.find(x => x.value == auxpro).liquidable;
                            me.registros[index].safhdesde = new Date(item.safhdesde).toISOString().substr(0,19);
                            me.registros[index].safhhasta = new Date(item.safhhasta).toISOString().substr(0,19);
                            me.registros[index].sahoras = item.sahoras;
                            me.registros[index].said = response.data.id;
                            me.registros[index].salatdesde = item.salatdesde;
                            me.registros[index].salongdesde = item.salongdesde;
                            me.registros[index].salathasta = item.salathasta;
                            me.registros[index].salonghasta = item.salonghasta;
                            me.registros[index].satarifa = item.satarifa;
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
                case 'do' : {
                    if (!item.dohoras){
                        var indice = item.doid;
                        axios.delete('api/Registros/Eliminar/'+indice,configuracion).then( () => {
                            let itemIndex = me.registros.indexOf(item);
                            var fhaux = new Date(new Date(item.dofecregistracion).getTime() - new Date(item.dofecregistracion).getTimezoneOffset() * 60000).toISOString();
                            //console.log(new Date(), item.dofecregistracion, new Date(item.dofecregistracion), fhaux);
                            me.registros[itemIndex].dohoras = '';
                            me.registros[itemIndex].dofhdesde = fhaux;
                            me.registros[itemIndex].dofhhasta = fhaux;
                            me.registros[itemIndex].dotarifa = 0;
                            me.registros[itemIndex].docosto = 0;
                            me.registros[itemIndex].doid = '';
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

                    } else if (item.doid){
                        var index = '';
                        var a = item.dohoras.split(':')
                        var dominutos = (+a[0] * 60 + (+a[1]));
                        item.dofhhasta = new Date(new Date(item.dofhdesde).getTime() 
                                                + dominutos * 60000).toISOString();
                        item.dolathasta = me.latitude;
                        item.dolonghasta = me.longitude;
                        //console.log(item.dofecregistracion, item.dofhdesde, item.dofhhasta);
                        axios.put('api/Registros/Actualizarhoras',{
                            'Id':item.doid,
                            'fhdesde':item.dofhdesde,
                            'fhhasta':item.dofhhasta,
                            'minutos':dominutos,
                            'latdesde':item.dolatdesde,
                            'longdesde':item.dolongdesde,
                            'lathasta':item.dolathasta,
                            'longhasta':item.dolonghasta,
                            'iduserumod': me.$store.state.usuario.idusuario
                        },configuracion).then( () => {
                            index = me.registrosAll.findIndex(x => x.id == item.doid);
                            me.registrosAll[index].fhdesde = new Date(item.dofhdesde).toISOString().substr(0,19);
                            me.registrosAll[index].fhhasta = new Date(item.dofhhasta).toISOString().substr(0,19);
                            me.registrosAll[index].minutos = dominutos;
                            let itemIndex = me.registros.indexOf(item);
                            me.registros[itemIndex].dofhdesde = new Date(item.dofhdesde).toISOString().substr(0,19);
                            me.registros[itemIndex].dofhhasta = new Date(item.dofhhasta).toISOString().substr(0,19);
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
                        var a = item.dohoras.split(':')
                        var dominutos = (+a[0] * 60 + (+a[1]));
                        item.dofhdesde = new Date(new Date(item.dofecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.dofecregistracion).getTimezoneOffset() * 60000).toISOString();
                        item.dofhhasta = new Date(new Date(item.dofecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.dofecregistracion).getTimezoneOffset() * 60000 + dominutos * 60000).toISOString();
                        item.dolatdesde = me.latitude;
                        item.dolongdesde = me.longitude; 
                        item.dolathasta = me.latitude;
                        item.dolonghasta = me.longitude;
                        var tarifa = me.determinaTarifa(item.proyectoid, item.usuarioid);
                        var costo = me.determinaCosto(item.proyectoid, item.usuarioid);
                        //console.log(item.dofecregistracion, item.dofhdesde, item.dofhhasta);
                        axios.post('api/Registros/Crear',{
                            'actividad': '',
                            'usuarioid': item.usuarioid,
                            'proyectoid': item.proyectoid,
                            'tareaid': item.tareaid,
                            'fecregistracion': item.dofecregistracion.substr(0,10),
                            'facturable': me.proyectos.find(x => x.value == item.proyectoid).facturable,
                            'liquidable': me.proyectos.find(x => x.value == item.proyectoid).liquidable,
                            'fhdesde': item.dofhdesde,
                            'fhhasta': item.dofhhasta,
                            'minutos':dominutos,
                            'latdesde':item.dolatdesde,
                            'longdesde':item.dolongdesde,
                            'lathasta':item.dolathasta,
                            'longhasta':item.dolonghasta,
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
                            var index = 0;
                            var auxpro = '';
                            var auxtar = '';
                            var auxusu = '';
                            index = me.registrosAll.push(response.data);
                            auxusu = +me.$store.state.usuario.idusuario;
                            auxpro = me.registrosAll[index-1].proyectoid;
                            auxtar = me.registrosAll[index-1].tareaid;
                            me.registrosAll[index-1].proyecto = me.proyectos.find(x => x.value === auxpro).text;
                            me.registrosAll[index-1].tarea = auxtar?me.tareas.find(x => x.value === auxtar).text:'';
                            index = me.registros.findIndex(x => x.usuarioid === auxusu &&
                                                                x.proyectoid == auxpro &&
                                                                x.tareaid == auxtar);
                            me.registros[index].dofacturable = me.proyectos.find(x => x.value == auxpro).facturable;
                            me.registros[index].doliquidable = me.proyectos.find(x => x.value == auxpro).liquidable;
                            me.registros[index].dofhdesde = new Date(item.dofhdesde).toISOString().substr(0,19);
                            me.registros[index].dofhhasta = new Date(item.dofhhasta).toISOString().substr(0,19);
                            me.registros[index].dohoras = item.dohoras;
                            me.registros[index].doid = response.data.id;
                            me.registros[index].dolatdesde = item.dolatdesde;
                            me.registros[index].dolongdesde = item.dolongdesde;
                            me.registros[index].dolathasta = item.dolathasta;
                            me.registros[index].dolonghasta = item.dolonghasta;
                            me.registros[index].dotarifa = item.dotarifa;
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
            }
        },
        editLuRegistroFull(item){
            var me=this;
            me.usuarioid = item.usuarioid;
            me.proyectoid = item.proyectoid;
            me.tareaid = item.tareaid;
            me.fecregistracion = item.fecregistracion;
            if (!item.lufhdesde){
                item.luhoras=item.luhoras?item.luhoras:"00:00";
                var a = item.luhoras.split(':')
                var luminutos = (+a[0] * 60 + (+a[1]));
                item.lufhdesde = new Date(new Date(item.lufecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.lufecregistracion).getTimezoneOffset() * 60000).toISOString();
                item.lufhhasta = new Date(new Date(item.lufecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.lufecregistracion).getTimezoneOffset() * 60000 + luminutos * 60000).toISOString();
            }
            me.lufdesde=new Date(new Date(item.lufhdesde).getTime() + new Date(item.lufhdesde).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.luhdesde=new Date(new Date(item.lufhdesde).getTime() + new Date(item.lufhdesde).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.lufhasta=new Date(new Date(item.lufhhasta).getTime() + new Date(item.lufhhasta).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.luhhasta=new Date(new Date(item.lufhhasta).getTime() + new Date(item.lufhhasta).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.luhoras=item.luhoras;
            me.ludialog=true;
            me.editedIndex=1;
        },
        armaLuHoras(item){
            let me=this;
            var msec = 0, mins = 0, hrs = 0, a = [], lumindesde = 0, luminhasta = 0;
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
                            - new Date(me.lufhasta + ' ' + me.luhdesde).getTimezoneOffset() * 60000
                            + 24 * 60 * 60000).toISOString().substr(0,10);
                if (me.luhhasta > me.luhdesde) {
                    me.luhhasta = new Date(new Date(me.lufhasta + ' ' + me.luhdesde).getTime() 
                            - new Date(me.lufhasta + ' ' + me.luhdesde).getTimezoneOffset() * 60000
                            - 1 * 60000).toISOString().substr(11,5);
                }
            }
            a = me.luhdesde.split(':')
            lumindesde = (+a[0] * 60 + (+a[1]));
            a = me.luhhasta.split(':')
            luminhasta = (+a[0] * 60 + (+a[1]));
            msec = new Date(me.lufhasta).getTime() + luminhasta * 60000 - (new Date(me.lufdesde).getTime() + lumindesde * 60000 );
            mins = Math.floor(msec / 60000);
            hrs = Math.floor(mins / 60);
            mins = mins % 60;
            me.luhoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
        },
        confirmaLuhoras(item){
            let me=this;
            var a = me.luhdesde.split(':')
            var lumindesde = (+a[0] * 60 + (+a[1]));
            var a = me.luhhasta.split(':')
            var luminhasta = (+a[0] * 60 + (+a[1]));
            item.lufhdesde = new Date(new Date(me.lufdesde).getTime() + lumindesde * 60000 
                    - new Date(me.lufdesde).getTimezoneOffset() * 60000).toISOString();
            item.lufhhasta = new Date(new Date(me.lufhasta).getTime() + luminhasta * 60000 
                    - new Date(me.lufdesde).getTimezoneOffset() * 60000).toISOString();
            item.luhoras = me.luhoras;
            this.closeLu();
        },
        closeLu () {
            this.ludialog = false
        },
        editMaRegistroFull(item){
            var me=this;
            me.usuarioid = item.usuarioid;
            me.proyectoid = item.proyectoid;
            me.tareaid = item.tareaid;
            me.fecregistracion = item.fecregistracion;
            if (!item.mafhdesde){
                item.mahoras=item.mahoras?item.mahoras:"00:00";
                var a = item.mahoras.split(':')
                var maminutos = (+a[0] * 60 + (+a[1]));
                item.mafhdesde = new Date(new Date(item.mafecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.mafecregistracion).getTimezoneOffset() * 60000).toISOString();
                item.mafhhasta = new Date(new Date(item.mafecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.mafecregistracion).getTimezoneOffset() * 60000 + maminutos * 60000).toISOString();
            }
            me.mafdesde=new Date(new Date(item.mafhdesde).getTime() + new Date(item.mafhdesde).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.mahdesde=new Date(new Date(item.mafhdesde).getTime() + new Date(item.mafhdesde).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.mafhasta=new Date(new Date(item.mafhhasta).getTime() + new Date(item.mafhhasta).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.mahhasta=new Date(new Date(item.mafhhasta).getTime() + new Date(item.mafhhasta).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.mahoras=item.mahoras;
            me.madialog=true;
            me.editedIndex=1;
        },
        armaMaHoras(item){
            let me=this;
            var msec = 0, mins = 0, hrs = 0, a = [], mamindesde = 0, maminhasta = 0;
            if (me.mafhasta < me.mafdesde) {
                me.mafhasta = me.mafdesde;
            }
            if (me.mafhasta == me.mafdesde) {
                if (me.mahhasta < me.mahdesde) {
                    me.mahhasta = me.mahdesde;
                }
            }
            if (me.mafhasta > me.mafdesde) {
                me.mafhasta = new Date(new Date(me.mafdesde).getTime()
                            - new Date(me.mafhasta + ' ' + me.mahdesde).getTimezoneOffset() * 60000
                            + 24 * 60 * 60000).toISOString().substr(0,10);
                if (me.mahhasta > me.mahdesde) {
                    me.mahhasta = new Date(new Date(me.mafhasta + ' ' + me.mahdesde).getTime() 
                            - new Date(me.mafhasta + ' ' + me.mahdesde).getTimezoneOffset() * 60000
                            - 1 * 60000).toISOString().substr(11,5);
                }
            }
            a = me.mahdesde.split(':')
            mamindesde = (+a[0] * 60 + (+a[1]));
            a = me.mahhasta.split(':')
            maminhasta = (+a[0] * 60 + (+a[1]));
            msec = new Date(me.mafhasta).getTime() + maminhasta * 60000 - (new Date(me.mafdesde).getTime() + mamindesde * 60000 );
            mins = Math.floor(msec / 60000);
            hrs = Math.floor(mins / 60);
            mins = mins % 60;
            me.mahoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
        },
        confirmaMahoras(item){
            let me=this;
            var a = me.mahdesde.split(':')
            var mamindesde = (+a[0] * 60 + (+a[1]));
            var a = me.mahhasta.split(':')
            var maminhasta = (+a[0] * 60 + (+a[1]));
            item.mafhdesde = new Date(new Date(me.mafdesde).getTime() + mamindesde * 60000 
                    - new Date(me.mafdesde).getTimezoneOffset() * 60000).toISOString();
            item.mafhhasta = new Date(new Date(me.mafhasta).getTime() + maminhasta * 60000 
                    - new Date(me.mafdesde).getTimezoneOffset() * 60000).toISOString();
            item.mahoras = me.mahoras;
            this.closeMa();
        },
        closeMa () {
            this.madialog = false
        },
        editMiRegistroFull(item){
            var me=this;
            me.usuarioid = item.usuarioid;
            me.proyectoid = item.proyectoid;
            me.tareaid = item.tareaid;
            me.fecregistracion = item.fecregistracion;
            if (!item.mifhdesde){
                item.mihoras=item.mihoras?item.mihoras:"00:00";
                var a = item.mihoras.split(':')
                var miminutos = (+a[0] * 60 + (+a[1]));
                item.mifhdesde = new Date(new Date(item.mifecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.mifecregistracion).getTimezoneOffset() * 60000).toISOString();
                item.mifhhasta = new Date(new Date(item.mifecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.mifecregistracion).getTimezoneOffset() * 60000 + miminutos * 60000).toISOString();
            }
            me.mifdesde=new Date(new Date(item.mifhdesde).getTime() + new Date(item.mifhdesde).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.mihdesde=new Date(new Date(item.mifhdesde).getTime() + new Date(item.mifhdesde).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.mifhasta=new Date(new Date(item.mifhhasta).getTime() + new Date(item.mifhhasta).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.mihhasta=new Date(new Date(item.mifhhasta).getTime() + new Date(item.mifhhasta).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.mihoras=item.mihoras;
            me.midialog=true;
            me.editedIndex=1;
        },
        armaMiHoras(item){
            let me=this;
            var msec = 0, mins = 0, hrs = 0, a = [], lumindesde = 0, luminhasta = 0;
            if (me.mifhasta < me.mifdesde) {
                me.mifhasta = me.mifdesde;
            }
            if (me.mifhasta == me.mifdesde) {
                if (me.mihhasta < me.mihdesde) {
                    me.mihhasta = me.mihdesde;
                }
            }
            if (me.mifhasta > me.mifdesde) {
                me.mifhasta = new Date(new Date(me.mifdesde).getTime()
                            - new Date(me.mifhasta + ' ' + me.mihdesde).getTimezoneOffset() * 60000
                            + 24 * 60 * 60000).toISOString().substr(0,10);
                if (me.mihhasta > me.mihdesde) {
                    me.mihhasta = new Date(new Date(me.mifhasta + ' ' + me.mihdesde).getTime() 
                            - new Date(me.mifhasta + ' ' + me.mihdesde).getTimezoneOffset() * 60000
                            - 1 * 60000).toISOString().substr(11,5);
                }
            }
            a = me.mihdesde.split(':')
            mimindesde = (+a[0] * 60 + (+a[1]));
            a = me.mihhasta.split(':')
            miminhasta = (+a[0] * 60 + (+a[1]));
            msec = new Date(me.mifhasta).getTime() + miminhasta * 60000 - (new Date(me.mifdesde).getTime() + mimindesde * 60000 );
            mins = Math.floor(msec / 60000);
            hrs = Math.floor(mins / 60);
            mins = mins % 60;
            me.mihoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
        },
        confirmaMihoras(item){
            let me=this;
            var a = me.mihdesde.split(':')
            var mimindesde = (+a[0] * 60 + (+a[1]));
            var a = me.mihhasta.split(':')
            var miminhasta = (+a[0] * 60 + (+a[1]));
            item.mifhdesde = new Date(new Date(me.mifdesde).getTime() + mimindesde * 60000 - new Date(me.mifdesde).getTimezoneOffset() * 60000).toISOString();
            item.mifhhasta = new Date(new Date(me.mifhasta).getTime() + miminhasta * 60000 - new Date(me.mifdesde).getTimezoneOffset() * 60000).toISOString();
            item.mihoras = me.mihoras;
            this.closeMi();
        },
        closeMi () {
            this.midialog = false
        },
        editJuRegistroFull(item){
            var me=this;
            me.usuarioid = item.usuarioid;
            me.proyectoid = item.proyectoid;
            me.tareaid = item.tareaid;
            me.fecregistracion = item.fecregistracion;
            if (!item.jufhdesde){
                item.juhoras=item.juhoras?item.juhoras:"00:00";
                var a = item.juhoras.split(':')
                var juminutos = (+a[0] * 60 + (+a[1]));
                item.jufhdesde = new Date(new Date(item.jufecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.jufecregistracion).getTimezoneOffset() * 60000).toISOString();
                item.jufhhasta = new Date(new Date(item.jufecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.jufecregistracion).getTimezoneOffset() * 60000 + juminutos * 60000).toISOString();
            }
            me.jufdesde=new Date(new Date(item.jufhdesde).getTime() + new Date(item.jufhdesde).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.juhdesde=new Date(new Date(item.jufhdesde).getTime() + new Date(item.jufhdesde).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.jufhasta=new Date(new Date(item.jufhhasta).getTime() + new Date(item.jufhhasta).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.juhhasta=new Date(new Date(item.jufhhasta).getTime() + new Date(item.jufhhasta).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.juhoras=item.juhoras;
            me.judialog=true;
            me.editedIndex=1;
        },
        armaJuHoras(item){
            let me=this;
            var msec = 0, mins = 0, hrs = 0, a = [], jumindesde = 0, juminhasta = 0;
            if (me.jufhasta < me.jufdesde) {
                me.jufhasta = me.jufdesde;
            }
            if (me.jufhasta == me.jufdesde) {
                if (me.juhhasta < me.juhdesde) {
                    me.juhhasta = me.juhdesde;
                }
            }
            if (me.jufhasta > me.jufdesde) {
                me.jufhasta = new Date(new Date(me.jufdesde).getTime()
                            - new Date(me.jufhasta + ' ' + me.juhdesde).getTimezoneOffset() * 60000
                            + 24 * 60 * 60000).toISOString().substr(0,10);
                if (me.juhhasta > me.juhdesde) {
                    me.juhhasta = new Date(new Date(me.jufhasta + ' ' + me.juhdesde).getTime() 
                            - new Date(me.jufhasta + ' ' + me.juhdesde).getTimezoneOffset() * 60000
                            - 1 * 60000).toISOString().substr(11,5);
                }
            }
            a = me.juhdesde.split(':')
            jumindesde = (+a[0] * 60 + (+a[1]));
            a = me.juhhasta.split(':')
            juminhasta = (+a[0] * 60 + (+a[1]));
            msec = new Date(me.jufhasta).getTime() + juminhasta * 60000 - (new Date(me.jufdesde).getTime() + jumindesde * 60000 );
            mins = Math.floor(msec / 60000);
            hrs = Math.floor(mins / 60);
            mins = mins % 60;
            me.juhoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
        },
        confirmaJuhoras(item){
            let me=this;
            var a = me.juhdesde.split(':')
            var jumindesde = (+a[0] * 60 + (+a[1]));
            var a = me.juhhasta.split(':')
            var juminhasta = (+a[0] * 60 + (+a[1]));
            item.jufhdesde = new Date(new Date(me.jufdesde).getTime() + jumindesde * 60000 - new Date(me.jufdesde).getTimezoneOffset() * 60000).toISOString();
            item.jufhhasta = new Date(new Date(me.jufhasta).getTime() + juminhasta * 60000 - new Date(me.jufdesde).getTimezoneOffset() * 60000).toISOString();
            item.juhoras = me.juhoras;
            this.closeJu();
        },
        closeJu () {
            this.judialog = false
        },
        editViRegistroFull(item){
            var me=this;
            me.usuarioid = item.usuarioid;
            me.proyectoid = item.proyectoid;
            me.tareaid = item.tareaid;
            me.fecregistracion = item.fecregistracion;
            if (!item.vifhdesde){
                item.vihoras=item.vihoras?item.vihoras:"00:00";
                var a = item.vihoras.split(':')
                var viminutos = (+a[0] * 60 + (+a[1]));
                item.vifhdesde = new Date(new Date(item.vifecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.vifecregistracion).getTimezoneOffset() * 60000).toISOString();
                item.vifhhasta = new Date(new Date(item.vifecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.vifecregistracion).getTimezoneOffset() * 60000 + viminutos * 60000).toISOString();
            }
            me.vifdesde=new Date(new Date(item.vifhdesde).getTime() + new Date(item.vifhdesde).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.vihdesde=new Date(new Date(item.vifhdesde).getTime() + new Date(item.vifhdesde).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.vifhasta=new Date(new Date(item.vifhhasta).getTime() + new Date(item.vifhhasta).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.vihhasta=new Date(new Date(item.vifhhasta).getTime() + new Date(item.vifhhasta).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.vihoras=item.vihoras;
            me.vidialog=true;
            me.editedIndex=1;
        },
        armaViHoras(item){
            let me=this;
            var msec = 0, mins = 0, hrs = 0, a = [], vimindesde = 0, viminhasta = 0;
            if (me.vifhasta < me.vifdesde) {
                me.vifhasta = me.vifdesde;
            }
            if (me.vifhasta == me.vifdesde) {
                if (me.vihhasta < me.vihdesde) {
                    me.vihhasta = me.vihdesde;
                }
            }
            if (me.vifhasta > me.vifdesde) {
                me.vifhasta = new Date(new Date(me.vifdesde).getTime()
                            - new Date(me.vifhasta + ' ' + me.vihdesde).getTimezoneOffset() * 60000
                            + 24 * 60 * 60000).toISOString().substr(0,10);
                if (me.vihhasta > me.vihdesde) {
                    me.vihhasta = new Date(new Date(me.vifhasta + ' ' + me.vihdesde).getTime() 
                            - new Date(me.vifhasta + ' ' + me.vihdesde).getTimezoneOffset() * 60000
                            - 1 * 60000).toISOString().substr(11,5);
                }
            }
            a = me.vihdesde.split(':')
            vimindesde = (+a[0] * 60 + (+a[1]));
            a = me.vihhasta.split(':')
            viminhasta = (+a[0] * 60 + (+a[1]));
            msec = new Date(me.vifhasta).getTime() + viminhasta * 60000 - (new Date(me.vifdesde).getTime() + vimindesde * 60000 );
            mins = Math.floor(msec / 60000);
            hrs = Math.floor(mins / 60);
            mins = mins % 60;
            me.vihoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
        },
        confirmaVihoras(item){
            let me=this;
            var a = me.vihdesde.split(':')
            var vimindesde = (+a[0] * 60 + (+a[1]));
            var a = me.vihhasta.split(':')
            var viminhasta = (+a[0] * 60 + (+a[1]));
            item.vifhdesde = new Date(new Date(me.vifdesde).getTime() + vimindesde * 60000 - new Date(me.vifdesde).getTimezoneOffset() * 60000).toISOString();
            item.vifhhasta = new Date(new Date(me.vifhasta).getTime() + viminhasta * 60000 - new Date(me.vifdesde).getTimezoneOffset() * 60000).toISOString();
            item.vihoras = me.vihoras;
            this.closeVi();
        },
        closeVi () {
            this.vidialog = false
        },
        editSaRegistroFull(item){
            var me=this;
            me.usuarioid = item.usuarioid;
            me.proyectoid = item.proyectoid;
            me.tareaid = item.tareaid;
            me.fecregistracion = item.fecregistracion;
            if (!item.safhdesde){
                item.sahoras=item.sahoras?item.sahoras:"00:00";
                var a = item.sahoras.split(':')
                var saminutos = (+a[0] * 60 + (+a[1]));
                item.safhdesde = new Date(new Date(item.safecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.safecregistracion).getTimezoneOffset() * 60000).toISOString();
                item.safhhasta = new Date(new Date(item.safecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.safecregistracion).getTimezoneOffset() * 60000 + saminutos * 60000).toISOString();
            }
            me.safdesde=new Date(new Date(item.safhdesde).getTime() + new Date(item.safhdesde).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.sahdesde=new Date(new Date(item.safhdesde).getTime() + new Date(item.safhdesde).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.safhasta=new Date(new Date(item.safhhasta).getTime() + new Date(item.safhhasta).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.sahhasta=new Date(new Date(item.safhhasta).getTime() + new Date(item.safhhasta).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.sahoras=item.sahoras;
            me.sadialog=true;
            me.editedIndex=1;
        },
        armaSaHoras(item){
            let me=this;
            var msec = 0, mins = 0, hrs = 0, a = [], samindesde = 0, saminhasta = 0;
            if (me.safhasta < me.safdesde) {
                me.safhasta = me.safdesde;
            }
            if (me.safhasta == me.safdesde) {
                if (me.sahhasta < me.sahdesde) {
                    me.sahhasta = me.sahdesde;
                }
            }
            if (me.safhasta > me.safdesde) {
                me.safhasta = new Date(new Date(me.safdesde).getTime()
                            - new Date(me.safhasta + ' ' + me.sahdesde).getTimezoneOffset() * 60000
                            + 24 * 60 * 60000).toISOString().substr(0,10);
                if (me.sahhasta > me.sahdesde) {
                    me.sahhasta = new Date(new Date(me.safhasta + ' ' + me.sahdesde).getTime() 
                            - new Date(me.safhasta + ' ' + me.sahdesde).getTimezoneOffset() * 60000
                            - 1 * 60000).toISOString().substr(11,5);
                }
            }
            a = me.sahdesde.split(':')
            samindesde = (+a[0] * 60 + (+a[1]));
            a = me.sahhasta.split(':')
            saminhasta = (+a[0] * 60 + (+a[1]));
            msec = new Date(me.safhasta).getTime() + saminhasta * 60000 - (new Date(me.safdesde).getTime() + samindesde * 60000 );
            mins = Math.floor(msec / 60000);
            hrs = Math.floor(mins / 60);
            mins = mins % 60;
            me.sahoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
        },
        confirmaSahoras(item){
            let me=this;
            var a = me.sahdesde.split(':')
            var samindesde = (+a[0] * 60 + (+a[1]));
            var a = me.sahhasta.split(':')
            var saminhasta = (+a[0] * 60 + (+a[1]));
            item.safhdesde = new Date(new Date(me.safdesde).getTime() + samindesde * 60000 - new Date(me.safdesde).getTimezoneOffset() * 60000).toISOString();
            item.safhhasta = new Date(new Date(me.safhasta).getTime() + saminhasta * 60000 - new Date(me.safdesde).getTimezoneOffset() * 60000).toISOString();
            item.sahoras = me.sahoras;
            this.closeSa();
        },
        closeSa () {
            this.sadialog = false
        },
        editDoRegistroFull(item){
            var me=this;
            me.usuarioid = item.usuarioid;
            me.proyectoid = item.proyectoid;
            me.tareaid = item.tareaid;
            me.fecregistracion = item.fecregistracion;
            if (!item.dofhdesde){
                item.dohoras=item.dohoras?item.dohoras:"00:00";
                var a = item.dohoras.split(':')
                var dominutos = (+a[0] * 60 + (+a[1]));
                item.dofhdesde = new Date(new Date(item.dofecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.dofecregistracion).getTimezoneOffset() * 60000).toISOString();
                item.dofhhasta = new Date(new Date(item.dofecregistracion).getTime() + me.$store.state.userinfo.primerahora * 60000 - new Date(item.dofecregistracion).getTimezoneOffset() * 60000 + dominutos * 60000).toISOString();
            }
            me.dofdesde=new Date(new Date(item.dofhdesde).getTime() + new Date(item.dofhdesde).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.dohdesde=new Date(new Date(item.dofhdesde).getTime() + new Date(item.dofhdesde).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.dofhasta=new Date(new Date(item.dofhhasta).getTime() + new Date(item.dofhhasta).getTimezoneOffset() * 60000).toISOString().substr(0,10);
            me.dohhasta=new Date(new Date(item.dofhhasta).getTime() + new Date(item.dofhhasta).getTimezoneOffset() * 60000).toISOString().substr(11,5);
            me.dohoras=item.dohoras;
            me.dodialog=true;
            me.editedIndex=1;
        },
        armaDoHoras(item){
            let me=this;
            var msec = 0, mins = 0, hrs = 0, a = [], domindesde = 0, dominhasta = 0;
            if (me.dofhasta < me.dofdesde) {
                me.dofhasta = me.dofdesde;
            }
            if (me.dofhasta == me.dofdesde) {
                if (me.dohhasta < me.dohdesde) {
                    me.dohhasta = me.dohdesde;
                }
            }
            if (me.dofhasta > me.dofdesde) {
                me.dofhasta = new Date(new Date(me.dofdesde).getTime()
                            - new Date(me.dofhasta + ' ' + me.dohdesde).getTimezoneOffset() * 60000
                            + 24 * 60 * 60000).toISOString().substr(0,10);
                if (me.dohhasta > me.dohdesde) {
                    me.dohhasta = new Date(new Date(me.dofhasta + ' ' + me.dohdesde).getTime() 
                            - new Date(me.dofhasta + ' ' + me.dohdesde).getTimezoneOffset() * 60000
                            - 1 * 60000).toISOString().substr(11,5);
                }
            }
            a = me.dohdesde.split(':')
            domindesde = (+a[0] * 60 + (+a[1]));
            a = me.dohhasta.split(':')
            dominhasta = (+a[0] * 60 + (+a[1]));
            msec = new Date(me.dofhasta).getTime() + dominhasta * 60000 - (new Date(me.dofdesde).getTime() + domindesde * 60000 );
            mins = Math.floor(msec / 60000);
            hrs = Math.floor(mins / 60);
            mins = mins % 60;
            me.dohoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
        },
        confirmaDohoras(item){
            let me=this;
            var a = me.dohdesde.split(':')
            var domindesde = (+a[0] * 60 + (+a[1]));
            var a = me.dohhasta.split(':')
            var dominhasta = (+a[0] * 60 + (+a[1]));
            item.dofhdesde = new Date(new Date(me.dofdesde).getTime() + domindesde * 60000 - new Date(me.dofdesde).getTimezoneOffset() * 60000).toISOString();
            item.dofhhasta = new Date(new Date(me.dofhasta).getTime() + dominhasta * 60000 - new Date(me.dofdesde).getTimezoneOffset() * 60000).toISOString();
            item.dohoras = me.dohoras;
            this.closeDo();
        },
        closeDo () {
            this.dodialog = false
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
                me.headersregistros[ i + 2 ].text = me.fechas[ ii + i ].dtext;
                me.headersregistros[ i + 2 ].fecha = me.fechas[ ii + i ].fecha;
            }
        },
        setItems(tipo,day){
            let me=this;
            var index = 0;
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
            var aux = 0;
            var registrosArray=[];
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
                    coltexto: registrosArray[i].coltexto, colfondo: registrosArray[i].colfondo,
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
                        me.registros[index].mafhdesde = new Date(new Date(registrosArray[i].fhdesde).getTime() - new Date(registrosArray[i].fhdesde).getTimezoneOffset() * 60000 ).toISOString();
                        me.registros[index].mafhhasta = new Date(new Date(registrosArray[i].fhhasta).getTime() - new Date(registrosArray[i].fhhasta).getTimezoneOffset() * 60000 ).toISOString();
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
                        me.registros[index].mifhdesde = new Date(new Date(registrosArray[i].fhdesde).getTime() - new Date(registrosArray[i].fhdesde).getTimezoneOffset() * 60000 ).toISOString();
                        me.registros[index].mifhhasta = new Date(new Date(registrosArray[i].fhhasta).getTime() - new Date(registrosArray[i].fhhasta).getTimezoneOffset() * 60000 ).toISOString();
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
                        me.registros[index].jufhdesde = new Date(new Date(registrosArray[i].fhdesde).getTime() - new Date(registrosArray[i].fhdesde).getTimezoneOffset() * 60000 ).toISOString();
                        me.registros[index].jufhhasta = new Date(new Date(registrosArray[i].fhhasta).getTime() - new Date(registrosArray[i].fhhasta).getTimezoneOffset() * 60000 ).toISOString();
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
                        me.registros[index].vifhdesde = new Date(new Date(registrosArray[i].fhdesde).getTime() - new Date(registrosArray[i].fhdesde).getTimezoneOffset() * 60000 ).toISOString();
                        me.registros[index].vifhhasta = new Date(new Date(registrosArray[i].fhhasta).getTime() - new Date(registrosArray[i].fhhasta).getTimezoneOffset() * 60000 ).toISOString();
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
                        me.registros[index].safhdesde = new Date(new Date(registrosArray[i].fhdesde).getTime() - new Date(registrosArray[i].fhdesde).getTimezoneOffset() * 60000 ).toISOString();
                        me.registros[index].safhhasta = new Date(new Date(registrosArray[i].fhhasta).getTime() - new Date(registrosArray[i].fhhasta).getTimezoneOffset() * 60000 ).toISOString();
                        me.registros[index].sahoras = ('0'+hrs).slice(-2) + ":" + ('0' + mins).slice(-2);
                        me.registros[index].salatdesde = registrosArray[i].latdesde;
                        me.registros[index].salongdesde = registrosArray[i].longdesde;
                        me.registros[index].salathasta = registrosArray[i].lathasta
                        me.registros[index].salonghasta = registrosArray[i].longhasta;
                        me.registros[index].satarifa = registrosArray[i].tarifa;
                        me.registros[index].sacosto = registrosArray[i].costo;
                        break;
                    case 0:
                        me.registros[index].dofecregistracion =  registrosArray[i].fecregistracion;
                        me.registros[index].doid = registrosArray[i].id;
                        me.registros[index].doactividad = registrosArray[i].actividad;
                        me.registros[index].dofacturable = registrosArray[i].facturable;
                        me.registros[index].doliquidable = registrosArray[i].liquidable;
                        me.registros[index].dofhdesde = new Date(new Date(registrosArray[i].fhdesde).getTime() - new Date(registrosArray[i].fhdesde).getTimezoneOffset() * 60000 ).toISOString();
                        me.registros[index].dofhhasta = new Date(new Date(registrosArray[i].fhhasta).getTime() - new Date(registrosArray[i].fhhasta).getTimezoneOffset() * 60000 ).toISOString();
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
            if (me.registros.length>0){
                let editedItem = me.registros[0];
                me.registros.splice(0, 1, editedItem);
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
                    {title: "Proyecto", dataKey: "proyecto"},
                    {title: "Tarea", dataKey: "tarea"},
                    {title: this.headersregistros[2].text, dataKey: "luhoras"},
                    {title: this.headersregistros[3].text, dataKey: "mahoras"},
                    {title: this.headersregistros[4].text, dataKey: "mihoras"},
                    {title: this.headersregistros[5].text, dataKey: "juhoras"},
                    {title: this.headersregistros[6].text, dataKey: "vihoras"},
                    {title: this.headersregistros[7].text, dataKey: "sahoras"},
                    {title: this.headersregistros[8].text, dataKey: "dohoras"},
                    {title: this.headersregistros[9].text, dataKey: "tohoras"},
            ];
            var rows = [];

            this.registros.map(function(x){
                    rows.push({proyecto:x.proyecto, tarea: x.tarea, luhoras: x.luhoras, mahoras: x.mahoras, mihoras: x.mihoras,
                        juhoras: x.juhoras, vihoras: x.vihoras, sahoras: x.sahoras, dohoras: x.dohoras, tohoras: x.tohoras});
            });
            rows.push({ proyecto: 'Total', luhoras: this.totalLun, mahoras: this.totalMar, mihoras: this.totalMie, 
                    juhoras: this.totalJue, vihoras: this.totalVie, sahoras: this.totalSab, dohoras: this.totalDom, 
                    tohoras: this.totalGral })
            // Only pt supported (not mm or in)
            var doc = new jsPDF('l', 'pt');
            doc.autoTable(columns, rows, {
                margin: {top: 60},
                addPageContent: () => {
                    doc.text("Listado de Registro Semanal", 40, 30);
                }
            });
            doc.save('RegistroSemanal.pdf');
        },
        close () {
            this.dialog = false
            this.limpiar();

        },
        limpiar(){
            this.id="";
            this.proyectoid="";
            this.tareaid="";
            this.iduseralta = "";
            this.fecalta = "";
            this.iduserumod = "";
            this.fecumod = "";
            this.activo = false;
            this.editedIndex=-1;
        },
        armaTareas(proid){
            let me=this;
            me.tareaid='';
            var tareaIds = [];
            tareaIds = me.proyectotareas.filter(x => x.proyectoid === proid).map(x => x.tareaid);
            me.tareasf = me.tareas.filter(function(dato){
                return (tareaIds.indexOf(dato.value) === -1);
            });
        },
        guardar(){
            let me=this;
            if (me.proyectoid) {
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
                var auxusu = +(me.$store.state.usuario.idusuario);
                var auxpro = me.proyectoid;
                var auxtar = me.tareaid==''?null:me.tareaid;
                var index = me.registros.findIndex(x => x.usuarioid == auxusu
                        && x.proyectoid == auxpro
                        && x.tareaid == auxtar
                    );
                if ( index == -1){
                    var protext = me.proyectos.find(x => x.value === me.proyectoid).text;
                    var coltext = me.proyectos.find(x => x.value === me.proyectoid).coltexto;
                    var colfond = me.proyectos.find(x => x.value === me.proyectoid).colfondo;
                    var tartext = auxtar?me.tareas.find(x => x.value === auxtar).text:'';
                    index = me.registros.push({
                        usuarioid: auxusu, proyectoid: auxpro, tareaid: auxtar, 
                        proyecto: protext, tarea: tartext, 
                        coltexto: coltext, colfondo: colfond,
                        luhoras: '', mahoras: '', mihoras: '', juhoras: '', vihoras: '', sahoras: '', dohoras: '',
                        lufecregistracion: lun, mafecregistracion: mar, mifecregistracion: mie, jufecregistracion: jue, vifecregistracion: vie,
                        safecregistracion: sab, dofecregistracion: dom
                    });
                    me.snacktext = 'Creacion exitosa';
                    me.snackcolor = "success";
                    me.snackbar = true;
                    me.dialog = false;
                } else {
                    me.snacktext = 'No se pudo crear la combinacion';
                    me.snackcolor = 'error'
                    me.snackbar = true;
                }
            } else {
                    me.snacktext = 'Debe seleccionar Proyecto';
                    me.snackcolor = 'error'
                    me.snackbar = true;
            }
        }
   },
  }
</script>
