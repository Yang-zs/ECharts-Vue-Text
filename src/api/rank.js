import request from "@/utils/request";
export const getRank = () => {
    return request({
        url: "rank",
        method: "get"
    });
}
