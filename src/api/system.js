import request from '@/utils/request'

// 获取角色列表
export function getRoleListAPI() {
  return request({
    url: '/park/sys/role'
  })
}

// 获取tree权限列表
export function getTreeListAPI() {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}

// 获取当前角色权限点列表
export function getRoleDetailAPI(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`
  })
}

// 获取角色成员列表
export function getRoleUserAPI(roleId) {
  return request({
    url: `/park/sys/roleUser/${roleId}`
  })
}

// 创建角色
export function createRoleUserAPI(data) {
  return request({
    url: `/park/sys/role`,
    method: 'POST',
    data
  })
}

// 修改角色
export function updateRoleAPI(data) {
  return request({
    url: `/park/sys/role`,
    method: 'PUT',
    data
  })
}

// 删除角色
export function delRoleUserAPI(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`,
    method: 'DELETE'
  })
}
