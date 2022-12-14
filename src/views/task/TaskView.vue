<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import axios from "axios";
export default {
    components: {
        FullCalendar // make the <FullCalendar> tag available
    },
    data: function () {
        return {
            baseUrl: "http://172.16.10.7:8000/api",
            queryInfo: {
                // 当前页面
                pagenum: 1,
                // 每页显示条数
                pagesize: 100,
            },
            writer_info: {
                pagenum: 1,
                pagesize: 100,
                query: false,
                rolename: 'writer',
            },
            calendarOptions: {
                plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin // needed for dateClick
                ],
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    // right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    right: 'timeGridWeek,timeGridDay'
                },
                initialView: 'timeGridWeek',
                editable: true,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                weekends: true,
                aspectRatio: 2.6,
                handleWindowResize: true,
                // dayMinWidth: 200,  // 日最小宽度，如果日期单元格没办法满足，会出现水平滚动条
                // select: this.handleDateSelect,
                // eventClick: this.handleEventClick,
                eventsSet: this.handleEvents,
                /* you can update a remote database when these fire:
                eventAdd:
                eventChange:
                eventRemove:
                */
                // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
                events: [],
            },
            currentEvents: [],
            wrietr_events: {
                "lx": [{ title: 'qing', start: '2022-10-19 11:20:00', end: '2022-10-19 16:20:00', allDay: false },
                { title: 'qing', start: '2022-10-19 09:20:00', end: '2022-10-19 13:20:00', allDay: false },
                { title: 'bobo', start: '2022-10-10' }],
            },
            writers: [
                {
                    "id": 2,
                    "role": "writer",
                    "roleid": 3,
                    "username": "lx",
                    "password": "abc",
                    "createtime": "2022-10-04 07:44:23",
                    "last_login": "2022-10-07 18:11:24",
                    "status": true
                },
            ],
            writer: '',
            writerId: '',
        }
    },
    created() {
    },
    methods: {
        // async getUserList() {
        //     let that = this;
        //     const { data: res } = await axios.get(that.baseUrl + "/user/login/", {
        //         params: this.queryInfo,
        //     });
        //     that.writers = res.result.filter(item => item["role"] == 'writer');
        // },
        getUserList() {
            let that = this;
            axios.get(that.baseUrl + "/user/login/", {
                params: this.queryInfo,
            }).then((res) => {
                that.writers = res.data.result.filter(item => item["role"] == 'writer');
            }).catch((error) => {
                that.$message.error(error);
            })
        },
        handleWeekendsToggle() {
            // console.log(this.calendarOptions)
            this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
        },
        handleDateSelect(selectInfo) {
            let title = prompt('Please enter a new title for your event')
            let calendarApi = selectInfo.view.calendar
            calendarApi.unselect() // clear date selection
            if (title) {
                calendarApi.addEvent({
                    id: createEventId(),
                    title,
                    start: selectInfo.startStr,
                    end: selectInfo.endStr,
                    allDay: selectInfo.allDay
                })
            }
        },
        handleEventClick(clickInfo) {
            if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
                clickInfo.event.remove()
            }
        },
        handleEvents(events) {
            this.currentEvents = events
        },
        changeWriter() {
            this.calendarOptions.events = []
            this.writerId = this.writers.filter(item => item['username'] == this.writer)[0]["id"]
            this.writer_info['userid'] = this.writerId
            axios.get(this.baseUrl + "/task/orderinfo/", {
                params: this.writer_info,
            }).then((res) => {
                let event_tem = []
                res.data.result.map((item) => {
                    let master_id = String(item.master_id)
                    let customer = String(item.customer)
                    let child = item["children"]
                    let child_event = child.map((ele) => {
                        let id = "master_id: " + master_id + "\xa0\xa0\xa0\xa0sub_id: " + String(ele["id"])
                        return {
                            title: id,
                            start: ele.start_time,
                            end: ele.end_time,
                            allDay: false
                        }
                    })
                    event_tem = event_tem.concat(child_event)
                    this.calendarOptions = {
                        plugins: [
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin // needed for dateClick
                        ],
                        headerToolbar: {
                            left: 'prev,next today',
                            center: 'title',
                            // right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            right: 'timeGridWeek,timeGridDay'
                        },
                        initialView: 'timeGridWeek',
                        // dayMinWidth: 20,  // 日最小宽度，如果日期单元格没办法满足，会出现水平滚动条
                        editable: true,
                        selectable: true,
                        selectMirror: true,
                        dayMaxEvents: true,
                        weekends: true,
                        handleWindowResize: true,
                        //handleWindowResize:true,//是否随浏览器窗口大小变化而自动变化, 默认值是 false
                        aspectRatio: 2.6,//日历的宽高比, 数字越大, 日历越扁
                        // select: this.handleDateSelect,
                        // eventClick: this.handleEventClick,
                        eventsSet: this.handleEvents,
                        events: event_tem,

                    }
                });

            }).catch((error) => {
                this.$message.error(error);
            })
        }
    }
}
</script>
    
