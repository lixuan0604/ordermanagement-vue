<template>
  <el-container>
<el-main>
  <!-- 主题区域 -->
  <el-tabs v-model="activeName" class="demo-tabs" @tab-change="filterStatusFunc">
    <el-tab-pane label="All orders" name='' />
    <el-tab-pane label="Not started" name=1 />
    <el-tab-pane label="Unassigned" name=6 />
    <el-tab-pane label="Ongoing" name=2 />
    <el-tab-pane label="Checking" name=5 />
    <el-tab-pane label="Finish" name=3 />
    <el-tab-pane label="Rejected" name=4 />
  </el-tabs>

  <el-row justify="space-between">
    <el-col :span="4">
      <el-input
        v-model="searchValue"
        placeholder="search"
        style="width:250px; float:left"
        class="input-with-select"
        clearable
      >
        <template #prepend>
          <!-- <el-button :icon="Search" /> -->
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </el-col>
    <el-col :span="10"></el-col>
    <el-col :span="8"></el-col>
    <el-col :span="2" >
      <router-link to="/createorder">
        <el-button type="primary"  style="float:right">Bulk order</el-button>
      </router-link>
    </el-col>
  </el-row>

  <el-table
    :data="filterPage"
    style="width: 100%;margin-top:10px;margin-bottom:10px"
    :row-key='newOrderId'
    stripe 
    border
    lazy
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <!-- <el-table-column prop="deadline" label="DeadLine" width="220" /> -->
    <el-table-column label="DeadLine" width="220" >
        <template #default="scope">
            <span v-if="scope.row.status==3" style="color:green">{{scope.row.deadline}}</span>
            <span v-else-if="scope.row.status__==7" style="color:red">{{scope.row.deadline}}</span>
            
            <span v-else >{{scope.row.deadline}}</span>
        </template>
    </el-table-column>
    <el-table-column prop="orderid" label="OrderId" width="220" />
    <!-- <el-table-column prop="status_" label="Status" width="180" /> -->
    <el-table-column prop="status_" label="Status" width="150" >
        <template #default="scope">
            <el-tag style="width:80px;color:black" v-if ="scope.row.status==1" type="info">{{scope.row.status_}}</el-tag>
            <el-tag style="width:80px" v-else-if ="scope.row.status==2" >{{scope.row.status_}}</el-tag>
            <el-tag style="width:80px" v-else-if ="scope.row.status==3" type="success">{{scope.row.status_}}</el-tag>
            <el-tag style="width:80px" v-else-if ="scope.row.status==4" type="danger">{{scope.row.status_}}</el-tag>
            <el-tag style="width:80px" v-else-if ="scope.row.status==5" type="warning">{{scope.row.status_}}</el-tag>
            <el-tag style="width:80px" v-else-if ="scope.row.status==6" type="info">{{scope.row.status_}}</el-tag>
        </template>
    </el-table-column>
    <el-table-column prop="writer_name" label="Writer" width="150" />
    <el-table-column prop="customer" label="Customer" />
    <el-table-column prop="remark" label="Remark" />
    <el-table-column prop="remark" label="Schedule" width="150" >
        <template #default="scope">
            <span v-if="scope.row.ismaster">
                <span v-if="scope.row.num_child!=0">
                    {{scope.row.num_child_done}}/{{scope.row.num_child}}
                </span>
                <span v-else>
                    0
                </span>

            </span>
            <!-- <span v-else>
                <span v-if="scope.row.status==3">1/1</span>
                <span v-else>0/1</span>
            </span> -->
        </template>
    </el-table-column>
    <el-table-column fixed="right" label="Operate" width="150" >
        <template #default="scope">
        <span v-if="scope.row.ismaster">
            <el-icon style="margin-right:10px; cursor:pointer;"  title="Assign writer" @click="selectTeacherFunc(scope.row)"><User /></el-icon>
            <el-icon style="margin-right:10px; cursor:pointer;" title="Edit master order" @click="editOrderDialog(scope.row)"><Edit /></el-icon>
            <el-icon v-if="scope.row.children" style="margin-right:10px; cursor:pointer;" title="Add suborder" @click="addSubOrder(scope.row)"><CirclePlus /></el-icon>
            <el-icon v-if="scope.row.num_child_done > 0" style="margin-right:10px; cursor:pointer;" title="Download order" @click="downOrder(scope.row)" ><Download /></el-icon>
        </span>
        <span v-else>
            <el-icon  style="margin-right:10px; cursor:pointer;"  title="Assign writer" @click="selectTeacherFunc(scope.row)"><User /></el-icon>
            <el-icon  style="margin-right:10px; cursor:pointer;" title="Edit sub order" @click="editOrderDialog(scope.row)"><Edit /></el-icon>

            <el-icon v-if="scope.row.status==4 || scope.row.status==5 || scope.row.status==3" style="margin-right:10px; cursor:pointer;" title="inspect" @click="inspectedDialog(scope.row)"><DocumentChecked /></el-icon>

        </span>
        </template>
    </el-table-column>
  </el-table>

    <!-- 分配老师对话框 -->
    <el-dialog v-model="assignTeacherVisible" title="Assign writer" width="25%" center>        
        <el-select v-model="selectTeacher" placeholder="Select writer" style="width:80%; margin-left:10%" >
        <el-option 
            v-for="item in selectTeacherOptions"
            :key="item.id"
            :label="item.username"
            :value="item.teacher"/>
        </el-select>
        <div style="color:red;font-size:2px;line-height:1rem; margin-left:45px;margin-right:45px">* The master order uniformly distributes the sub-orders that do not have writers assigned. <br/> Sub-orders can be assigned or modified by writers</div>

        <template #footer>
                    <span class="dialog-footer">
            

            <el-button @click="assignTeacherVisible = false">Cancel</el-button>
            <el-button  @click="assignTeacherFunc" v-preventReClick
            >Submit</el-button>
        </span>
        </template>
    </el-dialog>
    <!-- 质检 -->
    <el-dialog title="inspected" v-model="inspectedVisible" width="50%">
        <span class="dialog-footer">
        <el-input
            v-model="textForm.textarea"
            disabled
            :autosize="{ minRows: 10, maxRows: 4000 }"
            type="textarea"
            placeholder="Please input"
        />
        <el-row>
        <el-col :span="3">
            <label>Comment:</label>
        </el-col>
        <el-col :span="21"><el-input v-model="textForm.comment"></el-input></el-col>
        </el-row>
        <el-button type="primary" @click="inspectedDone" v-preventReClick>Pass</el-button>
        <el-button type="primary" @click="inspectedNo" v-preventReClick>Rejected</el-button>
        <el-button @click="inspectedVisible = false">Cancel</el-button>
        </span>
    </el-dialog>

    <!-- 编辑订单对话框 -->
    <el-dialog v-model="editOrderVisible" title="Edit order" width="25%" center>        
        <el-form ref='masterRef' v-if="ismaster"  :model="editMasterOrderForm" label-position='right' label-width="100px" style="margin-right:15px;margin-bottom:0px">
            <el-form-item
                prop="orderid"
                label="OrderId"
                >
                <el-input v-model="editMasterOrderForm.orderid" />
            </el-form-item>
            <el-form-item
                prop="customer"
                label="Customer"
                :rules="[
                    {
                    required: true,
                    message: 'Please input customer name',
                    trigger: 'blur',
                    },
                ]"
                >
                <el-input v-model="editMasterOrderForm.customer" />
            </el-form-item>
            <el-form-item
                prop="uni"
                label="University"
                :rules="[
                    {
                    required: true,
                    message: 'Please input University',
                    trigger: 'blur',
                    },
                ]"
                >
                <el-input v-model="editMasterOrderForm.uni" />
            </el-form-item>
            <el-form-item
                prop="major"
                label="Major"
                :rules="[
                    {
                    required: true,
                    message: 'Please input major',
                    trigger: 'blur',
                    },
                ]"
                >
                <el-input v-model="editMasterOrderForm.major" />
            </el-form-item>
            <el-form-item
                prop="remark"
                label="Remark"
                :rules="[
                    {
                    required: true,
                    message: 'Please input Remark',
                    trigger: 'blur',
                    },
                ]"
                >
                <el-input v-model="editMasterOrderForm.remark" />
            </el-form-item>
            <span v-if="editMasterOrderForm.filepath.length">
            <el-form-item
                prop="filepath"
                label="Attachment"
                >            
                    <span  v-for="path in editMasterOrderForm.filepath" :key="path.index">

                        <span v-if="path">
                            <a style="cursor:pointer;color:green; margin-right:50px" @click="downFile(path)">{{path.split('/')[path.split('/').length -1]}}</a>
                            <br>
                        </span>

                    </span>
                <!-- <el-input v-model="editMasterOrderForm.remark" /> -->
            </el-form-item>
            </span>
            <el-form-item
                label="Upload"
                prop="files"
                >
                <el-upload class="pop-upload" :file-list="fileList" :auto-upload="false"
                            :multiple="true" :on-change="handleChange" :on-remove="handleRemove">
                    <el-button size="" type="primary">select files</el-button>
                </el-upload>
            </el-form-item>

        </el-form>

        <el-form ref="editSubRef" v-else :model="editChildOrderForm" label-position='right' label-width="100px" style="margin-right:15px;margin-bottom:0px"> 
            <el-form-item label="University" prop="uni" :rules="[{required: true,message: 'Please input University', trigger: 'blur',}]">
                <el-input v-model="editChildOrderForm.uni"/>
            </el-form-item>
            <el-form-item label="Major" prop="major" :rules="[{required: true,message: 'Please input Major', trigger: 'blur',}]" >
                <el-input v-model="editChildOrderForm.major" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="MajorUrl" prop="major_url" >
                <el-input v-model="editChildOrderForm.major_url" placeholder=""  class="el-select_box"></el-input>
            </el-form-item>
            <el-form-item label="Writer" prop="writer" >
                <el-select v-model="editChildOrderForm.writer" placeholder=""  style="width: 335px;">
                    <el-option 
                        v-for="item in selectTeacherOptions"
                        :key="item.id"
                        :label="item.username"
                        :value="item.teacher"/>
                </el-select>
            </el-form-item>
            <el-form-item label="Plan" prop="plan" :rules="[{required: true,message: 'Please input Plan', trigger: 'blur',}]">
                <el-input v-model="editChildOrderForm.plan" placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label="Course1" prop="course1" >
                <el-input v-model="editChildOrderForm.course1" placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label="CourseUrl1" prop="courseurl1">
                <el-input v-model="editChildOrderForm.courseurl1" placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label="Course2" prop="course2" >
                <el-input v-model="editChildOrderForm.course2" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="CourseUrl2" prop="courseurl2" >
                <el-input v-model="editChildOrderForm.courseurl2" placeholder=""  class="el-select_box"></el-input>
            </el-form-item>
            <el-form-item label="Course3" prop="course3" >
                <el-input v-model="editChildOrderForm.course3" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="CourseUrl3" prop="courseurl3" >
                <el-input v-model="editChildOrderForm.courseurl3" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="Time" prop="time"  :rules="[{required: true,message: 'Please select time', trigger: 'blur',}]">

                <el-date-picker
                v-model="editChildOrderForm.time"
                type="datetimerange"
                range-separator="To"
                start-placeholder="Start"
                end-placeholder="End"
                />
            </el-form-item>
            <!-- </el-col>
                            <el-col span="24"> -->
                <!-- <el-button type="primary" @click="delSubOrder(item, index)" >取消</el-button>
                <el-button type="primary" @click="delSubOrder(item, index)" style="float:right">创建子订单</el-button> -->
            <!-- </el-col>
            </el-row> -->
        </el-form>
        
        <template #footer>
        <span class="dialog-footer">
            <el-button  @click="editOrderVisible = false">Cancel</el-button>
            <!-- <el-button v-else @click="editMasterOrderForm = false">取消</el-button> -->
            <el-button  @click="editOrderFunc" v-preventReClick>Submit</el-button>
        </span>
        </template>
    </el-dialog>


    <!-- 添加子订单对话框 -->
    <el-dialog v-model="childOrderVisible" title="Add sub-order" width="500px" center>        
        <el-form ref="childformRef" :model="childOrderForm" label-position='right' label-width="100px" style="margin-right:15px;margin-bottom:0px"> 
            <el-form-item label="University" prop="uni" :rules="[{required: true,message: 'Please input University', trigger: 'blur',}]">
                <el-input v-model="childOrderForm.uni"/>
            </el-form-item>
            <el-form-item label="Major" prop="major" :rules="[{required: true,message: 'Please input Major', trigger: 'blur',}]" >
                <el-input v-model="childOrderForm.major" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="MajorUrl" prop="majorurl"  >
                <el-input v-model="childOrderForm.majorurl" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="Writer" prop="writer" >
                <el-select v-model="childOrderForm.writer" placeholder=""  style="width: 335px;">
                    <el-option 
                        v-for="item in selectTeacherOptions"
                        :key="item.id"
                        :label="item.username"
                        :value="item.teacher"/>
                </el-select>
            </el-form-item>
            <el-form-item label="Plan" prop="plan" :rules="[{required: true,message: 'Please input Plan', trigger: 'blur',}]">
                <el-input v-model="childOrderForm.plan" placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label="Course1" prop="course1" >
                <el-input v-model="childOrderForm.course1" placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label="CourseUrl1" prop="courseurl1" >
                <el-input v-model="childOrderForm.courseurl1" placeholder="" ></el-input>
            </el-form-item>
            <el-form-item label="Course2" prop="course2" >
                <el-input v-model="childOrderForm.course2" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="CourseUrl2" prop="courseurl2">
                <el-input v-model="childOrderForm.courseurl2" placeholder=""  class="el-select_box"></el-input>
            </el-form-item>
            <el-form-item label="Course3" prop="course3" >
                <el-input v-model="childOrderForm.course3" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="CourseUrl3" prop="courseurl3" >
                <el-input v-model="childOrderForm.courseurl3" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="Time" prop="time" :rules="[{required: true,message: 'Please select time', trigger: 'blur',}]">
                <el-date-picker
                v-model="childOrderForm.time"
                type="datetimerange"
                range-separator="To"
                start-placeholder="Start"
                end-placeholder="End"
                />
            </el-form-item>
            <!-- </el-col>
                            <el-col span="24"> -->
                <!-- <el-button type="primary" @click="delSubOrder(item, index)" >取消</el-button>
                <el-button type="primary" @click="delSubOrder(item, index)" style="float:right">创建子订单</el-button> -->
            <!-- </el-col>
            </el-row> -->
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="childOrderVisible = false">Cancel</el-button>
            <el-button  @click="addSubOrderFunc" v-preventReClick
            >Submit</el-button>
        </span>
        </template>
    </el-dialog>

  <!-- 分页功能-->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="queryInfo.pagenum"
    :page-sizes="[10, 15, 20]"
    :page-size="queryInfo.pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="filteredData.length"
  >
  </el-pagination>
