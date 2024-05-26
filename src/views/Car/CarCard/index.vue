<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input
        clearable
        placeholder="请输入内容"
        class="search-main"
        v-model="carNumber"
      />
      <span class="search-label">车主姓名：</span>
      <el-input
        clearable
        placeholder="请输入内容"
        class="search-main"
        v-model="personName"
      />
      <span class="search-label">状态：</span>
      <el-select v-model="cardStatus">
        <el-option
          v-for="item in cardStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" class="search-btn" @click="doSearch">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/car/addMonthCard')">添加月卡</el-button>
      <el-button>批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="tableData">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column
          label="状态"
          prop="cardStatus"
          :formatter="formatStatus"
        />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 添加楼宇 -->
    <el-dialog title="添加楼宇" width="580px">
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCardListAPI } from '@/api/car'

export default {
  data () {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      carNumber: '',
      personName: '',
      cardStatus: '',
      cardStatusList: [
        { label: '全部', value: '' },
        { label: '正常', value: 0 },
        { label: '过期', value: 1 }
      ]
    }
  },
  methods: {
    async getCarCardList () {
      const { data } = await getCardListAPI({
        page: this.page,
        pageSize: this.pageSize,
        carNumber: this.carNumber,
        personName: this.personName,
        cardStatus: this.cardStatus
      })
      console.log(data)
      this.tableData = data.rows
      this.total = data.total
    },
    formatStatus (row, column, cellValue, index) {
      console.log(row, column, cellValue, index)
      return row.cardStatus === 0 ? '正常' : '过期'
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.page = 1
      this.getCarCardList()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getCarCardList()
    },
    indexMethod (index) {
      return (this.page - 1) * this.pageSize + index + 1
    },
    doSearch () {
      this.page = 1
      this.getCarCardList()
    }
  },
  created () {
    this.getCarCardList()
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn {
    margin-left: 20px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>
