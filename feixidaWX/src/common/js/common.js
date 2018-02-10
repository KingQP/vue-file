export function vajax(that, get, _url, datas, callBack) {
	return that.$axios({
		method: get,
		url: _url,
		headers: {
			"Authorization": localStorage.getItem("token")
		},
		data: datas
	}).then((response) => {
		if(response.data.code == "0") {
			let res = response.data.data;
			layerMsg("发送成功");
			callBack(res);
		}else {
			layerMsg(response.data.msg)
		}
	}).catch((error) => {
//		layer.open({
//		    content: error
//		    ,skin: 'msg'
//		    ,time: 2
//		});
	});
}

export function layerMsg(contents) {
	return layer.open({
		content: contents
	    ,skin: 'msg'
	    ,time: 2
	})
}