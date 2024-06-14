import request from '@/utils/request'

const api_name = '/admin/product/brand'

// 分页列表
export const GetBrandPageList = (pageNum, pageSize) => {
  return request({
    url: `${api_name}/findByPage/${pageNum}/${pageSize}`,
    method: 'get'
  })
}