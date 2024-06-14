import request from '@/utils/request'

const api_name = '/admin/product/brand'

// 分页列表
export const GetBrandPageList = (pageNum, pageSize) => {
  return request({
    url: `${api_name}/findByPage/${pageNum}/${pageSize}`,
    method: 'get'
  })
}

// 添加品牌
export const SaveBrand = brand => {
    return request({
        url: `${api_name}/saveBrand`,
        method: 'post',
        data: brand,
    })
}

// 修改信息
export const UpdateBrandById = brand => {
  return request({
      url: `${api_name}/updateById`,
      method: 'put',
      data: brand,
  })
}