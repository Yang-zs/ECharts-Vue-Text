import request from "@/utils/request";
export const getHot = () => {
    return request({
        url: "hot",
        method: "get"
    });
}
