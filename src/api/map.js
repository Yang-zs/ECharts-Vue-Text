import request from "@/utils/request";
export const getMapData = ()=>{
    return request({
        url: 'map',
        method: 'GET',
    })
}
export const getChinaMapData = ()=>{
    return request({
        url: 'http://localhost:8989/static/map/china.json',
        method: 'GET',
    })
}
