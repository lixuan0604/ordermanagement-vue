<template>

        <el-container>
          <!-- 主题区域 -->
          <el-main>
            <el-breadcrumb separator=">" style="margin-bottom:15px">
              <el-breadcrumb-item><router-link to="/order">Order management</router-link></el-breadcrumb-item>
              <el-breadcrumb-item><a href=""></a>Bulk order</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- <label>基本信息</label> -->
            <el-form
                ref="formRef"
                :model="dynamicOrderForm"
                label-width="120px"
                class="demo-dynamic"
            >
            <div class="masterOrder">
                <el-row  style="margin-right:30px">
                <!-- <el-col :span="4"></el-col> -->
                <!-- <el-col :span="4"> -->
                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" >
                <el-form-item
                prop="masterOrder.orderid"
                label="OrderId"
                >
                <el-input v-model="dynamicOrderForm.masterOrder.orderid" />
                </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" >
                <el-form-item
                style="float:right"
                prop="masterOrder.customer"
                label="Customer"
                :rules="[
                    {
                    required: true,
                    message: 'Please input customer name',
                    trigger: 'blur',
                    },
                ]"
                >
                <el-input v-model="dynamicOrderForm.masterOrder.customer" />
                </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" style="float:right">
                <el-form-item
                style="float:right"
                prop="masterOrder.uni"
                label="University"
                :rules="[
                    {
                    required: true,
                    message: 'Please input University',
                    trigger: 'blur',
                    },
                ]"
                >
                <el-input v-model="dynamicOrderForm.masterOrder.uni" />
                </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <el-form-item
                prop="masterOrder.major"
                label="Major"
                :rules="[
                    {
                    required: true,
                    message: 'Please input major',
                    trigger: 'blur',
                    },
                ]"
                >
                <el-input v-model="dynamicOrderForm.masterOrder.major" />
                </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <el-form-item
                prop="masterOrder.remark"
                label="Remark"
                :rules="[
                    {
                    required: true,
                    message: 'Please input Remark',
                    trigger: 'blur',
                    },
                ]"
                >
                <el-input v-model="dynamicOrderForm.masterOrder.remark" />
                </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" >
                <el-form-item
                style="float:right"
                prop="masterOrder.files"
                >
                <el-upload class="pop-upload" :file-list="fileList" :auto-upload="false"
                            :multiple="true" :on-change="handleChange" :on-remove="handleRemove">
                    <el-button size="" type="primary">select files</el-button>
                </el-upload>
                </el-form-item>
                
        
                </el-col>
                </el-row>
                </div>
                <div >
                    <div class="subOrder" v-for="(item, index) in dynamicOrderForm.subOrder" :key="item.key">
                        <el-row style="margin-right:30px">
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="University" :prop="'subOrder.' + index + '.uni'" :rules="[{required: true,message: 'Please input University', trigger: 'blur',}]">
                            <el-input v-model="item.uni"/>
                        </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="Major" :prop="'subOrder.' + index + '.major'" :rules="[{required: true,message: 'Please input Major', trigger: 'blur',}]">
                            <el-input v-model="item.major" placeholder=""  class="el-select_box"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="MajorUrl" :prop="'subOrder.' + index + '.majorurl'" >
                            <el-input v-model="item.majorurl" placeholder=""  class="el-select_box"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="Writer" :prop="'subOrder.' + index + '.writer'" >
                            <el-select v-model="item.writer" placeholder=""  class="el-select_box">
                                <el-option 
                                    v-for="item in selectTeacherOptions"
                                    :key="item.id"
                                    :label="item.username"
                                    :value="item.teacher"/>
                                
                            </el-select>
                        </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="Plan" :prop="'subOrder.' + index + '.plan'" :rules="[{required: true,message: 'Please input Plan', trigger: 'blur',}]">
                            <el-input v-model="item.plan" placeholder=""  class="el-select_box"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="Time" :prop="'subOrder.' + index + '.time'"   :rules="[{required: true,message: 'Please select time', trigger: 'blur',}]">
                            <!-- <el-input v-model="item.plan" placeholder=""  class="el-select_box"></el-input> -->
                            <el-date-picker
                            v-model="item.time"
                            type="datetimerange"
                            range-separator="To"
                            start-placeholder="Start"
                            end-placeholder="End"
                            />
                        </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="Course1" :prop="'subOrder.' + index + '.course1'" >
                            <el-input v-model="item.course1" placeholder=""  class="el-select_box"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="CourseUrl1" :prop="'subOrder.' + index + '.courseurl1'" >
                            <el-input v-model="item.courseurl1" placeholder=""  class="el-select_box"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="Course2" :prop="'subOrder.' + index + '.course2'" >
                            <el-input v-model="item.course2" placeholder=""  class="el-select_box"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="CourseUrl2" :prop="'subOrder.' + index + '.courseurl2'" >
                            <el-input v-model="item.courseurl2" placeholder=""  class="el-select_box"></el-input>
                        </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="Course3" :prop="'subOrder.' + index + '.course3'" >
                            <el-input v-model="item.course3" placeholder=""  class="el-select_box"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                        <el-form-item label="CourseUrl3" :prop="'subOrder.' + index + '.courseurl3'">
                            <el-input v-model="item.courseurl3" placeholder=""  class="el-select_box"></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" >
                        <el-form-item label=' '>
                            <el-button type="primary" @click="delSubOrder(item, index)"  class="el-select_box" >Delete sub-order</el-button>
                        </el-form-item>
                        </el-col>
                        </el-row>         
                    </div>
                </div>
                <el-form-item class="formButton">
                <el-button type="primary" @click="addSubOrder">Add sub-order</el-button>
                <el-button style="float:left" type="primary" @click="submitForm(this.$refs.formRef)" v-preventReClick>Submit</el-button>
                
                <!-- <el-button @click="resetForm(formRef)">Reset</el-button> -->
                </el-form-item>
            </el-form>
          </el-main>
        </el-container>