</el-main>
  </el-container>
</template>

<script>
import {getOrder, getWriter, assignWriter, createMasterOrder, updateSubOrder, createSubOrder, inspectSub, downloadOrder, } from '../../api/api'
import { ElMessage } from 'element-plus'

export default {
  name: "HomeView",
  data() {
    return {
      fileList: [],
      textForm:{
        textarea:'',
        textareaCopy:'',
        comment:'',
        id:'',
        status:''
      },
      writerdata:{},
      admin: '',
      userId:'',
      baseUrl: "http://172.16.10.7:8000/api",
      childOrderVisible: false,

      inspectedVisible: false,
      badReason:'',
      badReasonOptions:[],
      editChildOrderForm: {},
      editMasterOrderForm: {
        id:'',
        orderid:'',
        customer:'',
        uni:'',
        major:'',
        remark:'',
        files:[],
        user_id:'',
      },
      ismaster:'',
      editOrderVisible: false,
      editMaster: {},
      editSub: {},
    //   分配老师对话框
      assignTeacherVisible: false,
      selectTeacher:'',
      selectTeacherOptions:[
      ],
      isCollapse: true,
      childOrderForm:{},
      // 用户列表
      orderList: [],
      filterKey: '',
      searchValue: '',
      filterStatus:0,
      activeName:'',
      queryInfo: {
        username: "",
        // 当前页面
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
        query: "",
      },
    //   total: 0,
    };
  },
  directives:{
    preventReClick:{
        mounted: function (el, binding) {
            el.addEventListener('click', () => {
                if (!el.disabled) {
                    el.disabled = true
                    setTimeout(() => {
                        el.disabled = false
                    },binding.value || 3000)
                }
            })
        }        
    }
  },
  computed:{
    // 对后台返回的数据进行过滤
    filteredData(){
        // const sortKey=this.sortKey
        // const filterKey=this.filterKey && this.filterKey.toLowerCase()
        const searchValue=this.searchValue && this.searchValue.toLowerCase()
        const filterStatus=this.filterStatus
        // const order=this.sortOrders[sortKey] || 1
        let data=JSON.parse(JSON.stringify(this.orderList))
        // if (searchValue){
        //     data=data.filter((row)=>{
        //         if(Object.prototype.hasOwnProperty.call(row, 'children')){
        //             return Object.keys(row).some((key)=>{
        //                 return String(row[key]).toLowerCase().indexOf(searchValue) >-1
        //             }) || Object.keys(row.children).some((key)=>{
        //                 // return String(row.children[key]).toLowerCase().indexOf(searchValue)>-1
        //                 const children = row.children.filter((child)=>{
        //                     return Object.keys(child).some((key)=>{
        //                         return String(child[key]).toLowerCase().indexOf(searchValue) >-1
        //                     })
        //                 })
        //                 return children.length > 0
        //             })
        //         }else{
        //             return Object.keys(row).some((key)=>{
        //                 return String(row[key]).toLowerCase().indexOf(searchValue) >-1
        //             })
        //         }
        //     })

        // }
        if(searchValue){
            data = data.map((row)=>{
                if(Object.keys(row).some((key)=>{
                    if(String(key) != 'children'){
                        return String(row[key]).toLowerCase().indexOf(searchValue) > -1
                    }
                })){
                    return row
                }else{
                    if(Object.prototype.hasOwnProperty.call(row, 'children')){
                        row.children = row.children.filter((child)=>{
                            return Object.keys(child).some((key)=>{
                                return String(child[key]).toLowerCase().indexOf(searchValue)>-1
                            })
                        })
                    }
                    return row
                }
            })
            data = data.filter((row)=>{
                if(Object.prototype.hasOwnProperty.call(row, 'children') && row.children.length > 0){
                    return true
                }else{
                    return Object.keys(row).some((key)=>{
                        return String(row[key]).toLowerCase().indexOf(searchValue)>-1
                    })
                }
            })
        }
        if(filterStatus){
            // data=data.filter((row)=>{
            //     if(row.status==filterStatus){
            //         return true
            //     }
            //     if(Object.prototype.hasOwnProperty.call(row, 'children')){
            //         var childList = row.children.filter((child)=>{
            //             return child.status==filterStatus
            //         })
            //         return row.status==filterStatus || childList.length
            //     }
            // })

            data = data.map((row)=>{
                if(Object.prototype.hasOwnProperty.call(row, 'children')){
                    row.children = row.children.filter((child)=>{
                        return child.status==filterStatus
                    })
                }
                return row
            })
            data = data.filter((row) => {
                if(Object.prototype.hasOwnProperty.call(row, 'children') && row.children.length > 0){
                    return true
                }
                return false
            })
        }
        return data

    },
    filterPage(){
        var data=this.filteredData
        var page=this.queryInfo.pagenum
        var pagesize=this.queryInfo.pagesize
        return data.slice((page-1)*pagesize, page*pagesize)
    }
  },
//   mounted(){
//     this.getWriterFunc()
//   },
  created() {
    // this.getUserList();
    // this.total=this.orderList.length
    this.userId = JSON.parse(sessionStorage.getItem("userInfo"))['id'];
    if(JSON.parse(sessionStorage.getItem("userInfo"))['rolename'] == 'admin'){
        this.admin = 1
    }else{
        this.admin = 0
    }
    this.getOrderFunc()
    this.getWriterFunc()

  },

  methods: {
    downFile(path){
         var formdata = new FormData()
        formdata.append('path', path)
        downloadOrder(formdata).then((response)=>{
            try{
                const link = document.createElement('a')
                let blob = new Blob([response.data])
                let filename = path.split('/')[path.split('/').length -1]
                // let filename = response.headers['content-disposition'].split(';')[1].split('=')[1]
                link.style.display='none'
                const url = window.URL || window.webkitURL || window.moxURL;          
                link.href=url.createObjectURL(blob);
                // link.setAttribute('download', filename.substring(filename.lastIndexOf('_')+1))
                link.setAttribute('download', filename)
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                url.revokeObjectURL(link.href);//销毁url对       
                ElMessage({
                    message: 'Download success',
                    type: 'success',
                })        
            }catch(e){
                ElMessage({
                    message: e,
                    type: 'error',
                })
            }
        }).catch((error)=>{
            ElMessage({
                message: error,
                type: 'error',
            })
        })       
    },

    downOrder(row){
        var formdata = new FormData()
        formdata.append('id', row.id)
        downloadOrder(formdata).then((response)=>{
            try{
                const link = document.createElement('a')
                let blob = new Blob([response.data])
                let filename = decodeURI(response.headers['content-disposition']).split(';')[1].split('=')[1]
                link.style.display='none'
                const url = window.URL || window.webkitURL || window.moxURL;          
                link.href=url.createObjectURL(blob);
                // link.setAttribute('download', filename.substring(filename.lastIndexOf('_')+1))
                link.setAttribute('download', filename)
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                url.revokeObjectURL(link.href);//销毁url对       
                ElMessage({
                    message: 'Download success',
                    type: 'success',
                })        
            }catch(e){
                ElMessage({
                    message: e,
                    type: 'error',
                })
            }
        }).catch((error)=>{
            ElMessage({
                message: error,
                type: 'error',
            })
        })

    },
    newOrderId(row){
        return String(row.id) + String(row.ismaster)
    },
    handleRemove(file, fileList) {
        this.editMasterOrderForm.files = fileList
    },
    handleChange(file, fileList) {
        this.editMasterOrderForm.files = fileList
    },
    getWriterFunc(){
        var that=this
        var formdata = new FormData()
        formdata.append('id', 3)
        getWriter(formdata).then((response)=>{
            if(response.data.code==200){
      
                that.selectTeacherOptions=response.data.data
            }else{
                ElMessage({
                    message: response.data.errmsg,
                    type: 'error',
                })
            }
        }).catch(function(error){
            ElMessage({
                message: error,
                type: 'error',
            })
        })
    },
    getOrderFunc(){
        var that = this
        var formdata = new FormData()
        formdata.append('userid', this.userId)
        formdata.append('admin', this.admin)
        getOrder(formdata).then((response)=>{
            if(response.data.code==200){
                that.orderList=response.data.orderList.reverse()
            }else{
                alert(response.data.msg)
            }
        })
    },
    editOrderFunc(){
        var that=this
        if(this.ismaster){
            this.$refs.masterRef.validate((valid) => {
                if(valid == true){
                    var formdata = new FormData()
                    formdata.append('id', that.editMasterOrderForm.id)
                    formdata.append('customer', that.editMasterOrderForm.customer)
                    formdata.append('orderid', that.editMasterOrderForm.orderid)
                    formdata.append('uni', that.editMasterOrderForm.uni)
                    formdata.append('major', that.editMasterOrderForm.major)
                    formdata.append('remark', that.editMasterOrderForm.remark)
                    formdata.append('userid', that.editMasterOrderForm.user_id)
                    that.editMasterOrderForm.files.forEach((file)=>{
                        formdata.append('files', file.raw)
                    })
                    createMasterOrder(formdata).then((response)=>{
                        
                    // updateMasterOrder(this.editMasterOrderForm).then((response)=>{
                        if(response.data.code==200){
                            that.editOrderVisible =false
                            
                            that.getOrderFunc()
                            ElMessage({
                                message: 'The main order has been modified successfully',
                                type: 'success',
                            })
                        }
                    })                    
                }})

        }else{
            this.$refs.editSubRef.validate((valid)=>{
                if(valid){
                    updateSubOrder(that.editChildOrderForm).then((response)=>{
                        if(response.data.code==200){
                            that.editOrderVisible =false
                            
                            that.getOrderFunc()
                            ElMessage({
                                message: 'Sub-order modified successfully',
                                type: 'success',
                            })
                        }
                    })
                }
            })

        }   
    },
    editOrderDialog(row){
        if(row.ismaster){
            this.editOrderVisible =true
            this.ismaster=true
            this.editMasterOrderForm=row
            this.fileList = []
            this.editMasterOrderForm.files = []
        }else{
            if(row.status==3 || row.status==4 || row.status==5){
                ElMessage({
                    message: 'When the sub-order is in the state of quality inspection, rejection or completion, the sub-order information cannot be modified',
                    type: 'warning',
                })
            }else{
                this.editOrderVisible =true
                this.ismaster=false
                this.editChildOrderForm=row
            }               

        }

    },
    addSubOrder(row){
        this.childOrderVisible=true
        this.childOrderForm.id=row.id
    },
    addSubOrderFunc(){
        this.$refs.childformRef.validate((valid)=>{
            if(valid){
                createSubOrder(this.childOrderForm).then((response)=>{
                    if(response.data.code==200){
                        this.childOrderVisible=false
                        this.getOrderFunc()
                    }
                })                  
            }
         
        })

    },
    inspectedDone(){
        var that = this
        if(this.textForm.textarea){
            this.textForm.status=3
            inspectSub(this.textForm).then((response)=>{
                if(response.data.code==200){
                    ElMessage({
                        message: 'Sub-order passed quality inspection',
                        type: 'success',
                    })
                    that.inspectedVisible=false
                    that.getOrderFunc()
                }
            })
        }else{
            ElMessage({
                message: 'The content is empty',
                type: 'warning',
            })
            that.inspectedVisible=false
        }


    },
    inspectedNo(){
        var that = this
        if(this.textForm.comment){
            if(this.textForm.status==3){
                ElMessage({
                    message: 'Sub-order has completed, please contact admin',
                    type: 'warning',
                })                
            }else{
                this.textForm.status=4
                inspectSub(this.textForm).then((response)=>{
                    if(response.data.code==200){
                        ElMessage({
                            message: 'Sub-order rejected',
                            type: 'success',
                        })
                        that.inspectedVisible=false
                        that.getOrderFunc()
                    }
                })
            }

        }else{
            ElMessage({
                message: 'Please type the reason for rejection',
                type: 'error',
            })
        }
    },
    inspectedDialog(row){
        this.inspectedVisible=true
        this.textForm.textarea = row.text
        this.textForm.textareaCopy = row.text
        this.textForm.comment = row.text_comment
        this.textForm.id = row.id
        this.textForm.status = row.status
    },

    selectTeacherFunc(row){
        this.writerdata['id'] = row.id
        this.writerdata['ismaster'] = row.ismaster
        if(row.ismaster){
            this.assignTeacherVisible=true
            // this.getWriterFunc()
        }else{
            if(row.status==3 || row.status==5){
                ElMessage({
                    message: 'When the sub-order is in the state of quality inspection or completion, Can not change writer',
                    type: 'warning',
                })
            }else{
                this.assignTeacherVisible=true
            }
        }

    },
    assignTeacherFunc(){
        this.assignTeacherVisible=false
        // this.selectTeacher
        var formadata = new FormData()
        formadata.append('ismaster',this.writerdata.ismaster)
        formadata.append('id',this.writerdata.id)
        formadata.append('writer',this.selectTeacher)
        assignWriter(formadata).then((response)=>{
            if(response.data.code==200){
                this.getOrderFunc()
                ElMessage({
                    message: response.data.msg,
                    type: 'success',
                })
            }else{
                ElMessage({
                    message: response.data.msg,
                    type: 'error',
                })
            }
        })

    },
    // 过滤
    filterStatusFunc(key){
        this.filterStatus=key
    },
    // 监听页面大小（pagesize）改变的事件(每页显示多少条)
    handleSizeChange(pagesize) {
      // 改变pagesize的大小
      this.queryInfo.pagesize = pagesize;
    },
    // 监听pagenum的事件(点击第几页)
    handleCurrentChange(pagenum) {
      // 把页码改了
      this.queryInfo.pagenum = pagenum;
    },
  },
};
</script>
<style>

</style>