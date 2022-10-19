<script setup>
import { getAxiosParam} from '../utils/request';
import { showLoading} from '../utils/index';
import axios from 'axios';
function filterHandler() {
   showLoading();
   let url='wwww.baidu.com';
   let params="wwwww";
   let token="333444";
   
    let config=getAxiosParam({ url: url, params: params, token: token, method: "post" });
    console.log("======",config)
}
</script>

<template>
    <el-button>Default</el-button>
    <el-button type="primary" @click="filterHandler">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
</template>
