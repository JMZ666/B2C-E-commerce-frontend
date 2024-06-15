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

// 根据id删除品牌
export const DeleteBrandById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete',
  })
}

// 查询所有的品牌数据
export const FindAllBrand = () => {
  return request({
    url: `${api_name}/findAll`,
    method: 'get',
  })
}