<template>
    <!-- <div class='demo-app-sidebar-section'> -->
    <!-- <label> -->
    <!-- <input type='checkbox' :checked='calendarOptions.weekends' @change='handleWeekendsToggle' />
                    toggle weekends -->
    <!-- <b>select writer</b> -->
    <!--     
    <el-row>
        <el-col :span="4">
            <el-select v-model="writer" class="m-2" placeholder="Select Writer" @click="getUserList">
                <el-option v-for="item in writers" :key="item.id" :label=" item.username" :value=" item.username"
                    @click='changeWriter' />
            </el-select>
        </el-col>
        <el-col :span="20"></el-col>
    </el-row> -->

    <el-row>
        <el-select v-model="writer" class="m-2" placeholder="Select Writer" @click="getUserList">
            <el-option v-for="item in writers" :key="item.id" :label=" item.username" :value=" item.username"
                @click='changeWriter' />
        </el-select>
    </el-row>
    <!-- </label> -->
    <!-- </div> -->
    <!-- <div class='demo-app'> -->
    <!-- <div class='demo-app-sidebar'> -->
    <!-- <div class='demo-app-sidebar-section'>
                <h2>Instructions</h2>
                <ul>
                    <li>Select dates and you will be prompted to create a new event</li>
                    <li>Drag, drop, and resize events</li>
                    <li>Click an event to delete it</li>
                </ul>
            </div> -->

    <!-- <div class='demo-app-sidebar-section'>
                <h2>All Orders ({{ currentEvents.length }})</h2> -->
    <!-- <ul>
                    <li v-for='event in currentEvents' :key='event.id'> -->
    <!-- <b>{{ event.title }}</b> -->
    <!-- <br>
                        <b>起始时间： {{ event.start }}</b>
                        <br>
                        <b>截至时间： {{ event.end }}</b> -->
    <!-- </li>
                </ul> -->
    <!-- </div> -->
    <!-- </div> -->
    <div class='demo-app-main'>
        <FullCalendar class='demo-app-calendar' :options='calendarOptions'>
            <!-- <template v-slot:eventContent='arg'>
                    <b>{{ arg.timeText }}</b>
                    <i>{{ arg.event.title }}</i>
                </template> -->
        </FullCalendar>
    </div>
    <!-- </div> -->
</template>
    
<style lang='css' scoped>
/* h2 {
    margin: 0;
    font-size: 16px;
} */

ul {
    margin: 0;
    padding: 0 0 0 1.5em;
}

li {
    margin: 1.5em 0;
    padding: 20;
}

b {
    /* used for event dates/times */
    margin-right: 3px;
}

.demo-app {
    display: flex;
    min-height: 10%;
    font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
    font-size: 14px;
    position: relative;
    z-index: 99999;
}

.demo-app-sidebar {
    width: 300px;
    line-height: 1.5;
    background: #eaf9ff;
    border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
    padding: 2em;
}

.demo-app-main {
    flex-grow: 1;
    /* padding: 3em; */

}

/* .fc { */
    /* the calendar root */
    /* max-width: 1100px; */
    /* margin: 0 auto; */
/* } */
</style>