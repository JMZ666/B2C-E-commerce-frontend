import request from '@/utils/request'

// 分页查询
export const GetSysUserListByPage = (pageNum , pageSize , queryDto) => {
    return request({
        url: "/admin/system/sysUser/findByPage/" + pageNum + "/" + pageSize,
        method: 'get',
        params: queryDto
    })
}