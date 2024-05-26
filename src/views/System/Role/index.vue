<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="(item, index) in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{ active: index === activeIndex }"
        @click="changeRole(index)"
      >
        <div class="role-info">
          <svg-icon
            :icon-class="index === activeIndex ? 'user-active' : 'user'"
            class="icon"
          />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="$router.push(`/addRole?id=${item.roleId}`)"
              >编辑角色</el-dropdown-item>
              <el-dropdown-item @click.native="delRole(item.roleId)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/addRole')">添加角色</el-button>
    </div>

    <el-tabs v-model="activeName">
      <el-tab-pane label="功能权限" name="first">
        <div class="right-wrapper">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="tree"
                node-key="id"
                :data="item.children"
                :props="defaultProps"
                show-checkbox
                :default-expand-all="true"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="`成员 (${userTotal})`" name="second">
        <el-table
          :data="tableData">
          <el-table-column
            prop="id"
            label="ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="员工姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="登录账号">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getRoleListAPI, getTreeListAPI, getRoleDetailAPI, getRoleUserAPI, delRoleUserAPI } from '@/api/system'
// 给按钮添加禁用状态
function addDisabled(children) {
  children.forEach(item => {
    item.disabled = true
    if (item.children && item.children.length) {
      addDisabled(item.children)
    }
  })
  return children
}

export default {
  name: 'Role',
  data() {
    return {
      roleList: [],
      activeIndex: 0,
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      perms: [],
      activeName: 'first',
      tableData: [],
      userTotal: 0
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleListAPI()
      this.roleList = res.data
    },
    // 获取权限列表
    async getTreeList() {
      const res = await getTreeListAPI()
      this.treeList = addDisabled(res.data)
    },
    // 获取角色权限点
    async getRoleDetail(roleId) {
      const res = await getRoleDetailAPI(roleId)
      this.perms = res.data.perms
      // 高亮权限列表
      const treeComponentList = this.$refs.tree
      // 调用setCheckedKeys方法
      treeComponentList.forEach((tree, index) => {
        tree.setCheckedKeys(this.perms[index])
      })
    },
    // 获取角色用户列表
    async getRoleUser(roleId) {
      const res = await getRoleUserAPI(roleId)
      this.tableData = res.data.rows
      this.userTotal = res.data.total
      console.log(res)
    },
    // 切换角色index
    async changeRole(index) {
      this.activeIndex = index
      await this.getTreeList()
      // 高亮 Tree 节点
      const roleId = this.roleList[index].roleId
      // 获取当前角色下的权限点数据列表
      this.getRoleDetail(roleId)
      // 获取当前角色下的用户列表
      this.getRoleUser(roleId)
    },
    delRole(roleId) {
      this.$confirm('是否确认删除当前角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delRoleUserAPI(roleId)
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }
  },
  created() {
    this.getRoleList()
  },
  // 生命周期里先以第一项roleId获取
  async mounted() {
    // 先获取角色列表和可选权限列表
    await this.getRoleList()
    await this.getTreeList()
    // 再获取当前角色下的权限列表
    this.getRoleDetail(this.roleList[0].roleId)
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding: 20px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn {
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .tree-item {
        flex: 0 0 auto;
        width: 25%;
        border-right: 1px solid #e4e7ec;
        padding: 0px 10px;
        margin-bottom: 10px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper {
      padding: 20px;
    }
  }

  .el-tabs {
      flex: 1;
    }
}
</style>
