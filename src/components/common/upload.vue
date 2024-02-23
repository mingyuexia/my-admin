<template>
	<div :class="[!uploadConfig.showFileList ? '' : 'w-full']">
		<el-upload v-model:file-list="state.fileList" ref="uploadRef" class="upload-demo" :action="uploadUrl"
			:auto-upload="true" :http-request="httpRequest" :accept="uploadConfig?.accept ?? defaultAccept"
			:multiple="uploadConfig?.multiple" :show-file-list="uploadConfig?.showFileList ?? true"
			:on-preview="handlePreview" :on-success="handleSuccess" :on-change="handleUploadChange"
			:list-type="uploadConfig.listType ? uploadConfig.listType : 'text'" :on-remove="handleRemove"
			:before-upload="beforeUpload" :before-remove="beforeRemove" :limit="uploadConfig?.limit"
			:on-exceed="handleExceed">
			<template #tip>
				<div v-if="state.atLimit" class="text-[#88888880] text-[12px] mt-[4px]">
					已达到限制上传数量
				</div>
			</template>
			<slot name="myTrigger"></slot>
		</el-upload>
		<el-dialog v-model="state.dialogVisible">
			<el-image w-full :src="state.dialogImageUrl" alt="Preview Image" />
		</el-dialog>
	</div>
</template>

<script setup>
import { getFileUrl, uploadOne } from "@/api/upload";
import * as qiniu from "qiniu-js";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { ElMessage } from "element-plus";
import { watchEffect } from "vue";
const uploadRef = ref(null);
const uploadUrl = "https://upload.qiniup.com"
const props = defineProps({
	uploadConfig: {
		type: Object,
		default: null,
	},
	idList: {
		type: Array,
		default: () => [],
	},
	fileList: {
		type: Array,
		default: () => [],
	},
});

const state = reactive({
	fileList: [],
	bucket: "",
	dialogVisible: false,
	dialogImageUrl: "",
	uploadToken: "",
	atLimit: false, //当前达到上传数量限制
});
watch(
	() => state.fileList.length,
	(newVal, oldValue) => {
		if (props.uploadConfig.limit && newVal >= props.uploadConfig.limit) {
			state.atLimit = true;
		} else {
			state.atLimit = false;
		}
	}
);
const emit = defineEmits(["update:fileList", "update:idList", "change"]);
const handleSuccess = (response, uploadFile, uploadFiles) => { };
const options = {
	quality: 0.5,
	noCompressIfLarger: true,
	// maxWidth: 1000,
	// maxHeight: 618
};
const defaultAccept = '.jpg,.jpeg,.png,.gif,.zip,.rar,.doc,.xls,.ppt,.docx,.xlsx,.pptx,.pdf'
const beforeUpload = (file) => { }
const beforeRemove = () => { };
const handleUploadChange = (response, uploadFiles) => {
	emit("update:fileList", uploadFiles);
	emit("change");
};
const getToken = async () => {
	const res = await getFileUrl();
	if (res.code == 0) {
		state.uploadToken = res.data.token;
		state.bucket = res.data.bucket;
		state.tokenData = res.data;
	}
};
const uploadQiNiu = async (file) => {
	console.log(file);
	const suffix = file.name.split(".")[1]; //后缀
	const fileName = uuid() + "." + suffix;
	// 当前正在上传的文件的url
	const uploadingUrl = state.tokenData.object + fileName;
	const fileExtensionsRegex = /\.(jpeg|jpg|png|webp)$/i;
	const formdata = new FormData();
	formdata.append("token", state.uploadToken);
	formdata.append("key", state.tokenData.object + fileName);
	formdata.append("fname", state.tokenData.object + fileName);
	//图片才压缩上传
	if (fileExtensionsRegex.test(fileName) && file) {
		try {
			const res = await qiniu.compressImage(file, options);
			formdata.append("file", res.dist);
		} catch (err) {
			ElMessage("图片压缩失败");
			throw new Error("图片压缩失败");
		}
	} else {
		formdata.append("file", file);
	}

	await upload(formdata);
	// 上传七牛成功才会继续上传到后端
	return {
		url: uploadingUrl,
		bucket: state.bucket,
	};
};
const singleUpload = async (file) => {
	const res = await uploadQiNiu(file)
	const params = {
		list: [{ attchType: "college-lzlg", name: file.name, path: res.url }]
	};
	const uploadRes = await uploadOne(params)
	file.uploadId = uploadRes.data.ids[0];
	return uploadRes.data.ids
};
const httpRequest = async (item) => {
	const res = await singleUpload(item.file);
	emit("update:idList", [...props.idList, ...res]);
};
const handlePreview = (file) => {
	if (!props.uploadConfig.listType || props.uploadConfig.listType == "text") {
		return;
	}
	state.dialogImageUrl = file.url;
	state.dialogVisible = true;
};
const handleRemove = (uploadFile, uploadFiles) => {
	state.fileList = uploadFiles;
	// 现存的id合集
	const nowIdList = uploadFiles.map((el) =>
		el.raw ? el.raw.uploadId : el.uploadId
	);
	emit("update:idList", nowIdList);
	emit("update:fileList", state.fileList);
	emit("change");
};

const upload = async (data) => {
	const config = {
		headers: { "Content-Type": "multipart/form-data" },
	};
	try {
		const res = await axios.post(uploadUrl, data, config);
		if (res.status && res.status === 200) {
			return true;
		} else {
			ElMessage("文件上传失败");
			throw new Error("文件上传失败");
		}
	} catch (err) {
		ElMessage(err);
		throw err;
	}
};

watchEffect(() => {
	if (props.fileList && props.fileList.length) {
		state.fileList = props.fileList.map((item) => {
			console.log(item);
			item["name"] = item.name || item.url.split("/").slice(5).join("");
			item["type"] =
				item.type || item["name"] ? item["name"].split(".")[1] : "txt";
			return item;
		});
	}
});
getToken();
</script>

<style>
.el-upload--picture-card {
	width: 90px;
	height: 90px;
}

.el-upload-list--picture-card .el-upload-list__item-thumbnail,
.el-upload-list--picture-card .el-upload-list__item-actions {
	width: 90px;
	height: 90px;
}

.el-upload-list--picture-card .el-upload-list__item {
	width: 90px !important;
	height: 90px !important;
	border: none !important;
}
</style>
