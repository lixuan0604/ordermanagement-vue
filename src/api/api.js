import axios from 'axios';

// let local_host = 'http://172.16.10.7:8848/api';
let local_host = 'http://172.16.10.7:8000/api';



let btnFlag = false

// 提交主订单
export const createMasterOrder = params => { 
    if(btnFlag){
        return 
    }
    btnFlag = true
    return new Promise((resolve, reject) => {
        axios.post(`${local_host}/order/createmaster`, params, {headers:{'Content-Type': 'multipart/form-data'}} ).then(res => {
            resolve(res)
        }).catch(error=>{
            reject(error)
        }).finally(()=>{
            setTimeout(() => {
                btnFlag = false
            }, 500);
        })
    })
}

// 更改主订单
export const updateMasterOrder = params => { return axios.put(`${local_host}/order/createmaster`, params,  ) }

// 提交子订单
export const createSubOrder = params => { return axios.post(`${local_host}/order/createsub`, params,) }

// 更改子订单
export const updateSubOrder = params => { return axios.put(`${local_host}/order/createsub`, params,) }

// 获取订单列表
export const getOrder = params => { return axios.post(`${local_host}/order/getorderlist`, params, {headers:{'Content-Type': 'multipart/form-data'}}) }

// 获取写手列表
// export const getWriter = params => { return axios.post(`${local_host}/user/getwriter`, params, {headers:{'Content-Type': 'multipart/form-data'}}) }
export const getWriter = params => { return axios.post(`${local_host}/user/getuser/`, params, {headers:{'Content-Type': 'multipart/form-data'}}) }

// 分配写手
export const assignWriter = params => { return axios.post(`${local_host}/order/assignwriter`, params, {headers:{'Content-Type': 'multipart/form-data'}}) }


// 质检
export const inspectSub = params => { return axios.post(`${local_host}/order/inspect`, params, {headers:{'Content-Type': 'multipart/form-data'}}) }

// 下载订单
export const downloadOrder = params => { return axios.post(`${local_host}/order/downloadorder`, params, {
    responseType: 'blob',//设置返回类型
  },
  {
     headers:{
         "content-type":"multipart/from-data",
     }
}) }