</template>

<script>
import {createMasterOrder, createSubOrder, getWriter} from '../../api/api'
import { ElMessage } from 'element-plus'
export default {
  name: "HomeView",
  data() {
    return {
      userId :'',
      fileList: [],
      isCollapse: true,
      selectTeacherOptions:[],
      dynamicOrderForm: {
        masterOrder:{
            orderid:'',
            customer:'',
            uni:'',
            major:'',
            remark:'',
            files:[],
        },
        subOrder:[],
      },

    };
  },
  created() {
    this.getWriterFunc()
    this.userId = JSON.parse(sessionStorage.getItem("userInfo"))['id'];
  },

  methods: {
    handleRemove(file, fileList) {
        this.dynamicOrderForm.masterOrder.files = fileList
    },
    handleChange(file, fileList) {
        this.dynamicOrderForm.masterOrder.files = fileList

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
    addSubOrder(){
        this.dynamicOrderForm.subOrder.push({
            // key:Date.now,
            uni:'',
            major:'',
            majorurl:'',
            writer:'',
            course1:'',
            courseurl1:'',
            course2:'',
            courseurl2:'',
            course3:'',
            courseurl3:'',
            plan:'',
            time:[]
        })
    },
    delSubOrder(item, index){
        this.index = this.dynamicOrderForm.subOrder.indexOf(item)
        if (index !== -1) {
            this.dynamicOrderForm.subOrder.splice(index, 1)
        }
    },
    submitForm(formRef){
        // console.log(this.$refs.formRef)
        // console.log(this.dynamicOrderForm)
        // this.$refs.formRef.validate(async valid => {
        //     console.log(valid)
        // })
        var that = this
        formRef.validate((valid) => {
            if(valid == true){
                var masterformdata = new FormData()
                masterformdata.append('orderid', that.dynamicOrderForm.masterOrder.orderid)
                masterformdata.append('customer', that.dynamicOrderForm.masterOrder.customer)
                masterformdata.append('uni', that.dynamicOrderForm.masterOrder.uni)
                masterformdata.append('major', that.dynamicOrderForm.masterOrder.major)
                masterformdata.append('remark', that.dynamicOrderForm.masterOrder.remark)
                masterformdata.append('userid', that.userId)
                // console.log(that.dynamicOrderForm.masterOrder.files instanceof Array)
                that.dynamicOrderForm.masterOrder.files.forEach((file) => {
                    masterformdata.append('files', file.raw)
                })
                createMasterOrder(masterformdata).then((response)=>{
                    if(response.data.code==200){
                        var masterId = response.data.master_id
                        createSubOrder({subOrderList:that.dynamicOrderForm.subOrder, masterId:masterId}).then((response)=>{
                        // createSubOrder(subformdata).then((response)=>{
                            if(response.data.code==200){
                                ElMessage({
                                    message: 'Order successfully created',
                                    type: 'success',
                                })
                                this.$router.push("/order")
                            }else{
                                ElMessage({
                                    message: response.data.msg,
                                    type: 'error',
                                })
                                this.$router.push("/order")
                            }
                        }).catch(function(error){
                            ElMessage({
                                message: error,
                                type: 'error',
                            })
                        })
                        // this.$router.push("/order")
                    }else{
                        ElMessage({
                            message: response.data.msg,
                            type: 'error',
                        })
                    }
                }).catch(function(error){
                    ElMessage({
                        message: error,
                        type: 'error',
                    })
                })
            }
        })
    }
  },
};
</script>
<style>

.el-menu {
  border-width: 0;
}

.this-aside {
  height: 100vh;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.this-header {
  display: -ms-flexbox;
  display: flex;

  -ms-flex-pack: justify;
  justify-content: space-between;
}
.masterOrder{
    background-color:white;
    /* padding: 20px; */
    margin-bottom: 20px;
}
.el-row{
    padding-top: 20px;
}
.subOrder{
    background-color: white;
    margin-bottom: 20px;
    /* padding: 20px; */
}
/* .formButton{
    margin-top:20px;
    margin-left:0px !important;
} */
.el-form-item__content{
    margin-left: 0px !important;
}
</style>
