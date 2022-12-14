<template >
  <!-- 主题区域 -->

  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="All tasks" name="first">
      <el-table :data="orderinfo" style="width: 100%; font-size: 0.8rem" border>
        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <el-table
                class="self-header"
                :data="props.row.children"
                style="width: 90%; margin-left: 3rem; font-size: 0.5rem"
                border
                size="mini"
                :cell-style="cellStyle"
              >
                <el-table-column type="index" label="No." align="center">
                </el-table-column>
                <el-table-column
                  label="StartTime"
                  align="center"
                  prop="start_time"
                />
                <el-table-column
                  label="EndTime"
                  align="center"
                  prop="end_time"
                />
                <el-table-column
                  label="University"
                  align="center"
                  prop="university"
                />
                <el-table-column label="Major" align="center" prop="major" />

                <el-table-column
                  label="MajorUrl"
                  align="center"
                  prop="major_url"
                >
                  <template #default="scope">
                    <a
                      :href="scope.row.major_url"
                      target="_blank"
                      class="buttonText"
                      >{{ scope.row.major_url }}</a
                    >
                  </template>
                </el-table-column>

                <el-table-column label="Status" align="center" prop="status">
                  <template #default="scope">
                    <el-tag
                      style="width: 80px; color: black"
                      v-if="scope.row.status == 3"
                      type="info"
                      >{{ "完成" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 4"
                      >{{ "驳回" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 5"
                      type="success"
                      >{{ "质检" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 6"
                      type="danger"
                      >{{ "未分配" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time >= gettime"
                      type="warning"
                      >{{ "未开始" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time < gettime"
                      type="info"
                      >{{ "进行中" }}</el-tag
                    >
                  </template>
                </el-table-column>

                <el-table-column label="Operate">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      @click="editRoleDialog(scope.row)"
                      ><el-icon><EditPen /></el-icon
                    ></el-button>

                    <el-button
                      type="primary"
                      size="small"
                      @click="DetailRoleDialog(scope.row)"
                      ><el-icon><More /></el-icon
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="OrderId" prop="order_id" align="center" />
        <el-table-column label="Customer" prop="customer" align="center" />
        <el-table-column label="University" prop="university" align="center" />
        <el-table-column label="Major" prop="major" align="center" />
        <el-table-column label="Remark" prop="remark" align="center" />
        <el-table-column label="Operate">
          <template #default="scope">
            <el-button
              v-show="scope.row.filepath != ''"
              type="success"
              @click="downloadFile(scope.row)"
              >Attachment</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!--编辑文本对话框-->
      <el-dialog title="Text Edit" v-model="editDialogVisible" width="50%">
        <span class="dialog-footer">
          <el-input
            v-model="textForm.textarea"
            :autosize="{ minRows: 10, maxRows: 4000 }"
            type="textarea"
            placeholder="Please input"
          />
          <el-button
            type="primary"
            @click="submitText"
            :disabled="textstatus == '3'"
            >Submit</el-button
          >
          <el-button @click="editDialogVisible = false">Cancel</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="Order details"
        v-model="detailDialogVisible"
        width="50%"
      >
        <el-descriptions direction="vertical" :column="4" size="default" border>
          <el-descriptions-item label="Plan：">{{
            detailForm.plan
          }}</el-descriptions-item>

          <el-descriptions-item label="Major：">{{
            detailForm.major
          }}</el-descriptions-item>

          <el-descriptions-item label="MajorUrl：" :span="2"
            ><a
              :href="detailForm.major_url"
              target="_blank"
              class="buttonText"
              >{{ detailForm.major_url }}</a
            ></el-descriptions-item
          >

          <el-descriptions-item label="Course1：">{{
            detailForm.course1
          }}</el-descriptions-item>
          <el-descriptions-item label="Course1Url：" :span="2"
            ><a
              :href="detailForm.course1_url"
              target="_blank"
              class="buttonText"
              >{{ detailForm.course1_url }}</a
            ></el-descriptions-item
          >
          <el-descriptions-item label="Course2：">
            {{ detailForm.course2 }}
          </el-descriptions-item>
          <el-descriptions-item label=" Course2Url："
            ><a
              :href="detailForm.course2_url"
              target="_blank"
              class="buttonText"
              >{{ detailForm.course2_url }}</a
            >
          </el-descriptions-item>

          <el-descriptions-item label="Course3：">{{
            detailForm.course3
          }}</el-descriptions-item>

          <el-descriptions-item label=" Course3Url："
            ><a
              :href="detailForm.course3_url"
              target="_blank"
              class="buttonText"
              >{{ detailForm.course3_url }}</a
            >
          </el-descriptions-item>
          <el-descriptions-item label="ReasonsForRejection:">{{
            rdetailForm.reject
          }}</el-descriptions-item>
        </el-descriptions>

        <!-- <el-form label-width="70px" class="demo-ruleForm">
          <el-form-item label=" Plan：" label-width="120px" class="item">{{
            detailForm.plan
          }}</el-form-item>
          <el-form-item label=" Course1：" label-width="120px" class="item">{{
            detailForm.course1
          }}</el-form-item>
          <el-form-item label=" Course1Url：" label-width="120px" class="item">
            <a
              :href="'http://' + detailForm.course1_url"
              target="_blank"
              class="buttonText"
              >{{ detailForm.course1_url }}</a
            >
          </el-form-item>
          <el-form-item label=" Course2：" label-width="120px" class="item">{{
            detailForm.course2
          }}</el-form-item>
          <el-form-item
            label=" Course2Url："
            label-width="120px"
            class="item"
            >{{ detailForm.course2_url }}</el-form-item
          >
          <el-form-item label=" Course3：" label-width="120px" class="item">{{
            detailForm.course3
          }}</el-form-item>
          <el-form-item
            label=" Course3Url："
            label-width="120px"
            class="item"
            >{{ detailForm.course3_url }}</el-form-item
          >
        </el-form> -->
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="Not started" name="second">
      <el-table
        :data="orderstartinfo"
        style="width: 100%; font-size: 0.8rem"
        border
      >
        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <el-table
                class="self-header"
                :data="props.row.children"
                style="width: 95%; margin-left: 3rem; font-size: 0.5rem"
                border
                size="mini"
                :cell-style="cellStyle"
              >
                <el-table-column type="index" label="No." align="center">
                </el-table-column>
                <el-table-column
                  label="StartTime"
                  align="center"
                  prop="start_time"
                />
                <el-table-column label="EndTime" align="center" />
                <el-table-column
                  label="University"
                  align="center"
                  prop="university"
                />
                <el-table-column label="Major" align="center" prop="major" />

                <!-- <el-table-column
                  label="MajorUrl"
                  align="center"
                  prop="major_url"
                  width="350"
                >
                  <template #default="scope">
                    <el-link
                      type="success"
                      :href="scope.row.major_url"
                      target="_blank"
                      :underline="false"
                      class="buttonText"
                      >{{ "Engineering (Civil Engineering)" }}</el-link
                    >
                  </template>
                </el-table-column> -->
                <el-table-column
                  label="MajorUrl"
                  align="center"
                  prop="major_url"
                >
                  <template #default="scope">
                    <a
                      :href="scope.row.major_url"
                      target="_blank"
                      class="buttonText"
                      >{{ scope.row.major_url }}</a
                    >
                  </template>
                </el-table-column>
                <el-table-column label="Status" align="center" prop="status">
                  <template #default="scope">
                    <el-tag
                      style="width: 80px; color: black"
                      v-if="scope.row.status == 3"
                      type="info"
                      >{{ "完成" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 4"
                      >{{ "驳回" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 5"
                      type="success"
                      >{{ "质检" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 6"
                      type="danger"
                      >{{ "未分配" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time >= gettime"
                      type="warning"
                      >{{ "未开始" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time < gettime"
                      type="info"
                      >{{ "进行中" }}</el-tag
                    >
                  </template>
                </el-table-column>
                <el-table-column label="Operate">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      @click="editRoleDialog(scope.row)"
                      ><el-icon><EditPen /></el-icon
                    ></el-button>

                    <el-button
                      type="primary"
                      size="small"
                      @click="nDetailRoleDialog(scope.row)"
                      ><el-icon><More /></el-icon
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="OrderId" prop="order_id" align="center" />
        <el-table-column label="Customer" prop="customer" align="center" />
        <el-table-column label="University" prop="university" align="center" />
        <el-table-column label="Major" prop="major" align="center" />
        <el-table-column label="Remark" prop="remark" align="center" />
        <el-table-column label="Operate">
          <template #default="scope">
            <el-button
              v-show="scope.row.filepath != ''"
              type="success"
              @click="downloadFile(scope.row)"
              >Attachment</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能-->
      <el-pagination
        @size-change="nhandleSizeChange"
        @current-change="nhandleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="starttotal"
      >
      </el-pagination>

      <!--编辑文本对话框-->
      <el-dialog title="Text Edit" v-model="editDialogVisible" width="50%">
        <span class="dialog-footer">
          <el-input
            v-model="textForm.textarea"
            :autosize="{ minRows: 10, maxRows: 4000 }"
            type="textarea"
            placeholder="Please input"
          />
          <el-button type="primary" @click="submitText">Submit</el-button>
          <el-button @click="editDialogVisible = false">Cancel</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="Order details"
        v-model="ndetailDialogVisible"
        width="50%"
      >
        <el-descriptions direction="vertical" :column="4" size="default" border>
          <el-descriptions-item label="Plan：">{{
            ndetailForm.plan
          }}</el-descriptions-item>

          <el-descriptions-item label="Major：">{{
            ndetailForm.major
          }}</el-descriptions-item>

          <el-descriptions-item label="MajorUrl：" :span="2"
            ><a
              :href="ndetailForm.major_url"
              target="_blank"
              class="buttonText"
              >{{ ndetailForm.major_url }}</a
            ></el-descriptions-item
          >

          <el-descriptions-item label="Course1：">{{
            ndetailForm.course1
          }}</el-descriptions-item>
          <el-descriptions-item label="Course1Url：" :span="2"
            ><a
              :href="ndetailForm.course1_url"
              target="_blank"
              class="buttonText"
              >{{ ndetailForm.course1_url }}</a
            ></el-descriptions-item
          >
          <el-descriptions-item label="Course2：">
            {{ ndetailForm.course2 }}
          </el-descriptions-item>
          <el-descriptions-item label=" Course2Url："
            ><a
              :href="ndetailForm.course2_url"
              target="_blank"
              class="buttonText"
              >{{ ndetailForm.course2_url }}</a
            >
          </el-descriptions-item>

          <el-descriptions-item label="Course3：">{{
            ndetailForm.course3
          }}</el-descriptions-item>

          <el-descriptions-item label=" Course3Url："
            ><a
              :href="ndetailForm.course3_url"
              target="_blank"
              class="buttonText"
              >{{ ndetailForm.course3_url }}</a
            >
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="Ongoing" name="third">
      <el-table
        :data="orderongoinginfo"
        style="width: 100%; font-size: 0.8rem"
        border
      >
        {{ orderongoinginfo }}
        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <el-table
                class="self-header"
                :data="props.row.children"
                style="width: 95%; margin-left: 3rem; font-size: 0.5rem"
                border
                size="mini"
                :cell-style="cellStyle"
              >
                <el-table-column type="index" label="No." align="center">
                </el-table-column>
                <el-table-column
                  label="StartTime"
                  align="center"
                  prop="start_time"
                />
                <el-table-column
                  label="EndTime"
                  align="center"
                  prop="end_time"
                />
                <el-table-column
                  label="University"
                  align="center"
                  prop="university"
                />
                <el-table-column label="Major" align="center" prop="major" />

                <el-table-column
                  label="MajorUrl"
                  align="center"
                  prop="major_url"
                >
                  <template #default="scope">
                    <a
                      :href="scope.row.major_url"
                      target="_blank"
                      class="buttonText"
                      >{{ scope.row.major_url }}</a
                    >
                  </template>
                </el-table-column>
                <el-table-column label="Status" align="center" prop="status">
                  <template #default="scope">
                    <el-tag
                      style="width: 80px; color: black"
                      v-if="scope.row.status == 3"
                      type="info"
                      >{{ "完成" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 4"
                      >{{ "驳回" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 5"
                      type="success"
                      >{{ "质检" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 6"
                      type="danger"
                      >{{ "未分配" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time >= gettime"
                      type="warning"
                      >{{ "未开始" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time < gettime"
                      type="info"
                      >{{ "进行中" }}</el-tag
                    >
                  </template>
                </el-table-column>

                <el-table-column label="Operate">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      @click="editRoleDialog(scope.row)"
                      ><el-icon><EditPen /></el-icon
                    ></el-button>

                    <el-button
                      type="primary"
                      size="small"
                      @click="oDetailRoleDialog(scope.row)"
                      ><el-icon><More /></el-icon
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="OrderId" prop="order_id" align="center" />
        <el-table-column label="Customer" prop="customer" align="center" />
        <el-table-column label="University" prop="university" align="center" />
        <el-table-column label="Major" prop="major" align="center" />
        <el-table-column label="Remark" prop="remark" align="center" />
        <el-table-column label="Operate">
          <template #default="scope">
            <el-button
              v-show="scope.row.filepath != ''"
              type="success"
              @click="downloadFile(scope.row)"
              >Attachment</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能-->
      <el-pagination
        @size-change="phandleSizeChange"
        @current-change="phandleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="processtotal"
      >
      </el-pagination>

      <!--编辑文本对话框-->
      <el-dialog title="Text Edit" v-model="editDialogVisible" width="50%">
        <span class="dialog-footer">
          <el-input
            v-model="textForm.textarea"
            :autosize="{ minRows: 10, maxRows: 4000 }"
            type="textarea"
            placeholder="Please input"
          />
          <el-button
            type="primary"
            @click="submitText"
            :disabled="textstatus == '3'"
            >Submit</el-button
          >
          <el-button @click="editDialogVisible = false">Cancel</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="Order details"
        v-model="odetailDialogVisible"
        width="50%"
      >
        <el-descriptions direction="vertical" :column="4" size="default" border>
          <el-descriptions-item label="Plan：">{{
            odetailForm.plan
          }}</el-descriptions-item>

          <el-descriptions-item label="Major：">{{
            odetailForm.major
          }}</el-descriptions-item>

          <el-descriptions-item label="MajorUrl：" :span="2"
            ><a
              :href="odetailForm.major_url"
              target="_blank"
              class="buttonText"
              >{{ odetailForm.major_url }}</a
            ></el-descriptions-item
          >

          <el-descriptions-item label="Course1：">{{
            odetailForm.course1
          }}</el-descriptions-item>
          <el-descriptions-item label="Course1Url：" :span="2"
            ><a
              :href="odetailForm.course1_url"
              target="_blank"
              class="buttonText"
              >{{ odetailForm.course1_url }}</a
            ></el-descriptions-item
          >
          <el-descriptions-item label="Course2：">
            {{ odetailForm.course2 }}
          </el-descriptions-item>
          <el-descriptions-item label=" Course2Url："
            ><a
              :href="odetailForm.course2_url"
              target="_blank"
              class="buttonText"
              >{{ odetailForm.course2_url }}</a
            >
          </el-descriptions-item>

          <el-descriptions-item label="Course3：">{{
            odetailForm.course3
          }}</el-descriptions-item>

          <el-descriptions-item label=" Course3Url："
            ><a
              :href="odetailForm.course3_url"
              target="_blank"
              class="buttonText"
              >{{ odetailForm.course3_url }}</a
            >
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="Checking" name="fourth">
      <el-table
        :data="ordercheckinfo"
        style="width: 100%; font-size: 0.8rem"
        border
      >
        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <el-table
                class="self-header"
                :data="props.row.children"
                style="width: 95%; margin-left: 3rem; font-size: 0.5rem"
                border
                size="mini"
                :cell-style="cellStyle"
              >
                <el-table-column type="index" label="No." align="center">
                </el-table-column>
                <el-table-column
                  label="StartTime"
                  align="center"
                  prop="start_time"
                />
                <el-table-column
                  label="EndTime"
                  align="center"
                  prop="end_time"
                />
                <el-table-column
                  label="University"
                  align="center"
                  prop="university"
                />
                <el-table-column label="Major" align="center" prop="major" />

                <el-table-column
                  label="MajorUrl"
                  align="center"
                  prop="major_url"
                >
                  <template #default="scope">
                    <a
                      :href="scope.row.major_url"
                      target="_blank"
                      class="buttonText"
                      >{{ scope.row.major_url }}</a
                    >
                  </template>
                </el-table-column>
                <el-table-column label="Status" align="center" prop="status">
                  <template #default="scope">
                    <el-tag
                      style="width: 80px; color: black"
                      v-if="scope.row.status == 3"
                      type="info"
                      >{{ "完成" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 4"
                      >{{ "驳回" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 5"
                      type="success"
                      >{{ "质检" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 6"
                      type="danger"
                      >{{ "未分配" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time >= gettime"
                      type="warning"
                      >{{ "未开始" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time < gettime"
                      type="info"
                      >{{ "进行中" }}</el-tag
                    >
                  </template>
                </el-table-column>
                <el-table-column label="Operate">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      @click="editRoleDialog(scope.row)"
                      ><el-icon><EditPen /></el-icon
                    ></el-button>

                    <el-button
                      type="primary"
                      size="small"
                      @click="cDetailRoleDialog(scope.row)"
                      ><el-icon><More /></el-icon
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="OrderId" prop="order_id" align="center" />
        <el-table-column label="Customer" prop="customer" align="center" />
        <el-table-column label="University" prop="university" align="center" />
        <el-table-column label="Major" prop="major" align="center" />
        <el-table-column label="Remark" prop="remark" align="center" />
        <el-table-column label="Operate" fixed="right" width="130">
          <template #default="scope">
            <el-button
              v-show="scope.row.filepath != ''"
              type="success"
              @click="downloadFile(scope.row)"
              >Attachment</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能-->
      <el-pagination
        @size-change="chandleSizeChange"
        @current-change="chandleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="checkingtotal"
      >
      </el-pagination>

      <!--编辑文本对话框-->
      <el-dialog title="Text Edit" v-model="editDialogVisible" width="50%">
        <span class="dialog-footer">
          <el-input
            v-model="textForm.textarea"
            :autosize="{ minRows: 10, maxRows: 4000 }"
            type="textarea"
            placeholder="Please input"
          />
          <el-button
            type="primary"
            @click="submitText"
            :disabled="textstatus == '3'"
            >Submit</el-button
          >
          <el-button @click="editDialogVisible = false">Cancel</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="Order details"
        v-model="cdetailDialogVisible"
        width="50%"
      >
        <el-descriptions direction="vertical" :column="4" size="default" border>
          <el-descriptions-item label="Plan：">{{
            cdetailForm.plan
          }}</el-descriptions-item>

          <el-descriptions-item label="Major：">{{
            cdetailForm.major
          }}</el-descriptions-item>

          <el-descriptions-item label="MajorUrl：" :span="2"
            ><a
              :href="cdetailForm.major_url"
              target="_blank"
              class="buttonText"
              >{{ cdetailForm.major_url }}</a
            ></el-descriptions-item
          >

          <el-descriptions-item label="Course1：">{{
            cdetailForm.course1
          }}</el-descriptions-item>
          <el-descriptions-item label="Course1Url：" :span="2"
            ><a
              :href="cdetailForm.course1_url"
              target="_blank"
              class="buttonText"
              >{{ cdetailForm.course1_url }}</a
            ></el-descriptions-item
          >
          <el-descriptions-item label="Course2：">
            {{ cdetailForm.course2 }}
          </el-descriptions-item>
          <el-descriptions-item label=" Course2Url："
            ><a
              :href="cdetailForm.course2_url"
              target="_blank"
              class="buttonText"
              >{{ cdetailForm.course2_url }}</a
            >
          </el-descriptions-item>

          <el-descriptions-item label="Course3：">{{
            cdetailForm.course3
          }}</el-descriptions-item>

          <el-descriptions-item label=" Course3Url："
            ><a
              :href="cdetailForm.course3_url"
              target="_blank"
              class="buttonText"
              >{{ cdetailForm.course3_url }}</a
            >
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="Rejected" name="five">
      <el-table
        :data="orderrejectinfo"
        style="width: 100%; font-size: 0.8rem"
        border
      >
        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <el-table
                class="self-header"
                :data="props.row.children"
                style="width: 95%; margin-left: 3rem; font-size: 0.5rem"
                border
                size="mini"
                :cell-style="cellStyle"
              >
                <el-table-column type="index" label="No." align="center">
                </el-table-column>
                <el-table-column
                  label="StartTime"
                  align="center"
                  prop="start_time"
                />
                <el-table-column
                  label="EndTime"
                  align="center"
                  prop="end_time"
                />
                <el-table-column
                  label="University"
                  align="center"
                  prop="university"
                />
                <el-table-column label="Major" align="center" prop="major" />

                <el-table-column
                  label="MajorUrl"
                  align="center"
                  prop="major_url"
                >
                  <template #default="scope">
                    <a
                      :href="scope.row.major_url"
                      target="_blank"
                      class="buttonText"
                      >{{ scope.row.major_url }}</a
                    >
                  </template>
                </el-table-column>
                <el-table-column label="Status" align="center" prop="status">
                  <template #default="scope">
                    <el-tag
                      style="width: 80px; color: black"
                      v-if="scope.row.status == 3"
                      type="info"
                      >{{ "完成" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 4"
                      >{{ "驳回" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 5"
                      type="success"
                      >{{ "质检" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 6"
                      type="danger"
                      >{{ "未分配" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time >= gettime"
                      type="warning"
                      >{{ "未开始" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time < gettime"
                      type="info"
                      >{{ "进行中" }}</el-tag
                    >
                  </template>
                </el-table-column>

                <el-table-column label="Operate">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      @click="editRoleDialog(scope.row)"
                      ><el-icon><EditPen /></el-icon
                    ></el-button>
                    <el-button
                      type="primary"
                      size="small"
                      @click="rDetailRoleDialog(scope.row)"
                      ><el-icon><More /></el-icon
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="OrderId" prop="order_id" align="center" />
        <el-table-column label="Customer" prop="customer" align="center" />
        <el-table-column label="University" prop="university" align="center" />
        <el-table-column label="Major" prop="major" align="center" />
        <el-table-column label="Remark" prop="remark" align="center" />
        <el-table-column label="Operate">
          <template #default="scope">
            <el-button
              v-show="scope.row.filepath != ''"
              type="success"
              @click="downloadFile(scope.row)"
              >Attachment</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能-->
      <el-pagination
        @size-change="rchandleSizeChange"
        @current-change="rchandleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="rejecttotal"
      >
      </el-pagination>

      <!--编辑文本对话框-->
      <el-dialog title="Text Edit" v-model="editDialogVisible" width="50%">
        <span class="dialog-footer">
          <el-input
            v-model="textForm.textarea"
            :autosize="{ minRows: 10, maxRows: 4000 }"
            type="textarea"
            placeholder="Please input"
          />
          <el-button
            type="primary"
            @click="submitText"
            :disabled="textstatus == '3'"
            >Submit</el-button
          >
          <el-button @click="editDialogVisible = false">Cancel</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="Order details"
        v-model="rdetailDialogVisible"
        width="50%"
      >
        <el-descriptions direction="vertical" :column="4" size="default" border>
          <el-descriptions-item label="Plan：">{{
            rdetailForm.plan
          }}</el-descriptions-item>

          <el-descriptions-item label="Major：">{{
            rdetailForm.major
          }}</el-descriptions-item>

          <el-descriptions-item label="MajorUrl：" :span="2"
            ><a
              :href="rdetailForm.major_url"
              target="_blank"
              class="buttonText"
              >{{ rdetailForm.major_url }}</a
            ></el-descriptions-item
          >

          <el-descriptions-item label="Course1：">{{
            rdetailForm.course1
          }}</el-descriptions-item>
          <el-descriptions-item label="Course1Url：" :span="2"
            ><a
              :href="rdetailForm.course1_url"
              target="_blank"
              class="buttonText"
              >{{ rdetailForm.course1_url }}</a
            ></el-descriptions-item
          >
          <el-descriptions-item label="Course2：">
            {{ rdetailForm.course2 }}
          </el-descriptions-item>
          <el-descriptions-item label=" Course2Url："
            ><a
              :href="rdetailForm.course2_url"
              target="_blank"
              class="buttonText"
              >{{ rdetailForm.course2_url }}</a
            >
          </el-descriptions-item>

          <el-descriptions-item label="Course3：">{{
            rdetailForm.course3
          }}</el-descriptions-item>

          <el-descriptions-item label=" Course3Url："
            ><a
              :href="rdetailForm.course3_url"
              target="_blank"
              class="buttonText"
              >{{ rdetailForm.course3_url }}</a
            >
          </el-descriptions-item>
          <el-descriptions-item label="ReasonsForRejection:">{{
            rdetailForm.reject
          }}</el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="Finish" name="six">
      <el-table
        :data="orderfinishinfo"
        style="width: 100%; font-size: 0.8rem"
        border
      >
        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <el-table
                class="self-header"
                :data="props.row.children"
                style="width: 95%; margin-left: 3rem; font-size: 0.5rem"
                border
                size="mini"
                :cell-style="cellStyle"
              >
                <el-table-column type="index" label="No." align="center">
                </el-table-column>
                <el-table-column
                  label="StartTime"
                  align="center"
                  prop="start_time"
                />
                <el-table-column
                  label="EndTime"
                  align="center"
                  prop="end_time"
                />
                <el-table-column
                  label="University"
                  align="center"
                  prop="university"
                />
                <el-table-column label="Major" align="center" prop="major" />

                <el-table-column
                  label="MajorUrl"
                  align="center"
                  prop="major_url"
                >
                  <template #default="scope">
                    <a
                      :href="scope.row.major_url"
                      target="_blank"
                      class="buttonText"
                      >{{ scope.row.major_url }}</a
                    >
                  </template>
                </el-table-column>
                <el-table-column label="Status" align="center" prop="status">
                  <template #default="scope">
                    <el-tag
                      style="width: 80px; color: black"
                      v-if="scope.row.status == 3"
                      type="info"
                      >{{ "完成" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 4"
                      >{{ "驳回" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 5"
                      type="success"
                      >{{ "质检" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.status == 6"
                      type="danger"
                      >{{ "未分配" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time >= gettime"
                      type="warning"
                      >{{ "未开始" }}</el-tag
                    >
                    <el-tag
                      style="width: 80px"
                      v-else-if="scope.row.start_time < gettime"
                      type="info"
                      >{{ "进行中" }}</el-tag
                    >
                  </template>
                </el-table-column>

                <el-table-column label="Operate">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      @click="editRoleDialog(scope.row)"
                      ><el-icon><EditPen /></el-icon
                    ></el-button>
                    <el-button
                      type="primary"
                      size="small"
                      @click="fDetailRoleDialog(scope.row)"
                      ><el-icon><More /></el-icon
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="OrderId" prop="order_id" align="center" />
        <el-table-column label="Customer" prop="customer" align="center" />
        <el-table-column label="University" prop="university" align="center" />
        <el-table-column label="Major" prop="major" align="center" />
        <el-table-column label="Remark" prop="remark" align="center" />
        <el-table-column label="Operate">
          <template #default="scope">
            <el-button
              v-show="scope.row.filepath != ''"
              type="success"
              @click="downloadFile(scope.row)"
              >Attachment</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能-->
      <el-pagination
        @size-change="fhandleSizeChange"
        @current-change="fhandleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="finishtotal"
      >
      </el-pagination>

      <!--编辑文本对话框-->
      <el-dialog title="Text Edit" v-model="editDialogVisible" width="50%">
        <span class="dialog-footer">
          <el-input
            v-model="textForm.textarea"
            :autosize="{ minRows: 10, maxRows: 4000 }"
            type="textarea"
            placeholder="Please input"
          />
          <el-button
            type="primary"
            @click="submitText"
            :disabled="textstatus == '3'"
            >Submit</el-button
          >
          <el-button @click="editDialogVisible = false">Cancel</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="Order details"
        v-model="fdetailDialogVisible"
        width="50%"
      >
        <el-descriptions direction="vertical" :column="4" size="default" border>
          <el-descriptions-item label="Plan：">{{
            fdetailForm.plan
          }}</el-descriptions-item>

          <el-descriptions-item label="Major：">{{
            fdetailForm.major
          }}</el-descriptions-item>

          <el-descriptions-item label="MajorUrl：" :span="2"
            ><a
              :href="fdetailForm.major_url"
              target="_blank"
              class="buttonText"
              >{{ fdetailForm.major_url }}</a
            ></el-descriptions-item
          >

          <el-descriptions-item label="Course1：">{{
            fdetailForm.course1
          }}</el-descriptions-item>
          <el-descriptions-item label="Course1Url：" :span="2"
            ><a
              :href="fdetailForm.course1_url"
              target="_blank"
              class="buttonText"
              >{{ fdetailForm.course1_url }}</a
            ></el-descriptions-item
          >
          <el-descriptions-item label="Course2：">
            {{ fdetailForm.course2 }}
          </el-descriptions-item>
          <el-descriptions-item label=" Course2Url："
            ><a
              :href="fdetailForm.course2_url"
              target="_blank"
              class="buttonText"
              >{{ fdetailForm.course2_url }}</a
            >
          </el-descriptions-item>

          <el-descriptions-item label="Course3：">{{
            fdetailForm.course3
          }}</el-descriptions-item>

          <el-descriptions-item label=" Course3Url："
            ><a
              :href="fdetailForm.course3_url"
              target="_blank"
              class="buttonText"
              >{{ fdetailForm.course3_url }}</a
            >
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      baseUrl: "http://172.16.10.7:8000/api",
      userInfo: null,
      activeName: "first",
      orderinfo: [],
      // 进行中
      orderongoinginfo: [],
      // 待质检
      ordercheckinfo: [],
      orderstartinfo: [],
      orderrejectinfo: [],
      orderfinishinfo: [],
      textstatus: "",

      textForm: {
        subid: "",
        writer_name: "",
        textarea: "",
      },
      // 订单详情
      detailForm: {},
      ndetailForm: {},
      odetailForm: {},
      cdetailForm: {},
      rdetailForm: {},
      fdetailForm: {},

      gettime: "",

      // 编辑文本对话框
      editDialogVisible: false,
      detailDialogVisible: false,
      ndetailDialogVisible: false,
      odetailDialogVisible: false,
      cdetailDialogVisible: false,
      rdetailDialogVisible: false,
      fdetailDialogVisible: false,
      total: 0,
      starttotal: 0,
      processtotal: 0,
      checkingtotal: 0,
      rejecttotal: 0,
      finishtotal: 0,
      queryInfo: {
        // 当前页面
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
        query: "",
        userid: "",
        rolename: "",
      },
    };
  },
  created() {
    this.queryInfo.userid = JSON.parse(sessionStorage.getItem("userInfo")).id;
    this.queryInfo.rolename = JSON.parse(
      sessionStorage.getItem("userInfo")
    ).rolename;
    this.getTaskList();
    this.getCurrentTime();
  },
  methods: {
    getCurrentTime() {
      //获取当前时间并打印
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      _this.gettime = yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
    },

    cellStyle(row) {
      if (row.row.status == 1 && row.column.label == "Status") {
        return { color: "#6495ED" };
      } else if (row.row.status == 2 && row.column.label == "Status") {
        return { color: "#D8BFD8" };
      } else if (row.row.status == 3 && row.column.label == "Status") {
        return { color: "#008000" };
      } else if (row.row.status == 4 && row.column.label == "Status") {
        return { color: "#87CEEB" };
      } else if (row.row.status == 5 && row.column.label == "Status") {
        return { color: "#7FFFD4" };
      } else if (row.row.status == 6 && row.column.label == "Status") {
        return { color: "#DCDCDC" };
      }
    },

    handleClick(tab, event) {
      if (tab.index == 0) {
        console.log("");
      } else if (tab.index == 1) {
        this.getStartCheckList();
      } else if (tab.index == 2) {
        this.getTaskDetailList();
      } else if (tab.index == 3) {
        this.getTaskCheckList();
      } else if (tab.index == 4) {
        this.getRejectCheckList();
      } else if (tab.index == 5) {
        this.getFinishCheckList();
      }
    },
    async getTaskList() {
      let that = this;
      const { data: res } = await axios.get(that.baseUrl + "/task/orderinfo/", {
        params: this.queryInfo,
      });
      that.orderinfo = res.result;
      console.log(res.result);
      that.total = res.total;
    },
    // 监听页面大小（pagesize）改变的事件(每页显示多少条)
    handleSizeChange(pagesize) {
      // 改变pagesize的大小
      this.queryInfo.pagesize = pagesize;
      // 重新加载用户列表数据
      this.getTaskList();
    },
    // 监听pagenum的事件(点击第几页)
    handleCurrentChange(pagenum) {
      // 把页码改了
      this.queryInfo.pagenum = pagenum;
      // 重新加载用户列表数据
      this.getTaskList();
    },
    // 获取进行中订单详情
    async getTaskDetailList() {
      let that = this;
      const { data: res } = await axios.get(that.baseUrl + "/task/ongoing/", {
        params: this.queryInfo,
      });
      that.orderongoinginfo = res.result;
      that.processtotal = res.total;
    },
    // 监听页面大小（pagesize）改变的事件(每页显示多少条)
    phandleSizeChange(pagesize) {
      // 改变pagesize的大小
      this.queryInfo.pagesize = pagesize;
      // 重新加载用户列表数据
      this.getTaskDetailList();
    },
    // 监听pagenum的事件(点击第几页)
    phandleCurrentChange(pagenum) {
      // 把页码改了
      this.queryInfo.pagenum = pagenum;
      // 重新加载用户列表数据
      this.getTaskDetailList();
    },
    // 获取带质检订单详情
    async getTaskCheckList() {
      let that = this;
      const { data: res } = await axios.get(that.baseUrl + "/task/check/", {
        params: this.queryInfo,
      });
      that.ordercheckinfo = res.result;
      that.checkingtotal = res.total;
    },
    // 监听页面大小（pagesize）改变的事件(每页显示多少条)
    chandleSizeChange(pagesize) {
      // 改变pagesize的大小
      this.queryInfo.pagesize = pagesize;
      // 重新加载用户列表数据
      this.getTaskCheckList();
    },
    // 监听pagenum的事件(点击第几页)
    chandleCurrentChange(pagenum) {
      // 把页码改了
      this.queryInfo.pagenum = pagenum;
      // 重新加载用户列表数据
      this.getTaskCheckList();
    },
    // 获取未开始订单详情
    async getStartCheckList() {
      let that = this;
      const { data: res } = await axios.get(that.baseUrl + "/task/notstart/", {
        params: this.queryInfo,
      });
      that.orderstartinfo = res.result;
      that.starttotal = res.total;
    },
    // 监听页面大小（pagesize）改变的事件(每页显示多少条)
    nhandleSizeChange(pagesize) {
      // 改变pagesize的大小
      this.queryInfo.pagesize = pagesize;
      // 重新加载用户列表数据
      this.getStartCheckList();
    },
    // 监听pagenum的事件(点击第几页)
    nhandleCurrentChange(pagenum) {
      // 把页码改了
      this.queryInfo.pagenum = pagenum;
      // 重新加载用户列表数据
      this.getStartCheckList();
    },
    // 获取驳回订单详情
    async getRejectCheckList() {
      let that = this;
      const { data: res } = await axios.get(that.baseUrl + "/task/reject/", {
        params: this.queryInfo,
      });
      that.orderrejectinfo = res.result;
      that.rejecttotal = res.total;
    },
    // 监听页面大小（pagesize）改变的事件(每页显示多少条)
    rchandleSizeChange(pagesize) {
      // 改变pagesize的大小
      this.queryInfo.pagesize = pagesize;
      // 重新加载用户列表数据
      this.getRejectCheckList();
    },
    // 监听pagenum的事件(点击第几页)
    rchandleCurrentChange(pagenum) {
      // 把页码改了
      this.queryInfo.pagenum = pagenum;
      // 重新加载用户列表数据
      this.getRejectCheckList();
    },
    // 获取完成订单详情
    async getFinishCheckList() {
      let that = this;
      const { data: res } = await axios.get(that.baseUrl + "/task/finish/", {
        params: this.queryInfo,
      });
      that.orderfinishinfo = res.result;
      that.finishtotal = res.total;
    },
    // 监听页面大小（pagesize）改变的事件(每页显示多少条)
    fhandleSizeChange(pagesize) {
      // 改变pagesize的大小
      this.queryInfo.pagesize = pagesize;
      // 重新加载用户列表数据
      this.getFinishCheckList();
    },
    // 监听pagenum的事件(点击第几页)
    fhandleCurrentChange(pagenum) {
      // 把页码改了
      this.queryInfo.pagenum = pagenum;
      // 重新加载用户列表数据
      this.getFinishCheckList();
    },
    // 编辑对话框
    async editRoleDialog(userInfo) {
      // 此处判断文章的状态
      this.textstatus = userInfo.status;
      this.editDialogVisible = true;
      this.textForm.subid = userInfo.id;
      this.textForm.writer_name = userInfo.writer_name;

      const { data: res } = await axios.get(
        this.baseUrl + "/task/submittext/?subid=" + userInfo.id
      );
      if (res.code == 1) {
        return this.$message.error(res.error);
      }
      this.textForm.textarea = res.result.text;
    },

    // 编辑对话框
    async DetailRoleDialog(userInfo) {
      // 此处判断文章的状态
      this.detailDialogVisible = true;
      this.detailForm = userInfo;
    },
    // 编辑对话框
    async nDetailRoleDialog(userInfo) {
      // 此处判断文章的状态
      this.ndetailDialogVisible = true;
      this.ndetailForm = userInfo;
    },
    async oDetailRoleDialog(userInfo) {
      // 此处判断文章的状态
      this.odetailDialogVisible = true;
      this.odetailForm = userInfo;
    },
    async cDetailRoleDialog(userInfo) {
      // 此处判断文章的状态
      this.cdetailDialogVisible = true;
      this.cdetailForm = userInfo;
    },
    async rDetailRoleDialog(userInfo) {
      // 此处判断文章的状态
      this.rdetailDialogVisible = true;
      this.rdetailForm = userInfo;
    },
    async fDetailRoleDialog(userInfo) {
      // 此处判断文章的状态
      this.fdetailDialogVisible = true;
      this.fdetailForm = userInfo;
    },

    async submitText() {
      const { data: res } = await axios.post(
        this.baseUrl + "/task/submittext/",
        this.textForm
      );
      if (res.code == 1) {
        return this.$message.error(res.error);
      }
      this.$message.success("Text submitted successfully");
      this.editDialogVisible = false;
    },
    // 下载文件
    async downloadFile(info) {
      if (eval(info.filepath)) {
        for (var i = 0; i < eval(info.filepath).length; i++) {
          await axios
            .post(
              this.baseUrl + "/task/orderinfo/",
              {
                //如果没有要传给后台的数据这里可以为空,但最好留着这个花括号,不然后台可能将response当做数据
                masterorder_id: info.master_id,
                filepath: eval(info.filepath)[i],
              },
              {
                responseType: "blob",
              },
              {
                headers: {
                  "Content-Type": "application/json;charset=UTF-8",
                },
              }
            )
            .then((response) => {
              //headers请求头的乱码数据转换为中文
              const fileName = decodeURI(
                eval(info.filepath)[i].split("/")[
                  eval(info.filepath)[i].split("/").length - 1
                ]

                // response.headers["content-disposition"]
                //   .split('/')[response.headers["content-disposition"].split('/').length -1]
              );
              //下载文件
              let blob = new Blob([response.data], {
                type: "application/octet-stream",
              });
              let objectUrl = URL.createObjectURL(blob); // 创建URL
              const link = document.createElement("a");
              link.href = objectUrl;
              // link.download = '.xlsx'// 自定义文件名
              //这里是获取后台传过来的文件名
              link.setAttribute("download", fileName);
              link.click(); // 下载文件
              URL.revokeObjectURL(objectUrl); // 释放内存
            })
            .catch((error) => {
              alert(error);
            });
        }
      } else {
        alert("No reference");
      }
    },
  },
};
</script>

<style scope>
.self-header .el-table__header thead th {
  background-color: rgba(163, 195, 201, 0.867) !important;
}

a {
  text-decoration: none;
}
.item .el-form-item__label {
  color: blue;
}
</style>