import request from "@/utils/request";
export const getStock = () => {
    return request({
        url: "stock",
        method: "get"
    });
}
